package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.User;
import com.nodedjava.exam.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceIMPL implements UserService{

    @Autowired
    UserRepo userRepo;

    @Override
    public User addUser(User user) {
       return userRepo.save(user);
    }

    @Override
    public List<User> addUsers(List<User> users) {
        Iterable<User> userList = (Iterable) users;
        return userRepo.saveAll(userList);
    }

    @Override
    public User getByEmail(String email) {
        return userRepo.getByEmail(email);
    }

    @Override
    public User getByUserName(String username) {
        return userRepo.getByUserName(username);
    }

    @Override
    public User getByUsernamePassword(String username, String password) {
        return userRepo.getByUserNamePassword(username, password);
    }

    @Override
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    public Integer deleteUser(String id) {
        Optional<User> user = userRepo.findById(id);
        if(user.isPresent()){
            userRepo.delete(user.get());
            return 1;
        }else return 0;
    }

    @Override
    public List<User> getAllByUsernames(List<String> usernames) {
        return userRepo.findAllByUsernames(usernames);
    }
}
