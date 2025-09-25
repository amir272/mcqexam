package com.nodedjava.exam.controller;

import com.nodedjava.exam.entity.Section;
import com.nodedjava.exam.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@RestController
//public class SectionController {
//    @Autowired
//    SectionService sectionService;
//    @GetMapping("/api/get-sections/{quizId}")
//    public ResponseEntity<List<Section>> getSections(@PathVariable String quizId){
//        return new ResponseEntity<>(sectionService.findAllByQuizId(quizId), HttpStatus.OK);
//    }
//
//    @PostMapping("/api/add-sections")
//    public ResponseEntity<List<Section>> addSections(@RequestBody List<Section> sections){
//        return new ResponseEntity<>(sectionService.addAllByQuizId(sections), HttpStatus.CREATED);
//    }
//}
