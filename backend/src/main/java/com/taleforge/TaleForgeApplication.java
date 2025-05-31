package com.taleforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EntityScan("com.taleforge.domain")
@EnableJpaAuditing
@ComponentScan(basePackages = {
    "com.taleforge.repository",
    "com.taleforge.service",
    "com.taleforge.security",
    "com.taleforge.controller",
    "com.taleforge.config"
})
public class TaleForgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaleForgeApplication.class, args);
    }
} 