package com.taleforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TaleForgeApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaleForgeApplication.class, args);
    }
} 