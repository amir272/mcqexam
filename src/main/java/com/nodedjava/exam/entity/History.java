package com.nodedjava.exam.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String userName;
    @Column(precision = 10, scale = 2)
    private BigDecimal score;
    @Column(precision = 10, scale = 2)
    private BigDecimal correct;
    @Column(precision = 10, scale = 2)
    private BigDecimal wrong;
    @Column(precision = 10, scale = 2)
    private BigDecimal unanswered;
    private String shift;
    private String quizId;
    private String date;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
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

    public String getShift() {
        return shift;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }

    public String getDate() {
        return date;
    }

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }


    public void setDate() {
        this.date = String.valueOf(new Date());
    }
}

