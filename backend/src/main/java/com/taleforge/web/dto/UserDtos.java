package com.taleforge.web.dto;

import java.time.Instant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class UserDtos {

    private UserDtos() {
    }

    public record UserSummary(Long id, String username, String displayName) {
    }

    public record Me(Long id, String username, String email, String displayName, String bio, Instant createdAt) {
    }

    public record Profile(Long id, String username, String displayName, String bio, Instant createdAt,
            long storyCount, long branchCount) {
    }

    public record AuthResponse(String token, Me user) {
    }

    public record RegisterRequest(
            @NotBlank(message = "Pick a username.")
            @Pattern(regexp = "^[a-zA-Z0-9_]{3,30}$", message = "Usernames are 3 to 30 letters, numbers or underscores.")
            String username,

            @NotBlank(message = "Enter your email address.")
            @Email(message = "That email address doesn't look right.")
            @Size(max = 254)
            String email,

            @NotBlank(message = "Choose a password.")
            @Size(min = 8, max = 72, message = "Passwords need at least 8 characters.")
            String password,

            @Size(max = 60, message = "Display names can be up to 60 characters.")
            String displayName) {
    }

    public record LoginRequest(
            @NotBlank(message = "Enter your username or email.") String login,
            @NotBlank(message = "Enter your password.") String password) {
    }

    public record UpdateProfileRequest(
            @NotBlank(message = "Display name can't be empty.")
            @Size(max = 60, message = "Display names can be up to 60 characters.")
            String displayName,

            @Size(max = 500, message = "Bios can be up to 500 characters.")
            String bio) {
    }
}
