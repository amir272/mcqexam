package com.nodedjava.exam.repo;

import com.nodedjava.exam.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface UserRepo extends JpaRepository<User, String> {

    @Query(value = "SELECT * FROM user WHERE user_name = :username AND password = :password LIMIT 1", nativeQuery = true)
    User getByUserNamePassword(String username, String password);

    @Query(value = "SELECT * FROM user WHERE user_name = :username LIMIT 1", nativeQuery = true)
    User getByUserName(String username);

    @Query(value = "SELECT * FROM user WHERE email = :email LIMIT 1", nativeQuery = true)
    User getByEmail(String email);
    @Query(value = "SELECT * FROM user where user_name in :usernames", nativeQuery = true)
    List<User> findAllByUsernames(List<String> usernames);
}
