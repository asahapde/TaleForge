package com.taleforge.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;

class DatabaseUrlEnvironmentPostProcessorTest {

    private final DatabaseUrlEnvironmentPostProcessor processor = new DatabaseUrlEnvironmentPostProcessor();

    private StandardEnvironment environmentWith(Map<String, Object> values) {
        StandardEnvironment env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("test", values));
        return env;
    }

    @Test
    void convertsNeonConnectionString() {
        var env = environmentWith(Map.of("DATABASE_URL",
                "postgresql://tale_owner:p%40ss:w0rd@ep-cool-lake-123.us-east-2.aws.neon.tech/taleforge?sslmode=require&channel_binding=require"));

        processor.postProcessEnvironment(env, null);

        assertThat(env.getProperty("DB_URL"))
                .isEqualTo("jdbc:postgresql://ep-cool-lake-123.us-east-2.aws.neon.tech/taleforge?sslmode=require");
        assertThat(env.getProperty("DB_USERNAME")).isEqualTo("tale_owner");
        assertThat(env.getProperty("DB_PASSWORD")).isEqualTo("p@ss:w0rd");
    }

    @Test
    void addsSslModeAndKeepsPort() {
        var env = environmentWith(Map.of("DATABASE_URL", "postgres://u:p@localhost:5433/db"));

        processor.postProcessEnvironment(env, null);

        assertThat(env.getProperty("DB_URL")).isEqualTo("jdbc:postgresql://localhost:5433/db?sslmode=require");
    }

    @Test
    void explicitJdbcUrlWins() {
        var env = environmentWith(Map.of("DATABASE_URL", "postgresql://u:p@host/db", "DB_URL", "jdbc:postgresql://other/db"));

        processor.postProcessEnvironment(env, null);

        assertThat(env.getProperty("DB_URL")).isEqualTo("jdbc:postgresql://other/db");
        assertThat(env.getProperty("DB_USERNAME")).isNull();
    }
}
