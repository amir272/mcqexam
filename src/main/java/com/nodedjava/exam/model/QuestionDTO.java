package com.nodedjava.exam.model;

import java.util.List;

import java.util.List;

public record QuestionDTO(int questionNumber, List<ContentElement> questionContent, List<List<ContentElement>> options, int correctAnswerIndex) {}
