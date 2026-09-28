package com.taleforge.web.dto;

import java.time.Instant;

import com.taleforge.web.dto.UserDtos.UserSummary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class CommentDtos {

    private CommentDtos() {
    }

    public record CommentResponse(Long id, String content, UserSummary author, Instant createdAt, boolean edited) {
    }

    public record CommentRequest(
            @NotBlank(message = "Write something first.")
            @Size(max = 4000, message = "Comments can be up to 4,000 characters.")
            String content) {
    }
}
