package com.nodedjava.exam.service;


import org.springframework.stereotype.Service;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.InputStream;

@Service
public class OmmlToLatexConverter {

    private final Transformer transformer;

    public OmmlToLatexConverter() throws Exception {
        // Load the XSLT stylesheet from the classpath resources
        InputStream xsltStream = getClass().getClassLoader().getResourceAsStream("omml2latex.xsl");
        if (xsltStream == null) {
            throw new RuntimeException("omml2latex.xsl not found in resources.");
        }
        StreamSource xsltSource = new StreamSource(xsltStream);

        // Create a transformer factory and a transformer instance
        // Using Saxon for XSLT 2.0+ support which is more powerful
        TransformerFactory factory = TransformerFactory.newInstance("net.sf.saxon.TransformerFactoryImpl", null);
        this.transformer = factory.newTransformer(xsltSource);
    }

    /**
     * Converts an OMML XML string to a LaTeX string.
     * @param ommlXml The OMML XML content.
     * @return The converted LaTeX string.
     */
    public String convert(String ommlXml) {
        try {
            StringReader reader = new StringReader(ommlXml);
            StringWriter writer = new StringWriter();
            transformer.transform(new StreamSource(reader), new StreamResult(writer));
            return writer.toString();
        } catch (Exception e) {
            // Log the error and return a placeholder
            System.err.println("Error converting OMML to LaTeX: " + e.getMessage());
            return "[Formula conversion error]";
        }
    }
}
