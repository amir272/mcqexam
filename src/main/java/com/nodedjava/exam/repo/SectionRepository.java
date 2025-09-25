package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SectionRepository extends JpaRepository<Section, Integer> {
    List<Section> findByQuizQuizId(String quizId);
}
