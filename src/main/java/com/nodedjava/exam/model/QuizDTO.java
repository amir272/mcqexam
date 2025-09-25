package com.nodedjava.exam.model;

import java.math.BigDecimal;
import java.util.List;

public record QuizDTO(
        String title,
        int time,
        List<QuestionDTO> questions,
        BigDecimal correct,
        BigDecimal wrong,
        BigDecimal unanswered,
        String status
) {}
