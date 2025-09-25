package com.nodedjava.exam.service;

import com.nodedjava.exam.model.ContentElement;
import com.nodedjava.exam.model.Question;
import jakarta.annotation.PostConstruct;
import org.apache.poi.hemf.usermodel.HemfPicture;
import org.apache.poi.hwmf.usermodel.HwmfPicture;
import org.apache.poi.ooxml.POIXMLDocumentPart;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.w3c.dom.Node;

import javax.imageio.ImageIO;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.Dimension2D;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class WordExtractorService {

    private Transformer transformer;
    private boolean transformerInitialized = false;

    // Specific, non-greedy patterns for each option type
    private static final Pattern BRACKET_LETTER_PATTERN = Pattern.compile("\\([A-Ea-e]\\)");
    private static final Pattern DOTTED_LETTER_PATTERN = Pattern.compile("(?<![\\w\\d])\\b[A-Ea-e]\\.");
    private static final Pattern DOTTED_NUMBER_PATTERN = Pattern.compile("(?<![\\w\\d])\\b[1-5]\\.");
    public static final Pattern GENERIC_OPTION_PATTERN = Pattern.compile("(?:\\([A-Ea-e1-5]\\)|(?<![\\w\\d])\\b[A-Ea-e1-5]\\.)");

    @PostConstruct
    public void init() {
        System.setProperty("java.awt.headless", "true");
        try {
            TransformerFactory factory = TransformerFactory.newInstance("net.sf.saxon.TransformerFactoryImpl", null);
            Source xslt = new StreamSource(new ClassPathResource("omml2latex.xsl").getInputStream());
            transformer = factory.newTransformer(xslt);
            transformerInitialized = true;
            System.out.println("SUCCESS: XSLT Transformer initialized for OMML formulas.");
        } catch (Exception e) {
            transformerInitialized = false;
            System.out.println("INFO: Could not initialize OMML transformer. Math formulas will not be processed. Error: " + e.getMessage());
        }
    }

    public void parseQuestionBlock(List<IBodyElement> blockElements, Question question) {
        List<ContentElement> flattenedContent = new ArrayList<>();
        for (IBodyElement element : blockElements) {
            if (element instanceof XWPFParagraph p) {
                flattenedContent.addAll(extractRichContentFromParagraph(p));
            } else if (element instanceof XWPFTable table) {
                flattenedContent.add(extractTableContent(table));
            }
        }
        if (flattenedContent.isEmpty()) return;
        splitAndAssignContent(flattenedContent, question);
    }

    private void splitAndAssignContent(List<ContentElement> flattenedContent, Question question) {
        Pattern activePattern = detectOptionPattern(flattenedContent);
        List<OptionMarker> optionMarkers = findOptionMarkers(flattenedContent, activePattern);

        if (optionMarkers.isEmpty()) {
            question.setQuestionContent(flattenedContent);
            return;
        }

        List<ContentElement> questionContent = new ArrayList<>();
        OptionMarker firstMarker = optionMarkers.get(0);

        for (int i = 0; i < firstMarker.elementIndex; i++) {
            questionContent.add(flattenedContent.get(i));
        }

        ContentElement firstMarkerElement = flattenedContent.get(firstMarker.elementIndex);
        if ("text".equals(firstMarkerElement.type()) && firstMarker.charIndex > 0) {
            String text = (String) firstMarkerElement.content();
            questionContent.add(new ContentElement("text", text.substring(0, firstMarker.charIndex)));
        }

        question.setQuestionContent(questionContent);

        List<List<ContentElement>> options = new ArrayList<>();
        for (int i = 0; i < optionMarkers.size(); i++) {
            OptionMarker currentMarker = optionMarkers.get(i);
            OptionMarker nextMarker = (i + 1 < optionMarkers.size()) ? optionMarkers.get(i + 1) : null;
            List<ContentElement> optionContent = extractOptionContent(flattenedContent, currentMarker, nextMarker);
            if (!optionContent.isEmpty()) {
                options.add(optionContent);
            }
        }
        question.setOptions(options);
    }

    private static class OptionMarker {
        int elementIndex, charIndex;
        String marker;
        OptionMarker(int elementIndex, int charIndex, String marker) { this.elementIndex = elementIndex; this.charIndex = charIndex; this.marker = marker; }
    }

    private List<OptionMarker> findOptionMarkers(List<ContentElement> flattenedContent, Pattern pattern) {
        List<OptionMarker> markers = new ArrayList<>();
        for (int i = 0; i < flattenedContent.size(); i++) {
            ContentElement element = flattenedContent.get(i);
            if ("text".equals(element.type())) {
                String text = ((String) element.content()).replace('\u00A0', ' ');
                Matcher matcher = pattern.matcher(text);
                while (matcher.find()) {
                    markers.add(new OptionMarker(i, matcher.start(), matcher.group()));
                }
            }
        }
        return markers;
    }

    private List<ContentElement> extractOptionContent(List<ContentElement> flattenedContent, OptionMarker currentMarker, OptionMarker nextMarker) {
        List<ContentElement> optionContent = new ArrayList<>();
        ContentElement currentElement = flattenedContent.get(currentMarker.elementIndex);

        if ("text".equals(currentElement.type())) {
            String text = (String) currentElement.content();
            int startIndex = currentMarker.charIndex;
            int endIndex = (nextMarker != null && nextMarker.elementIndex == currentMarker.elementIndex) ? nextMarker.charIndex : text.length();
            String optionText = text.substring(startIndex, endIndex).trim();
            if (!optionText.isEmpty()) {
                optionContent.add(new ContentElement("text", optionText));
            }
        }

        int startElementIndex = currentMarker.elementIndex + 1;
        int endElementIndex = (nextMarker != null) ? nextMarker.elementIndex : flattenedContent.size();

        for (int i = startElementIndex; i < endElementIndex; i++) {
            optionContent.add(flattenedContent.get(i));
        }

        if (nextMarker != null && nextMarker.elementIndex == (endElementIndex - 1) && "text".equals(flattenedContent.get(endElementIndex - 1).type())) {
            optionContent.remove(optionContent.size() - 1);
            String text = (String) flattenedContent.get(nextMarker.elementIndex).content();
            String partialText = text.substring(0, nextMarker.charIndex).trim();
            if (!partialText.isEmpty()) {
                optionContent.add(new ContentElement("text", partialText));
            }
        }
        return optionContent;
    }

    private Pattern detectOptionPattern(List<ContentElement> content) {
        String combinedText = getCombinedText(content);
        if (isPatternConsistent(combinedText, BRACKET_LETTER_PATTERN, "(A)", "(B)", "(C)")) return BRACKET_LETTER_PATTERN;
        if (isPatternConsistent(combinedText, DOTTED_LETTER_PATTERN, "A.", "B.", "C.")) return DOTTED_LETTER_PATTERN;
        if (isPatternConsistent(combinedText, DOTTED_NUMBER_PATTERN, "1.", "2.", "3.")) return DOTTED_NUMBER_PATTERN;
        return GENERIC_OPTION_PATTERN;
    }

    private boolean isPatternConsistent(String text, Pattern pattern, String... markers) {
        int foundCount = 0;
        for (String marker : markers) {
            if (text.contains(marker)) foundCount++;
        }
        return foundCount >= 2;
    }

    private String getCombinedText(List<ContentElement> elements) {
        StringBuilder sb = new StringBuilder();
        for (ContentElement el : elements) {
            if ("text".equals(el.type())) {
                sb.append(((String) el.content()).replace('\u00A0', ' '));
            }
        }
        return sb.toString();
    }

    public List<ContentElement> extractRichContentFromParagraph(XWPFParagraph p) {
        List<ContentElement> elements = new ArrayList<>();
        for (IRunElement runElement : p.getIRuns()) {
            if (runElement instanceof XWPFRun run) {
                String text = run.text();
                if (text != null && !text.isEmpty()) {
                    elements.add(new ContentElement("text", text));
                }

                for (XWPFPicture pic : run.getEmbeddedPictures()) {
                    ContentElement imgElement = convertPictureDataToContentElement(pic.getPictureData());
                    if(imgElement != null) {
                        elements.add(imgElement);
                    }
                }

                if (run.getCTR().getObjectList() != null) {
                    for (CTObject ctObject : run.getCTR().getObjectList()) {
                        extractOleImage(ctObject.getDomNode(), p, elements);
                    }
                }

                if (transformerInitialized && run.getCTR().toString().contains("m:oMath")) {
                    try {
                        for (Node node : findOMaths(run.getCTR().getDomNode())) {
                            StringWriter result = new StringWriter();
                            transformer.transform(new DOMSource(node), new StreamResult(result));
                            String latex = result.toString().trim();
                            if (!latex.isEmpty()) {
                                elements.add(new ContentElement("formula", latex));
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Error transforming OMML in run: " + e.getMessage());
                    }
                }
            }
        }
        return elements;
    }

    private void extractOleImage(Node node, XWPFParagraph p, List<ContentElement> elements) {
        if (node == null) return;

        if ("imagedata".equals(node.getLocalName()) && "urn:schemas-microsoft-com:vml".equals(node.getNamespaceURI())) {
            Node rIdNode = node.getAttributes().getNamedItemNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
            if (rIdNode != null) {
                String rId = rIdNode.getNodeValue();
                try {
                    POIXMLDocumentPart relatedPart = p.getDocument().getRelationById(rId);
                    if (relatedPart instanceof XWPFPictureData) {
                        ContentElement imgElement = convertPictureDataToContentElement((XWPFPictureData) relatedPart);
                        if(imgElement != null) {
                            elements.add(imgElement);
                            System.out.println("SUCCESS: Extracted legacy OLE object as image: " + ((XWPFPictureData) relatedPart).getFileName());
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error extracting OLE image with rId=" + rId + ": " + e.getMessage());
                }
                return;
            }
        }
        org.w3c.dom.NodeList children = node.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            extractOleImage(children.item(i), p, elements);
        }
    }

    private ContentElement convertPictureDataToContentElement(XWPFPictureData pictureData) {
        try {
            byte[] bytes = pictureData.getData();
            String filename = pictureData.getFileName();
            String lowerFilename = filename.toLowerCase();

            if (lowerFilename.endsWith(".wmf") || lowerFilename.endsWith(".emf")) {
                System.out.println("INFO: Converting vector image to PNG using POI-Scratchpad: " + filename);
                BufferedImage pngImage = null;
                Dimension2D dim;

                // ** ROBUST PARSING LOGIC **
                // Try to parse as EMF first, as it's more common and might be mislabeled as WMF.
                try (ByteArrayInputStream stream = new ByteArrayInputStream(bytes)) {
                    HemfPicture emfImage = new HemfPicture(stream);
                    dim = emfImage.getSize();
                    if (dim.getWidth() <= 0 || dim.getHeight() <= 0) throw new IOException("Invalid EMF dimensions");

                    // Render at a higher resolution for better clarity
                    double scale = 2.0;
                    int width = (int)Math.ceil(dim.getWidth() * scale);
                    int height = (int)Math.ceil(dim.getHeight() * scale);

                    pngImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
                    Graphics2D g2 = pngImage.createGraphics();

                    // Apply all high-quality rendering hints
                    applyRenderingHints(g2);
                    g2.scale(scale, scale);

                    emfImage.draw(g2, new Rectangle2D.Double(0, 0, dim.getWidth(), dim.getHeight()));
                    g2.dispose();
                    System.out.println("DEBUG: Successfully parsed as EMF: " + filename);
                } catch (Exception emfEx) {
                    // If EMF parsing fails, fall back to WMF.
                    System.out.println("DEBUG: Failed to parse as EMF, trying WMF for: " + filename + " (" + emfEx.getMessage() + ")");
                    try (ByteArrayInputStream stream = new ByteArrayInputStream(bytes)) {
                        stream.mark(22);
                        byte[] header = new byte[22];
                        if (stream.read(header) == 22 && header[0] == (byte)0xD7 && header[1] == (byte)0xCD && header[2] == (byte)0xC6 && header[3] == (byte)0x9A) {
                            System.out.println("DEBUG: Placeable WMF header detected and skipped.");
                        } else {
                            stream.reset();
                        }
                        HwmfPicture wmfImage = new HwmfPicture(stream);
                        dim = wmfImage.getSize();
                        if (dim.getWidth() <= 0 || dim.getHeight() <= 0) throw new IOException("Invalid WMF dimensions");

                        double scale = 2.0;
                        int width = (int)Math.ceil(dim.getWidth() * scale);
                        int height = (int)Math.ceil(dim.getHeight() * scale);
                        pngImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
                        Graphics2D g2 = pngImage.createGraphics();

                        // Apply all high-quality rendering hints
                        applyRenderingHints(g2);
                        g2.scale(scale, scale);

                        wmfImage.draw(g2, new Rectangle2D.Double(0, 0, dim.getWidth(), dim.getHeight()));
                        g2.dispose();
                        System.out.println("DEBUG: Successfully parsed as WMF: " + filename);
                    }
                }

                if (pngImage != null) {
                    try (ByteArrayOutputStream pngStream = new ByteArrayOutputStream()) {
                        ImageIO.write(pngImage, "png", pngStream);
                        String base64Img = Base64.getEncoder().encodeToString(pngStream.toByteArray());
                        return new ContentElement("image", base64Img, "image/png");
                    }
                }
                return null;

            } else {
                String base64Img = Base64.getEncoder().encodeToString(bytes);
                String extension = filename.substring(filename.lastIndexOf('.') + 1);
                return new ContentElement("image", base64Img, "image/" + extension);
            }
        } catch (Exception e) {
            System.err.println("Error converting picture data for " + pictureData.getFileName() + ": " + e.getMessage());
            return null;
        }
    }

    /**
     * Applies a set of high-quality rendering hints to a Graphics2D object
     * to improve the clarity of the output PNG.
     */
    private void applyRenderingHints(Graphics2D g2) {
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_FRACTIONALMETRICS, RenderingHints.VALUE_FRACTIONALMETRICS_ON);
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g2.setColor(Color.WHITE);
        g2.fillRect(0, 0, Integer.MAX_VALUE, Integer.MAX_VALUE); // Fill the entire clip region
    }


    private List<Node> findOMaths(Node node) {
        List<Node> oMathNodes = new ArrayList<>();
        String nodeName = node.getNodeName();
        if ("m:oMath".equals(nodeName) || "oMath".equals(nodeName) || nodeName.endsWith(":oMath")) {
            oMathNodes.add(node);
        }
        for (int i = 0; i < node.getChildNodes().getLength(); i++) {
            oMathNodes.addAll(findOMaths(node.getChildNodes().item(i)));
        }
        return oMathNodes;
    }

    public ContentElement extractTableContent(XWPFTable table) {
        List<List<List<ContentElement>>> tableContent = new ArrayList<>();
        for (XWPFTableRow row : table.getRows()) {
            List<List<ContentElement>> rowContent = new ArrayList<>();
            for (XWPFTableCell cell : row.getTableCells()) {
                List<ContentElement> cellContent = new ArrayList<>();
                for (XWPFParagraph p : cell.getParagraphs()) {
                    cellContent.addAll(extractRichContentFromParagraph(p));
                }
                rowContent.add(cellContent);
            }
            tableContent.add(rowContent);
        }
        return new ContentElement("table", tableContent);
    }
}

