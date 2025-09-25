package com.nodedjava.exam.entity;

import java.math.BigDecimal;
import java.util.List;

public class QuesAns {
    private String quizId;
    private BigDecimal correct;
    private BigDecimal wrong;
    private BigDecimal unanswered;
    private int time;


    private List<Section> sections;
    private List<QuestionList> questionList;
    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public BigDecimal getCorrect() {
        return correct;
    }

    public void setCorrect(BigDecimal correct) {
        this.correct = correct;
    }

    public BigDecimal getWrong() {
        return wrong;
    }

    public void setWrong(BigDecimal wrong) {
        this.wrong = wrong;
    }

    public BigDecimal getUnanswered() {
        return unanswered;
    }

    public void setUnanswered(BigDecimal unanswered) {
        this.unanswered = unanswered;
    }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    public List<QuestionList> getQuestionList() {
        return questionList;
    }

    public void setQuestionList(List<QuestionList> questionList) {
        this.questionList = questionList;
    }

    public List<Section> getSections() {
        return sections;
    }

    public void setSections(List<Section> sections) {
        this.sections = sections;
    }
}