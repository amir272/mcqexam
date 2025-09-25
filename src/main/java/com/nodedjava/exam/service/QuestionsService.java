package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.Questions;

import java.util.List;

public interface QuestionsService {
    public void addQuestion(Questions questions);

    List<Questions> addQuestions(List<Questions> questions);

    List<Questions> getAllByQuizId(String quizId);

    List<String> getAllQuestionByQuizId(String quizId);
}
