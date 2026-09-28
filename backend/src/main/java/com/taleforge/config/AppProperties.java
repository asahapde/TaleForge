package com.taleforge.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Cors cors) {

    public record Jwt(String secret, long expirationHours) {
    }

    public record Cors(List<String> allowedOrigins) {
    }
}
