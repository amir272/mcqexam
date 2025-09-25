package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.Options;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionsRepo extends JpaRepository<Options, Integer> {

    List<Options> getAllByQuestionId(String questionId);

    @Query(value = "SELECT * FROM options where question_id in :questions", nativeQuery = true)
    List<Options> getAllByQuestionIds(List<String> questions);

}
