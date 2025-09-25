package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.Section;
import com.nodedjava.exam.repo.SectionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

//@Service
//public class SectionServiceIMPL implements SectionService{
//    @Autowired
//    SectionRepo sectionRepo;
//
//    @Override
//    public List<Section> findAllByQuizId(String quizId) {
//        return sectionRepo.findByQuizId(quizId);
//    }
//
//    @Override
//    public List<Section> addAllByQuizId(List<Section> sections) {
//        return sectionRepo.saveAll(sections);
//    }
//}
