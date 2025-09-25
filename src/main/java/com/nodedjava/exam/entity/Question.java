package com.nodedjava.exam.entity;

import com.nodedjava.exam.model.ContentElement;
import com.nodedjava.exam.utils.ContentElementListConverter;
import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int questionNumber;

    @Lob
    @Column(columnDefinition = "MEDIUMTEXT")
    @Convert(converter = ContentElementListConverter.class)
    private List<ContentElement> questionContent;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String optionsJson;

    private int correctAnswerIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    @JsonBackReference // This is the crucial annotation to break the infinite loop
    private Quiz quiz;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(int questionNumber) { this.questionNumber = questionNumber; }
    public List<ContentElement> getQuestionContent() { return questionContent; }
    public void setQuestionContent(List<ContentElement> questionContent) { this.questionContent = questionContent; }
    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }
    public int getCorrectAnswerIndex() { return correctAnswerIndex; }
    public void setCorrectAnswerIndex(int correctAnswerIndex) { this.correctAnswerIndex = correctAnswerIndex; }
    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }

    @Transient // This field will not be persisted in the database
    public List<List<ContentElement>> getOptions() {
        if (this.optionsJson == null || this.optionsJson.isEmpty()) {
            return null;
        }
        try {
            return new ObjectMapper().readValue(this.optionsJson, new TypeReference<>() {});
        } catch (Exception e) {
            // In a real application, you'd want to handle this more gracefully
            return null;
        }
    }
}
