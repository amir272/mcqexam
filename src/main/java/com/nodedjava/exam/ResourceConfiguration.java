package com.nodedjava.exam;


import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

@Configuration
public class StaticResourceConfiguration implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        try {
            // Get the path of the running JAR file
            Path jarPath = getJarPath(StaticResourceConfiguration.class); // Replace with your actual class name

            // Define resource locations based on the JAR path
            String imagesPath = jarPath.resolve("images").toString();
            String userImagesPath = jarPath.resolve("user/images").toString();
            String manageImagesPath = jarPath.resolve("manage/images").toString();

            // Configure resource handlers
            registry.addResourceHandler("/images/**").addResourceLocations("file:" + imagesPath)
                    .setCacheControl(CacheControl.maxAge(2, TimeUnit.HOURS).cachePublic());
            registry.addResourceHandler("/user/images/**").addResourceLocations("file:" + userImagesPath)
                    .setCacheControl(CacheControl.maxAge(2, TimeUnit.HOURS).cachePublic());
            registry.addResourceHandler("/manage/images/**").addResourceLocations("file:" + manageImagesPath)
                    .setCacheControl(CacheControl.maxAge(2, TimeUnit.HOURS).cachePublic());
        } catch (URISyntaxException e) {
            // Handle the exception (e.g., log or throw)
            e.printStackTrace();
        }
    }

    private Path getJarPath(Class<?> clazz) throws URISyntaxException {
        URL url = clazz.getProtectionDomain().getCodeSource().getLocation();
        return Paths.get(url.toURI());
    }
}
