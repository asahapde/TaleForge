package com.taleforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@ComponentScan(basePackages = {"com.taleforge.controller", "com.taleforge.service", "com.taleforge.config"})
@EntityScan("com.taleforge.domain")
@EnableJpaRepositories("com.taleforge.repository")
@EnableJpaAuditing
public class TaleForgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaleForgeApplication.class, args);
    }
} 