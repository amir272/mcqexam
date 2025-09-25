package com.nodedjava.exam.controller;

import com.nodedjava.exam.entity.*;
import com.nodedjava.exam.model.QuizDTO;
import com.nodedjava.exam.model.QuizParseResult;
import com.nodedjava.exam.model.SectionDTO;
import com.nodedjava.exam.service.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    private final QuizExtractorService quizExtractorService;
    private final QuizStorageService quizStorageService;
    private final SectionService sectionService;

    public QuizController(QuizExtractorService quizExtractorService, QuizStorageService quizStorageService, SectionService sectionService) {
        this.quizExtractorService = quizExtractorService;
        this.quizStorageService = quizStorageService;
        this.sectionService = sectionService;
    }

    @GetMapping("/enabled-quizzes")
    public ResponseEntity<List<Quiz>> getEnabledQuizzes() {
        return ResponseEntity.ok(quizStorageService.getEnabledQuizzes());
    }

    @PostMapping("/extract-quiz")
    public ResponseEntity<QuizParseResult> extractQuiz(@RequestParam("file") MultipartFile file) {
        QuizParseResult result = quizExtractorService.parseQuizFromDocx(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/save-quiz")
    public ResponseEntity<?> saveQuiz(@RequestBody QuizDTO quizDTO) {
        try {
            Quiz savedQuiz = quizStorageService.saveQuiz(quizDTO);
            return ResponseEntity.ok(savedQuiz);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving quiz: " + e.getMessage());
        }
    }

    @PostMapping("/quizzes/{quizId}/sections")
    public ResponseEntity<List<Section>> addSections(@PathVariable String quizId, @RequestBody List<SectionDTO> sections){
        try {
            List<Section> savedSections = sectionService.saveSections(quizId, sections);
            return new ResponseEntity<>(savedSections, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/get-sections/{quizId}")
    public ResponseEntity<List<Section>> getSections(@PathVariable String quizId){
        return new ResponseEntity<>(sectionService.findAllByQuizId(quizId), HttpStatus.OK);
    }

    @GetMapping("/quizzes")
    public ResponseEntity<List<Quiz>> getSavedQuizzes() {
        return ResponseEntity.ok(quizStorageService.getAllQuizzesSummary());
    }

    @GetMapping("/admin-quizes")
    public ResponseEntity<List<Quiz>> getAdminQuizzes() {
        return ResponseEntity.ok(quizStorageService.getAllQuizzes());
    }

    @PutMapping("/quizzes/{id}/status")
    public ResponseEntity<Quiz> updateQuizStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Quiz updatedQuiz = quizStorageService.updateQuizStatus(id, newStatus);
            return ResponseEntity.ok(updatedQuiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/quiz/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        return quizStorageService.getQuizById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    @DeleteMapping("/quizzes/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizStorageService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
}