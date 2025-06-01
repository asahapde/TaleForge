package com.taleforge.dto;

import java.time.LocalDateTime;

import com.taleforge.domain.Comment;

import lombok.Data;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private Long storyId;
    private AuthorDTO author;
    private int likes;
    private boolean liked;
    private boolean edited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class AuthorDTO {
        private Long id;
        private String username;
        private String displayName;
    }

    public static CommentDTO fromEntity(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setStoryId(comment.getStory().getId());

        AuthorDTO authorDTO = new AuthorDTO();
        authorDTO.setId(comment.getAuthor().getId());
        authorDTO.setUsername(comment.getAuthor().getUsername());
        authorDTO.setDisplayName(comment.getAuthor().getDisplayName());
        dto.setAuthor(authorDTO);

        dto.setLikes(comment.getLikesCount());
        dto.setLiked(comment.isLiked());
        dto.setEdited(comment.isEdited());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}