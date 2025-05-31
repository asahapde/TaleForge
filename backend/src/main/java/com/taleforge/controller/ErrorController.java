package com.taleforge.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        Integer statusCode = (Integer) request.getAttribute("jakarta.servlet.error.status_code");
        Exception exception = (Exception) request.getAttribute("jakarta.servlet.error.exception");
        
        errorDetails.put("status", statusCode != null ? statusCode : HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorDetails.put("error", exception != null ? exception.getMessage() : "An unexpected error occurred");
        errorDetails.put("path", request.getAttribute("jakarta.servlet.error.request_uri"));
        
        return new ResponseEntity<>(errorDetails, HttpStatus.valueOf(statusCode != null ? statusCode : HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
} 