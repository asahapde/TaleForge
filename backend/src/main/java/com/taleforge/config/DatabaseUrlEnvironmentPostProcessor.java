package com.taleforge.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.util.StringUtils;

/**
 * Accepts a libpq-style DATABASE_URL (postgresql://user:pass@host/db?sslmode=require), which is what
 * Neon and most hosts hand out, and exposes it as the DB_URL / DB_USERNAME / DB_PASSWORD properties
 * that application-prod.yml reads. An explicit DB_URL always wins.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (!StringUtils.hasText(databaseUrl) || StringUtils.hasText(environment.getProperty("DB_URL"))) {
            return;
        }

        URI uri = URI.create(databaseUrl.trim());
        Map<String, Object> props = new HashMap<>();

        String userInfo = uri.getRawUserInfo();
        if (userInfo != null) {
            String[] parts = userInfo.split(":", 2);
            props.put("DB_USERNAME", decode(parts[0]));
            props.put("DB_PASSWORD", parts.length > 1 ? decode(parts[1]) : "");
        }

        List<String> params = new ArrayList<>();
        if (uri.getRawQuery() != null) {
            for (String param : uri.getRawQuery().split("&")) {
                // pgjdbc does not understand libpq's channel_binding flag.
                if (!param.startsWith("channel_binding=")) {
                    params.add(param);
                }
            }
        }
        if (params.stream().noneMatch(p -> p.startsWith("sslmode="))) {
            params.add("sslmode=require");
        }

        String port = uri.getPort() > 0 ? ":" + uri.getPort() : "";
        props.put("DB_URL", "jdbc:postgresql://" + uri.getHost() + port + uri.getRawPath() + "?" + String.join("&", params));

        environment.getPropertySources().addFirst(new MapPropertySource("databaseUrl", props));
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
