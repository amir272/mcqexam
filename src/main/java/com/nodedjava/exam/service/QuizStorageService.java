package com.nodedjava.exam.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nodedjava.exam.entity.Question;
import com.nodedjava.exam.entity.Quiz;
import com.nodedjava.exam.model.QuestionDTO;
import com.nodedjava.exam.model.QuizDTO;
import com.nodedjava.exam.repo.QuizRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.*;

@Service
public class QuizStorageService {

    private final QuizRepository quizRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuizStorageService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @Transactional
    public Quiz saveQuiz(QuizDTO quizDTO) {
        Quiz quiz = new Quiz();
        quiz.setTitle(quizDTO.title());
        quiz.setTime(quizDTO.time());
        quiz.setCorrect(quizDTO.correct());
        quiz.setWrong(quizDTO.wrong());
        quiz.setUnanswered(quizDTO.unanswered());
        quiz.setStatus(quizDTO.status());

        quiz.setQuizId(UUID.randomUUID().toString());
        quiz.setTotal(quizDTO.questions().size());
        quiz.setDate(new Date().toString());

        List<Question> questions = new ArrayList<>();
        for (QuestionDTO qDto : quizDTO.questions()) {
            Question question = new Question();
            question.setQuestionNumber(qDto.questionNumber());
            question.setQuestionContent(qDto.questionContent());
            question.setCorrectAnswerIndex(qDto.correctAnswerIndex());
            try {
                question.setOptionsJson(objectMapper.writeValueAsString(qDto.options()));
            } catch (Exception e) {
                throw new RuntimeException("Could not serialize options to JSON", e);
            }
            question.setQuiz(quiz);
            questions.add(question);
        }
        quiz.setQuestions(questions);
        return quizRepository.save(quiz);
    }

    public List<Quiz> getEnabledQuizzes() { // New service method
        return quizRepository.findByStatus("enabled");
    }

    public List<Quiz> getAllQuizzesSummary() {
        return quizRepository.findQuizSummaries();
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @Transactional
    public Quiz updateQuizStatus(Long id, String newStatus) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        quiz.setStatus(newStatus);
        return quizRepository.save(quiz);
    }

    public Optional<Quiz> getQuizById(Long id) {
        return quizRepository.findById(id);
    }

    @Transactional
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }
}
