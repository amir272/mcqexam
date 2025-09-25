package com.nodedjava.exam.model;

import java.util.List;

public record Quiz(List<Question> questions, String error) {
    // This constructor is for successful quiz parsing
    public Quiz(List<Question> questions) {
        this(questions, null);
    }
    // This constructor is for when parsing fails
    public Quiz(String error) {
        this(null, error);
    }
}
