package com.nodedjava.exam.controller;

import com.nodedjava.exam.entity.AnswerKey;
import com.nodedjava.exam.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AnswerController {
    @Autowired
    AnswerService answerService;

    @GetMapping("/api/get-answers/{questionId}")
    public ResponseEntity<List<AnswerKey>> getQuestions(@PathVariable String questionId){
        return new ResponseEntity<>(answerService.getAnswersByQuesId(questionId), HttpStatus.OK);
    }

    @PostMapping("/api/add-answers")
    public ResponseEntity<List<AnswerKey>> addAnswers(@RequestBody List<AnswerKey> answerKeys){
        return new ResponseEntity<>(answerService.addAnswers(answerKeys), HttpStatus.CREATED);
    }
}
