package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.Options;

import java.util.List;

public interface OptionsService {

    public List<Options> getAllByQuestionId(String questionId);

    List<Options> getAllByQuestionIds(List<String> questionId);

    List<Options> addQuestions(List<Options> options);
}
