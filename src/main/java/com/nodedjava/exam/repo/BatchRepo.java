package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchRepo extends JpaRepository<Batch, Integer> {
}
