package com.nodedjava.exam.model;


import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuizParseResult(List<QuestionDTO> questions, String error) {
}
