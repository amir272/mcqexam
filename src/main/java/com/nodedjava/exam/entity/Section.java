package com.nodedjava.exam.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // REMOVED: private String quizId; This was causing the duplicate mapping.

    private String title;
    private Integer start;
    private Integer end;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id") // This now solely manages the foreign key relationship
    @JsonBackReference
    private Quiz quiz;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getStart() { return start; }
    public void setStart(Integer start) { this.start = start; }
    public Integer getEnd() { return end; }
    public void setEnd(Integer end) { this.end = end; }
    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }
}

