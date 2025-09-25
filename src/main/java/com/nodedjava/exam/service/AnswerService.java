package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.AnswerKey;

import java.util.List;

public interface AnswerService {
    void addAnswer(AnswerKey answerKey);

    List<AnswerKey> getAnswersByQuesId(String questionId);
    List<AnswerKey> addAnswers(List<AnswerKey> answerKeys);
}
