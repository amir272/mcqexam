package com.nodedjava.exam.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nodedjava.exam.model.ContentElement;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.List;


@Converter
public class ContentElementListConverter implements AttributeConverter<List<ContentElement>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<ContentElement> attribute) {
        try { return objectMapper.writeValueAsString(attribute); }
        catch (Exception e) { throw new RuntimeException("Could not convert list to JSON string", e); }
    }

    @Override
    public List<ContentElement> convertToEntityAttribute(String dbData) {
        try { return objectMapper.readValue(dbData, new TypeReference<>() {}); }
        catch (Exception e) { throw new RuntimeException("Could not convert JSON string to list", e); }
    }
}
