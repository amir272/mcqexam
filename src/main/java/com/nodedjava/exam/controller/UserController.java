package com.nodedjava.exam.controller;

import com.nodedjava.exam.entity.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class HomeController {

    @GetMapping("/api/data")
    public User getData() {
        User u = new User();
        u.setEmail("a");
        u.setBatch("b1");
        u.setContact("8989");
        u.setId(UUID.randomUUID());
        u.setFullName("Amir");
        u.setRollNo("87");
        return u;
        };
    }
