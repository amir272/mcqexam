package com.nodedjava.exam.controller;

import com.nodedjava.exam.entity.Questions;
import com.nodedjava.exam.service.QuestionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
public class QuestionsController {

    @Autowired
    QuestionsService questionsService;

    @PostMapping("/api/add-questions")
    public ResponseEntity<List<Questions>> addQuestions(@RequestBody List<Questions> questions){
        return new ResponseEntity<>(questionsService.addQuestions(questions), HttpStatus.CREATED);
    }

    @GetMapping("/api/get-questions/{quizId}")
    public List<Questions> getQuiz(@PathVariable String quizId){
        return questionsService.getAllByQuizId(quizId);
    }

}
