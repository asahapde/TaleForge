package com.taleforge.dto;

import com.taleforge.domain.Story;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
public class StoryDTO {
    private Long id;
    private String title;
    private String description;
    private UserDTO author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean published;
    private Set<String> tags;
    private int views;
    private double rating;

    public static StoryDTO fromEntity(Story story) {
        StoryDTO dto = new StoryDTO();
        dto.setId(story.getId());
        dto.setTitle(story.getTitle());
        dto.setDescription(story.getDescription());
        dto.setAuthor(UserDTO.fromEntity(story.getAuthor()));
        dto.setCreatedAt(story.getCreatedAt());
        dto.setUpdatedAt(story.getUpdatedAt());
        dto.setPublished(story.isPublished());
        dto.setTags(story.getTags());
        dto.setViews(story.getViews());
        dto.setRating(story.getRating());
        return dto;
    }
} 