package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepo extends JpaRepository<Section, Integer> {

    @Query(value = "SELECT * FROM section WHERE quiz_id = :quizId", nativeQuery = true)
    List<Section> findByQuizId(String quizId);

}
