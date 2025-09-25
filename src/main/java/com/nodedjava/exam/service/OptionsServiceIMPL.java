package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.Options;
import com.nodedjava.exam.repo.OptionsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OptionsServiceIMPL implements OptionsService{
    @Autowired
    OptionsRepo optionsRepo;

    @Override
    public List<Options> getAllByQuestionId(String questionId) {
        return optionsRepo.getAllByQuestionId(questionId);
    }

    @Override
    public List<Options> getAllByQuestionIds(List<String> questionIds) {
        return optionsRepo.getAllByQuestionIds(questionIds);
    }

    @Override
    public List<Options> addQuestions(List<Options> options) {
        return optionsRepo.saveAll(options);
    }
}
