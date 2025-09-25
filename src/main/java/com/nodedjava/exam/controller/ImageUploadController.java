package com.nodedjava.exam.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@CrossOrigin
@RestController
public class ImageUploadController {

    private String imageFolder = "D:/exam/images/";
    @PostMapping("/api/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file, @RequestHeader(value = "Origin", required = false) String origin) throws IOException {

        // Sanitize input
        String filename = file.getOriginalFilename() ;
        if (filename == null || filename.contains("..") || filename.matches("[^\\w\\s\\d\\-_~,;:\\[\\]\\(\\).]+")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Verify extension
        String extension = filename.substring(filename.lastIndexOf(".") + 1);
        if (!Arrays.asList("gif", "jpg", "png", "jpeg").contains(extension.toLowerCase())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Save uploaded file
        filename = new Date().getTime() + filename;
        Path path = Paths.get(imageFolder + filename);
        // Create directory if it does not exist
        Files.createDirectories(path.getParent());

        Files.write(path, file.getBytes());

        // Determine the base URL
        Map<String, String> response = getBaseUrl(origin, filename);
        return ResponseEntity.ok(response);
    }

    private static Map<String, String> getBaseUrl(String origin, String filename) {
        String protocol = "http://";
        if (origin != null && origin.startsWith("https")) {
            protocol = "https://";
        }
        String baseurl = protocol + "localhost:8092/";

        // Respond to the successful upload with JSON.
        // Use a location key to specify the path to the saved image resource.
        // { location : '/your/uploaded/image/file'}
        Map<String, String> response = new HashMap<>();
        response.put("location", baseurl + "images/" + filename);
        return response;
    }
}
