package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.Quiz;

import java.util.List;

public interface QuizService {
    public Quiz addQuiz(Quiz quiz);

    List<Quiz> getAll();
    List<Quiz> getEnabledAll();

    Quiz getByQuizId(String quizId);

    Integer enableExam(Integer quizId);

    Integer disableExam(Integer quizId);

    Integer deleteExam(Integer quizId);

    List<Quiz> getAllByQuiz(List<String> quizIds);
}
