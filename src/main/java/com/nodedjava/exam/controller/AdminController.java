package com.nodedjava.exam.controller;

import com.nodedjava.exam.entity.Admin;
import com.nodedjava.exam.repository.AdminRepo;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @Autowired
    AdminRepo adminRepo;
    private static final Logger logger = LogManager.getLogger(AdminController.class);


    @GetMapping(value = "/api/admin/{username}/{password}")
    public ResponseEntity<Admin> getEmpByEmail(@PathVariable("username") String username, @PathVariable("password") String password)
    {
        Admin employee = null;
        try {
            employee = adminRepo.getByUserName(username, password);
        } catch (Exception e) {
            logger.error(e);
        }
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }
}
