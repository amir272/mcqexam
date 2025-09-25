package com.nodedjava.exam.controller;

import com.nodedjava.exam.entity.User;
import com.nodedjava.exam.service.UserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    UserService userService;
    private static final Logger logger = LogManager.getLogger(UserController.class);

    @PostMapping("/api/addusers")
    public ResponseEntity<List<User>> saveObjects(@RequestBody List<User> myObjects) {
        // Save the list of objects to the database or do something else with it
        return new ResponseEntity(userService.addUsers(myObjects), HttpStatus.CREATED);
    }

    @PostMapping("/api/adduser")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        logger.info(user.getBatch());
        return new ResponseEntity<>(userService.addUser(user), HttpStatus.CREATED);
    };

    @GetMapping(value = "/api/user/{username}/{password}")
    public ResponseEntity<User> getEmpByUsernamePassword(@PathVariable("username") String username, @PathVariable("password") String password)
    {
        User user = null;
        try {
            user = userService.getByUsernamePassword(username, password);
        } catch (Exception e) {
            logger.error(e);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping(value = "/api/user/{username}")
    public ResponseEntity<User> getEmpByUsername(@PathVariable("username") String username)
    {
        User user = null;
        try {
            user = userService.getByUserName(username);
        } catch (Exception e) {
            logger.error(e);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping(value = "/api/user-email/{email}")
    public ResponseEntity<User> getEmpByEmail(@PathVariable("email") String email)
    {
        User user = null;
        try {
            user = userService.getByEmail(email);
        } catch (Exception e) {
            logger.error(e);
        }
        return new ResponseEntity<>(userService.getByEmail(email), HttpStatus.OK);
    }

    @GetMapping(value = "/api/users")
    public ResponseEntity<List<User>> getUsers(){
        return new ResponseEntity<>(userService.getUsers(), HttpStatus.OK);

    }

    @DeleteMapping("/api/delete-user/{id}")
    public Integer deleteUser(@PathVariable("id") String id){
        return userService.deleteUser(id);
    }
    }
