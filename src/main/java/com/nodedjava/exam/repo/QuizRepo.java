package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepo extends JpaRepository<Quiz, Integer> {

    @Query(value = "SELECT * FROM quiz order by id desc", nativeQuery = true)
    List<Quiz> findAll();

    @Query(value = "SELECT * FROM quiz where status=\"enabled\" order by id desc", nativeQuery = true)
    List<Quiz> getEnabledAll();

    @Query(value = "SELECT * FROM quiz WHERE quiz_id = :quizId LIMIT 1", nativeQuery = true)
    Quiz findByQuizId(String quizId);

    @Modifying
    @Query(value = "update quiz set status=\"enabled\" where id=:id", nativeQuery = true)
    Integer enableExam(Integer id);

    @Modifying
    @Query(value = "update quiz set status=\"disabled\" where id=:id", nativeQuery = true)
    Integer disableExam(Integer id);

    @Query(value = "SELECT * FROM quiz where quiz_id in :quizIds", nativeQuery = true)
    List<Quiz> findAllByQuizIds(List<String> quizIds);
}
