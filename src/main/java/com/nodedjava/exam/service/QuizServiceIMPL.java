package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.Quiz;
import com.nodedjava.exam.entity.User;
import com.nodedjava.exam.repo.QuizRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class QuizServiceIMPL implements QuizService {

    @Autowired
    QuizRepo quizRepo;

    @Override
    public Quiz addQuiz(Quiz quiz) {
        return quizRepo.save(quiz);
    }

    @Override
    public List<Quiz> getAll() {
        return quizRepo.findAll();
    }

    @Override
    public List<Quiz> getEnabledAll() {
        return quizRepo.getEnabledAll();
    }

    @Override
    public Quiz getByQuizId(String quizId) {
        return quizRepo.findByQuizId(quizId);
    }

    @Override
    @Transactional
    public Integer enableExam(Integer id) {
        return quizRepo.enableExam(id);
    }

    @Override
    @Transactional
    public Integer disableExam(Integer id) {
        return quizRepo.disableExam(id);
    }

    public Integer deleteExam(Integer id) {
        Optional<Quiz> quiz = quizRepo.findById(id);
        if (quiz.isPresent()) {
            quizRepo.delete(quiz.get());
            return 1;
        } else return 0;
    }

    @Override
    public List<Quiz> getAllByQuiz(List<String> quizIds) {
        return quizRepo.findAllByQuizIds(quizIds);
    }
}
