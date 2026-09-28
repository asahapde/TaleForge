package com.taleforge.web.dto;

import java.time.Instant;
import java.util.List;

import com.taleforge.web.dto.ChapterDtos.ChapterRequest;
import com.taleforge.web.dto.UserDtos.UserSummary;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class StoryDtos {

    private StoryDtos() {
    }

    public record StorySummary(
            Long id,
            String title,
            String description,
            List<String> tags,
            UserSummary author,
            boolean published,
            boolean openToBranches,
            int views,
            int likeCount,
            int chapterCount,
            Instant createdAt,
            Instant updatedAt) {
    }

    public record StoryDetail(
            Long id,
            String title,
            String description,
            List<String> tags,
            UserSummary author,
            boolean published,
            boolean openToBranches,
            int views,
            int likeCount,
            int chapterCount,
            long contributorCount,
            long commentCount,
            Long rootChapterId,
            Instant createdAt,
            Instant updatedAt) {
    }

    public record StoryRequest(
            @NotBlank(message = "Give your story a title.")
            @Size(min = 2, max = 120, message = "Titles are 2 to 120 characters.")
            String title,

            @NotBlank(message = "Write a short description.")
            @Size(min = 10, max = 600, message = "Descriptions are 10 to 600 characters.")
            String description,

            @Size(max = 6, message = "Use up to 6 tags.")
            List<String> tags,

            boolean published,

            Boolean openToBranches,

            /** Required when creating a story, ignored when updating one. */
            @Valid ChapterRequest firstChapter) {
    }

    public record LikeResponse(boolean liked, int likeCount) {
    }
}
