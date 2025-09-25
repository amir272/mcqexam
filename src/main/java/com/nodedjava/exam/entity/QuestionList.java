package com.nodedjava.exam.entity;

import java.util.List;

public
class QuestionList{
    private String question;
    private List<Answer> answers;
    private int answerKey;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<Answer> getOptions() {
        return answers;
    }

    public void setOptions(List<Answer> options) {
        this.answers = options;
    }

    public int getAnswerKey() {
        return answerKey;
    }

    public void setAnswerKey(String answerKey) {
        this.answerKey = setAnsKeyInt(answerKey.trim().toUpperCase());
    }

    public int setAnsKeyInt(String key){
        if(key.contains("A") || key.contains("1")) return 0;
        if(key.contains("B") || key.contains("2")) return 1;
        if(key.contains("C") || key.contains("3")) return 2;
        if(key.contains("D") || key.contains("4")) return 3;
        if(key.contains("E") || key.contains("5")) return 4;
        return 5;
    }

}