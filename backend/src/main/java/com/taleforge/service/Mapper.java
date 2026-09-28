package com.taleforge.service;

import java.util.List;

import com.taleforge.domain.Chapter;
import com.taleforge.domain.Comment;
import com.taleforge.domain.Story;
import com.taleforge.domain.User;
import com.taleforge.repository.ChapterRow;
import com.taleforge.web.dto.ChapterDtos.BranchActivity;
import com.taleforge.web.dto.ChapterDtos.ChapterNode;
import com.taleforge.web.dto.CommentDtos.CommentResponse;
import com.taleforge.web.dto.StoryDtos.StorySummary;
import com.taleforge.web.dto.UserDtos.Me;
import com.taleforge.web.dto.UserDtos.UserSummary;

final class Mapper {

    private static final int EXCERPT_LENGTH = 220;

    private Mapper() {
    }

    static UserSummary user(User user) {
        return new UserSummary(user.getId(), user.getUsername(), user.getDisplayName());
    }

    static Me me(User user) {
        return new Me(user.getId(), user.getUsername(), user.getEmail(), user.getDisplayName(), user.getBio(),
                user.getCreatedAt());
    }

    static StorySummary story(Story s) {
        return new StorySummary(s.getId(), s.getTitle(), s.getDescription(), sortedTags(s), user(s.getAuthor()),
                s.isPublished(), s.isOpenToBranches(), s.getViews(), s.getLikeCount(), s.getChapterCount(),
                s.getCreatedAt(), s.getUpdatedAt());
    }

    static List<String> sortedTags(Story s) {
        return s.getTags().stream().sorted().toList();
    }

    static ChapterNode node(ChapterRow row, Long storyAuthorId) {
        return new ChapterNode(row.id(), row.parentId(), row.title(), row.choiceLabel(), row.depth(), row.views(),
                new UserSummary(row.authorId(), row.authorUsername(), row.authorDisplayName()),
                row.authorId().equals(storyAuthorId), row.createdAt());
    }

    static BranchActivity branch(Chapter c) {
        return new BranchActivity(c.getId(), c.getTitle(), c.getChoiceLabel(), c.getDepth(), excerpt(c.getContent()),
                user(c.getAuthor()), c.getStory().getId(), c.getStory().getTitle(), c.getCreatedAt());
    }

    static CommentResponse comment(Comment c) {
        boolean edited = c.getUpdatedAt() != null && c.getUpdatedAt().isAfter(c.getCreatedAt().plusSeconds(1));
        return new CommentResponse(c.getId(), c.getContent(), user(c.getAuthor()), c.getCreatedAt(), edited);
    }

    static String excerpt(String content) {
        String flat = content.replaceAll("\\s+", " ").trim();
        if (flat.length() <= EXCERPT_LENGTH) {
            return flat;
        }
        int cut = flat.lastIndexOf(' ', EXCERPT_LENGTH);
        return flat.substring(0, cut > 0 ? cut : EXCERPT_LENGTH) + "…";
    }
}
