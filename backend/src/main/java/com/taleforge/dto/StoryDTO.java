package com.taleforge.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.taleforge.domain.Story;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Data
@NoArgsConstructor
public class StoryDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @NotBlank(message = "Content is required")
    @Size(min = 10, max = 10000, message = "Content must be between 10 and 10000 characters")
    private String content;

    private UserDTO author;
    private boolean published;
    private int views;
    private double rating;
    private Set<String> tags;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime updatedAt;

    public static StoryDTO fromEntity(Story story) {
        if (story == null) {
            return null;
        }
        
        StoryDTO dto = new StoryDTO();
        dto.setId(story.getId());
        dto.setTitle(story.getTitle());
        dto.setDescription(story.getDescription());
        dto.setContent(story.getContent());
        dto.setAuthor(story.getAuthor() != null ? UserDTO.fromEntity(story.getAuthor()) : null);
        dto.setCreatedAt(story.getCreatedAt());
        dto.setUpdatedAt(story.getUpdatedAt());
        dto.setPublished(story.isPublished());
        dto.setTags(story.getTags() != null ? story.getTags() : new HashSet<>());
        dto.setViews(story.getViews());
        dto.setRating(story.getRating());
        return dto;
    }
} 