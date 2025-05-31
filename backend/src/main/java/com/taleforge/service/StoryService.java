package com.taleforge.service;

import com.taleforge.domain.Story;
import com.taleforge.domain.User;
import com.taleforge.dto.StoryDTO;
import com.taleforge.dto.UserDTO;
import com.taleforge.exception.ResourceNotFoundException;
import com.taleforge.exception.UnauthorizedException;
import com.taleforge.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;

    public Page<StoryDTO> getStories(String sort, String tag, Pageable pageable) {
        Page<Story> stories;
        Sort sortObj = getSort(sort);
        Pageable pageableWithSort = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            sortObj
        );

        if (tag != null && !tag.isEmpty()) {
            stories = storyRepository.findByTagsContainingAndPublishedTrue(tag, pageableWithSort);
        } else {
            stories = storyRepository.findByPublishedTrue(pageableWithSort);
        }
        return stories.map(this::convertToDTO);
    }

    private Sort getSort(String sort) {
        if (sort == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        return switch (sort.toLowerCase()) {
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            case "popular" -> Sort.by(Sort.Direction.DESC, "views");
            case "rating" -> Sort.by(Sort.Direction.DESC, "rating");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    public StoryDTO getStory(Long id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));
        return convertToDTO(story);
    }

    @Transactional
    public StoryDTO createStory(StoryDTO storyDTO, User user) {
        Story story = new Story();
        updateStoryFromDTO(story, storyDTO);
        story.setAuthor(user);
        return convertToDTO(storyRepository.save(story));
    }

    @Transactional
    public StoryDTO updateStory(Long id, StoryDTO storyDTO, User user) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        if (!story.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update this story");
        }

        updateStoryFromDTO(story, storyDTO);
        return convertToDTO(storyRepository.save(story));
    }

    @Transactional
    public void deleteStory(Long id, User user) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        if (!story.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this story");
        }

        storyRepository.delete(story);
    }

    @Transactional
    public StoryDTO publishStory(Long id, User user) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        if (!story.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to publish this story");
        }

        story.setPublished(true);
        return convertToDTO(storyRepository.save(story));
    }

    @Transactional
    public StoryDTO unpublishStory(Long id, User user) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        if (!story.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to unpublish this story");
        }

        story.setPublished(false);
        return convertToDTO(storyRepository.save(story));
    }

    private StoryDTO convertToDTO(Story story) {
        StoryDTO dto = new StoryDTO();
        dto.setId(story.getId());
        dto.setTitle(story.getTitle());
        dto.setDescription(story.getDescription());
        dto.setContent(story.getContent());
        dto.setAuthor(UserDTO.fromEntity(story.getAuthor()));
        dto.setPublished(story.isPublished());
        dto.setViews(story.getViews());
        dto.setRating(story.getRating());
        dto.setTags(story.getTags());
        dto.setCreatedAt(story.getCreatedAt());
        dto.setUpdatedAt(story.getUpdatedAt());
        return dto;
    }

    private void updateStoryFromDTO(Story story, StoryDTO dto) {
        story.setTitle(dto.getTitle());
        story.setDescription(dto.getDescription());
        story.setContent(dto.getContent());
        story.setPublished(dto.isPublished());
        story.setTags(dto.getTags());
    }

    @Transactional(readOnly = true)
    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Story getStoryById(Long id) {
        return storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Story> getStoriesByAuthor(Long authorId) {
        return storyRepository.findByAuthorId(authorId);
    }

    @Transactional(readOnly = true)
    public List<Story> searchStories(String query) {
        return storyRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    @Transactional(readOnly = true)
    public List<Story> getStoriesByTag(String tag) {
        return storyRepository.findByTagsContaining(tag);
    }

    @Transactional(readOnly = true)
    public List<Story> getTopRatedStories() {
        return storyRepository.findTop10ByOrderByRatingDesc();
    }

    @Transactional(readOnly = true)
    public List<Story> getMostViewedStories() {
        return storyRepository.findTop10ByOrderByViewsDesc();
    }

    @Transactional
    public Story updateRating(Long id, Double rating) {
        Story story = getStoryById(id);
        story.setRating(rating);
        return storyRepository.save(story);
    }
} 