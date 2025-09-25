package com.nodedjava.exam.service;

import com.nodedjava.exam.model.*;
import org.apache.poi.xwpf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@Service
public class QuizExtractorService {

    private final WordExtractorService wordExtractorService;
    private Logger logger = LoggerFactory.getLogger(QuizExtractorService.class);

    public QuizExtractorService(WordExtractorService wordExtractorService) {
        this.wordExtractorService = wordExtractorService;
    }

    private static final Pattern QUESTION_START_PATTERN = Pattern.compile("^(?:Q|QQ)?\\s*(\\d{1,3})\\.\\s*");
    private static final Pattern ANSWER_KEY_START_PATTERN = Pattern.compile("^AnswerKeys$", Pattern.CASE_INSENSITIVE);
    private static final Pattern ANSWER_KEY_LINE_PATTERN = Pattern.compile("(\\d+)\\s*([A-Ea-e1-5])");

    public QuizParseResult parseQuizFromDocx(MultipartFile file) {
        try (InputStream is = file.getInputStream(); XWPFDocument doc = new XWPFDocument(is)) {

            List<Question> questions = new ArrayList<>();
            Map<Integer, Integer> answers = new HashMap<>();

            List<IBodyElement> allElements = doc.getBodyElements();
            logger.info("Total body elements in document: {}", allElements);

            // Phase 1: Pre-scan to find all question and answer key locations
            Map<Integer, Integer> questionStartIndexes = new LinkedHashMap<>();
            int answerKeyStartIndex = -1;

            for (int i = 0; i < allElements.size(); i++) {
                IBodyElement element = allElements.get(i);
                if (element instanceof XWPFParagraph p) {
                    String text = p.getText().trim();

                    // First, check for the answer key to avoid treating it as a question block
                    if (ANSWER_KEY_START_PATTERN.matcher(text).matches()) {
                        answerKeyStartIndex = i;
                        break; // Stop searching for questions once the answer key is found
                    }

                    // ### MODIFIED SECTION ###
                    // A more robust way to detect the start of a question.
                    // This builds text from the paragraph's runs to avoid issues with
                    // leading non-text elements like images or formulas.
                    StringBuilder paragraphStartText = new StringBuilder();
                    for (XWPFRun run : p.getRuns()) {
                        String runText = run.getText(0);
                        if (runText != null) {
                            paragraphStartText.append(runText);
                        }
                        // Stop building the string after a reasonable length to keep it efficient
                        if (paragraphStartText.length() > 15) {
                            break;
                        }
                    }

                    Matcher questionMatcher = QUESTION_START_PATTERN.matcher(paragraphStartText.toString().trim());
                    // Use lookingAt() to ensure the pattern matches from the beginning of the string
                    if (questionMatcher.lookingAt()) {
                        questionStartIndexes.put(i, Integer.parseInt(questionMatcher.group(1)));
                    }
                }
            }

            // Phase 2: Build and process question blocks
            List<Integer> sortedIndexes = new ArrayList<>(questionStartIndexes.keySet());
            for (int i = 0; i < sortedIndexes.size(); i++) {
                int startIndex = sortedIndexes.get(i);
                int endIndex = (i + 1 < sortedIndexes.size()) ? sortedIndexes.get(i + 1) : (answerKeyStartIndex != -1 ? answerKeyStartIndex : allElements.size());
                int questionNumber = questionStartIndexes.get(startIndex);

                Question question = new Question();
                question.setQuestionNumber(questionNumber);
                wordExtractorService.parseQuestionBlock(allElements.subList(startIndex, endIndex), question);
                finalizeQuestion(questions, question);
            }

            // Phase 3: Parse answers
            if (answerKeyStartIndex != -1) {
                parseAnswerKeySection(doc, answerKeyStartIndex, answers);
            }

            if (questions.isEmpty()) return new QuizParseResult(null, "No questions found.");
            if (answers.isEmpty()) return new QuizParseResult(null, "Answer key not found.");
            if (questions.size() != answers.size()) {
                return new QuizParseResult(null, "Validation Error: Found " + questions.size() + " questions but " + answers.size() + " answers");
            }

            questions.forEach(q -> q.setCorrectAnswerIndex(answers.getOrDefault(q.getQuestionNumber(), -1)));

            List<QuestionDTO> questionDTOs = questions.stream()
                    .map(q -> new QuestionDTO(q.getQuestionNumber(), q.getQuestionContent(), q.getOptions(), q.getCorrectAnswerIndex()))
                    .collect(Collectors.toList());

            return new QuizParseResult(questionDTOs, null);
        } catch (Exception e) {
            e.printStackTrace();
            return new QuizParseResult(null, "Error processing document: " + e.getMessage());
        }
    }

    private void parseAnswerKeySection(XWPFDocument doc, int startIndex, Map<Integer, Integer> answers){
        for(int i = startIndex + 1; i < doc.getBodyElements().size(); i++){
            IBodyElement element = doc.getBodyElements().get(i);
            if(element instanceof XWPFParagraph p){
                String line = p.getText().trim();
                Matcher matcher = ANSWER_KEY_LINE_PATTERN.matcher(line);
                while (matcher.find()) {
                    int qNum = Integer.parseInt(matcher.group(1));
                    String ans = matcher.group(2).toUpperCase();
                    int ansIndex = ans.charAt(0) >= 'A' ? ans.charAt(0) - 'A' : Integer.parseInt(ans) - 1;
                    answers.put(qNum, ansIndex);
                }
            }
        }
    }

    private void finalizeQuestion(List<Question> questions, Question question) {
        if (question == null || question.getQuestionContent() == null || question.getQuestionContent().isEmpty()) {
            return;
        }

        // Sanitize the start of the question
        ContentElement firstElement = question.getQuestionContent().get(0);
        if ("text".equals(firstElement.type())) {
            String content = (String) firstElement.content();
            String cleaned = QUESTION_START_PATTERN.matcher(content.trim()).replaceFirst("").trim();
            if (cleaned.isEmpty()) {
                question.getQuestionContent().remove(0);
            } else {
                question.getQuestionContent().set(0, new ContentElement("text", cleaned));
            }
        }

        // Sanitize the start of each option
        if(question.getOptions() != null) {
            for (List<ContentElement> option : question.getOptions()) {
                if (!option.isEmpty()) {
                    ContentElement firstOptElement = option.get(0);
                    if ("text".equals(firstOptElement.type())) {
                        String content = (String) firstOptElement.content();
                        String cleaned = WordExtractorService.GENERIC_OPTION_PATTERN.matcher(content.trim()).replaceFirst("").trim();
                        if (cleaned.isEmpty()) {
                            option.remove(0);
                        } else {
                            option.set(0, new ContentElement("text", cleaned));
                        }
                    }
                }
            }
            question.getOptions().removeIf(List::isEmpty);
        }
        questions.add(question);
    }
}
