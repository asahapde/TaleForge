package com.taleforge.web.dto;

import java.time.Instant;
import java.util.List;

import com.taleforge.web.dto.UserDtos.UserSummary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class ChapterDtos {

    private ChapterDtos() {
    }

    /** A chapter's place in the tree, without its text. */
    public record ChapterNode(
            Long id,
            Long parentId,
            String title,
            String choiceLabel,
            int depth,
            int views,
            UserSummary author,
            boolean byStoryAuthor,
            Instant createdAt) {
    }

    public record PathStep(Long id, String title, String choiceLabel) {
    }

    public record ChapterDetail(
            Long id,
            Long storyId,
            String storyTitle,
            UserSummary storyAuthor,
            boolean storyPublished,
            boolean storyOpenToBranches,
            Long parentId,
            String title,
            String choiceLabel,
            String content,
            int depth,
            int views,
            UserSummary author,
            boolean byStoryAuthor,
            Instant createdAt,
            Instant updatedAt,
            List<PathStep> path,
            List<ChapterNode> choices) {
    }

    /** A branch shown outside its tree, e.g. in activity feeds and profiles. */
    public record BranchActivity(
            Long id,
            String title,
            String choiceLabel,
            int depth,
            String excerpt,
            UserSummary author,
            Long storyId,
            String storyTitle,
            Instant createdAt) {
    }

    public record ChapterRequest(
            @NotBlank(message = "Give the chapter a title.")
            @Size(max = 120, message = "Chapter titles can be up to 120 characters.")
            String title,

            @Size(max = 140, message = "Choice lines can be up to 140 characters.")
            String choiceLabel,

            @NotBlank(message = "The chapter needs some words.")
            @Size(min = 50, max = 60000, message = "Chapters are 50 to 60,000 characters.")
            String content) {
    }
}
