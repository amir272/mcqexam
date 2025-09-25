package com.nodedjava.exam.controller;

import com.nodedjava.exam.entity.Options;
import com.nodedjava.exam.service.OptionsService;
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
public class OptionsController {

    @Autowired
    OptionsService optionsService;

    @GetMapping("/api/get-options/{questionId}")
    public List<Options> getQuestions(@PathVariable String questionId){
        return optionsService.getAllByQuestionId(questionId);
    }


    @PostMapping("/api/add-options")
    public ResponseEntity<List<Options>> addQuestions(@RequestBody List<Options> options){
        return new ResponseEntity<>(optionsService.addQuestions(options), HttpStatus.CREATED);
    }

}
