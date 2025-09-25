package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.AnswerKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerRepo extends JpaRepository<AnswerKey, Integer> {


}
