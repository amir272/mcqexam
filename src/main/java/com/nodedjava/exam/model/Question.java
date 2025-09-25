package com.nodedjava.exam.model;


import java.util.List;

public class Question {
    private int questionNumber;
    private List<ContentElement> questionContent;
    private List<List<ContentElement>> options;
    private int correctAnswerIndex;

    public Question(){
    }

    public Question(int questionNumber, List<ContentElement> questionContent, List<List<ContentElement>> options) {
        this.questionNumber = questionNumber;
        this.questionContent = questionContent;
        this.options = options;
    }

    // Getters and Setters
    public int getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(int questionNumber) { this.questionNumber = questionNumber; }
    public List<ContentElement> getQuestionContent() { return questionContent; }
    public void setQuestionContent(List<ContentElement> questionContent) { this.questionContent = questionContent; }
    public List<List<ContentElement>> getOptions() { return options; }
    public void setOptions(List<List<ContentElement>> options) { this.options = options; }
    public int getCorrectAnswerIndex() { return correctAnswerIndex; }
    public void setCorrectAnswerIndex(int correctAnswerIndex) { this.correctAnswerIndex = correctAnswerIndex; }
}