package com.nodedjava.exam.repository;

import com.nodedjava.exam.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdminRepo extends JpaRepository<Admin, Integer> {

    @Query(value = "SELECT * FROM admin WHERE user_name = :username AND password = :password LIMIT 1", nativeQuery = true)
    Admin getByUserName(String username, String password);
}
