package com.nodedjava.exam.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;


import jakarta.persistence.*;
import java.util.List;
import java.util.Set;


@Entity
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String quizId;
    private String title;
    @Column(precision = 10, scale = 2)
    private BigDecimal correct;
    @Column(precision = 10, scale = 2)
    private BigDecimal wrong;
    @Column(precision = 10, scale = 2)
    private BigDecimal unanswered;
    private int total;
    private int time; // Renamed from duration
    private String status;
    private String date;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Question> questions;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Section> sections;

    public Quiz() {}

    // Constructor used for summaries
    public Quiz(Long id, String title, int time) {
        this.id = id;
        this.title = title;
        this.time = time;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQuizId() { return quizId; }
    public void setQuizId(String quizId) { this.quizId = quizId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public BigDecimal getCorrect() { return correct; }
    public void setCorrect(BigDecimal correct) { this.correct = correct; }
    public BigDecimal getWrong() { return wrong; }
    public void setWrong(BigDecimal wrong) { this.wrong = wrong; }
    public BigDecimal getUnanswered() { return unanswered; }
    public void setUnanswered(BigDecimal unanswered) { this.unanswered = unanswered; }
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    public int getTime() { return time; }
    public void setTime(int time) { this.time = time; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
    public Set<Section> getSections() { return sections; }
    public void setSections(Set<Section> sections) { this.sections = sections; }
}


