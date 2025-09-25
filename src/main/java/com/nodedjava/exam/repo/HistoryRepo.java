package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepo extends JpaRepository<History, Integer> {
    @Query(value = "select * from history where user_name=:username order by id desc", nativeQuery = true)
    List<History> findByHistory(String username);

    @Query(value = "select * from history where shift LIKE %:shift% order by score desc", nativeQuery = true)
    List<History> findByShift(String shift);
}
