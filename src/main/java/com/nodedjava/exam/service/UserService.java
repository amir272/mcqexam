package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.User;

import java.util.List;

public interface UserService {
    User addUser(User user);
    List<User> addUsers(List<User> users);
    User getByEmail(String email);
    User getByUserName(String username);

    User getByUsernamePassword(String username, String password);

    List<User> getUsers();

    Integer deleteUser(String id);

    List<User> getAllByUsernames(List<String> usernames);
}
