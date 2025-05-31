package com.taleforge.config;

import com.taleforge.domain.Story;
import com.taleforge.domain.User;
import com.taleforge.dto.StoryDTO;
import com.taleforge.service.StoryService;
import com.taleforge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserService userService;
    private final StoryService storyService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create test users if they don't exist
        createTestUser("john.doe@example.com", "johndoe", "John Doe", "password123");
        createTestUser("jane.smith@example.com", "janesmith", "Jane Smith", "password123");
        createTestUser("admin@example.com", "admin", "Admin User", "admin123");
    }

    private void createTestUser(String email, String username, String displayName, String password) {
        if (!userService.existsByEmail(email)) {
            User user = User.builder()
                    .email(email)
                    .username(username)
                    .displayName(displayName)
                    .password(passwordEncoder.encode(password))
                    .enabled(true)
                    .emailVerified(true)
                    .roles(new HashSet<>(Arrays.asList("ROLE_USER")))
                    .build();

            user = userService.createUser(user);

            // Create some test stories for each user
            createTestStory(user, "My First Story", "This is my first story on TaleForge!", 
                "Once upon a time...", Arrays.asList("fantasy", "adventure"));
            createTestStory(user, "Another Story", "This is another story I wrote.", 
                "In a world where magic exists...", Arrays.asList("fantasy", "mystery"));
        }
    }

    private void createTestStory(User author, String title, String description, String content, java.util.List<String> tags) {
        StoryDTO storyDTO = StoryDTO.builder()
                .title(title)
                .description(description)
                .content(content)
                .published(true)
                .tags(new HashSet<>(tags))
                .build();

        storyService.createStory(storyDTO, author.getUsername());
    }
} 