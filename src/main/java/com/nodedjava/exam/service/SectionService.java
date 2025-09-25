package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.Quiz;
import com.nodedjava.exam.entity.Section;
import com.nodedjava.exam.model.SectionDTO;
import com.nodedjava.exam.repo.QuizRepository;
import com.nodedjava.exam.repo.SectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SectionService {

    private final SectionRepository sectionRepository;
    private final QuizRepository quizRepository;

    public SectionService(SectionRepository sectionRepository, QuizRepository quizRepository) {
        this.sectionRepository = sectionRepository;
        this.quizRepository = quizRepository;
    }

    @Transactional
    public List<Section> saveSections(String quizId, List<SectionDTO> sectionDTOs) {
        if (sectionDTOs == null || sectionDTOs.isEmpty()) {
            return new ArrayList<>();
        }

        Quiz quiz = quizRepository.findAll().stream()
                .filter(q -> q.getQuizId() != null && q.getQuizId().equals(quizId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Quiz not found with quizId: " + quizId));

        List<Section> savedSections = new ArrayList<>();
        for (SectionDTO dto : sectionDTOs) {
            Section section = new Section();
            // section.setQuizId(dto.quizId()); // No longer needed
            section.setTitle(dto.title());
            section.setStart(dto.start());
            section.setEnd(dto.end());
            section.setQuiz(quiz);
            savedSections.add(sectionRepository.save(section));
        }
        return savedSections;
    }

    public List<Section> findAllByQuizId(String quizId) {
        return sectionRepository.findByQuizQuizId(quizId);
    }
}
