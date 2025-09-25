package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.Questions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionsRepo extends JpaRepository<Questions, Integer> {

    @Query(value = "select questions.id, questions.quiz_id, questions.question_id, questions.question, answer_key.correct_option as answer_key from examination.questions right join examination.answer_key on questions.question_id=answer_key.question_id where questions.quiz_id = :quizId", nativeQuery = true)
    List<Questions> getAllByQuizId(String quizId);

    @Query(value = "select question_id from questions where quiz_id = :quizId", nativeQuery = true)
    List<String> getAllQuestionByQuizId(String quizId);
}
