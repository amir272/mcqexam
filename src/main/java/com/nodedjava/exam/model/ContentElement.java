package com.nodedjava.exam.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ContentElement(String type, Object content, String format) {
    public ContentElement(String type, Object content) {
        this(type, content, null);
    }
}
