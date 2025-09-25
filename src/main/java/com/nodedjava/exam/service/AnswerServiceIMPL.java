package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.AnswerKey;
import com.nodedjava.exam.repo.AnswerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerServiceIMPL implements AnswerService{

    @Autowired
    AnswerRepo answerRepo;

    @Override
    public void addAnswer(AnswerKey answerKey) {
        answerRepo.save(answerKey);
    }

    @Override
    public List<AnswerKey> getAnswersByQuesId(String questionId) {
        return null;
    }

    @Override
    public List<AnswerKey> addAnswers(List<AnswerKey> answerKeys) {
        return answerRepo.saveAll(answerKeys);
    }
}
