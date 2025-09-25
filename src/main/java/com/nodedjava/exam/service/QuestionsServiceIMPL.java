package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.Questions;
import com.nodedjava.exam.repo.QuestionsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionsServiceIMPL implements QuestionsService{

    @Autowired
    QuestionsRepo questionsRepo;

    @Override
    public void addQuestion(Questions questions) {
        questionsRepo.save(questions);
    }

    @Override
    public List<Questions> addQuestions(List<Questions> questions) {
        return questionsRepo.saveAll(questions);
    }

    @Override
    public List<Questions> getAllByQuizId(String quizId) {
        return questionsRepo.getAllByQuizId(quizId);
    }

    @Override
    public List<String> getAllQuestionByQuizId(String quizId) {
        return questionsRepo.getAllQuestionByQuizId(quizId);
    }
}
