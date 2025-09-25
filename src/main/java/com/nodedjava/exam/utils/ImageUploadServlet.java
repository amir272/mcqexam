package com.nodedjava.exam.utils;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@WebServlet("/ImageUploadServlet")
public class ImageUploadServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final List<String> acceptedOrigins = Arrays.asList("http://localhost", "http://192.168.1.1", "http://example.com");
    private static final String imageFolder = "D:/exam/images/";

    public ImageUploadServlet() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, ServletException {
        try {
            String origin = request.getHeader("Origin");
            if (origin != null && acceptedOrigins.contains(origin)) {
                response.setHeader("Access-Control-Allow-Origin", origin);
            } else {
                response.setStatus(403);
                return;
            }

            if (request.getMethod().equals("OPTIONS")) {
                response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
                return;
            }

            Part filePart = request.getPart("file");
            String fileName = getSubmittedFileName(filePart);
            if (fileName != null) {
                String sanitizedFileName = sanitizeFileName(fileName);
                if (sanitizedFileName == null) {
                    response.setStatus(400);
                    response.getWriter().println("Invalid file name.");
                    return;
                }
                String fileExtension = getFileExtension(sanitizedFileName);
                if (!isValidExtension(fileExtension)) {
                    response.setStatus(400);
                    response.getWriter().println("Invalid extension.");
                    return;
                }
                File fileToWrite = new File(imageFolder + sanitizedFileName + new Date());
                System.out.println("Saving file to: " + fileToWrite.getAbsolutePath());
                filePart.write(fileToWrite.getAbsolutePath());

                String baseUrl = getBaseUrl(request);
                String fileUrl = baseUrl + fileToWrite.getPath();
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.print("{\"location\":\"" + fileUrl + "\"}");
                out.flush();
            } else {
                response.setStatus(500);
            }
        }catch (Exception e) {
            response.setStatus(500);
            e.printStackTrace();
        }
    }

    private String getSubmittedFileName(Part part) {
        String submittedFileName = part.getSubmittedFileName();
        if (submittedFileName == null || submittedFileName.isEmpty()) {
            return null;
        }
        return submittedFileName;
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null) {
            return null;
        }
        return fileName.replaceAll("[^\\w\\s\\d\\-_,;:\\[\\]\\(\\).]", "").replaceAll("\\.{2,}", ".");
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return null;
        }
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex == -1) {
            return "";
        }
        return fileName.substring(dotIndex + 1).toLowerCase();
    }

    private boolean isValidExtension(String extension) {
        List<String> validExtensions = Arrays.asList("gif", "jpg", "png", "jpeg");
        return validExtensions.contains(extension);
    }

    private String getBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String host = request.getServerName();
        int port = request.getServerPort();
        String contextPath = request.getContextPath();
        String baseUrl = scheme + "://" + host + ":" + port + contextPath + "/";
        return baseUrl;
    }
}
