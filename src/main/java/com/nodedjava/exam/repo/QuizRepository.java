package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    @Query("SELECT new Quiz(q.id, q.title, q.time) FROM Quiz q")
    List<Quiz> findQuizSummaries();

    List<Quiz> findByStatus(String status);
}
