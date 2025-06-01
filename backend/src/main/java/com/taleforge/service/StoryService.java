package com.taleforge.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taleforge.domain.Story;
import com.taleforge.domain.User;
import com.taleforge.dto.StoryDTO;
import com.taleforge.dto.UserDTO;
import com.taleforge.exception.ResourceNotFoundException;
import com.taleforge.repository.StoryRepository;
import com.taleforge.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<StoryDTO> getStories(String sort, String tag, Pageable pageable) {
        if (pageable == null) {
            pageable = PageRequest.of(0, 10);
        }

        Page<Story> stories;
        Sort sortObj = getSort(sort);
        Pageable pageableWithSort = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sortObj);

        try {
            if (tag != null && !tag.isEmpty()) {
                stories = storyRepository.findByTagsContainingAndPublishedTrue(tag, pageableWithSort);
            } else {
                stories = storyRepository.findByPublishedTrue(pageableWithSort);
            }
            return stories.map(this::convertToDTO);
        } catch (Exception e) {
            log.error("Error fetching stories: ", e);
            throw new RuntimeException("Failed to fetch stories", e);
        }
    }

    private Sort getSort(String sort) {
        if (sort == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        return switch (sort.toLowerCase()) {
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            case "popular" -> Sort.by(Sort.Direction.DESC, "views");
            case "likes" -> Sort.by(Sort.Direction.DESC, "likes");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    @Transactional(readOnly = true)
    public StoryDTO getStory(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Story ID cannot be null");
        }

        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found with id: " + id));
        return convertToDTO(story);
    }

    @Transactional
    public StoryDTO createStory(StoryDTO storyDTO, String username) {
        if (storyDTO == null) {
            throw new IllegalArgumentException("Story DTO cannot be null");
        }

        log.info("Creating story in service layer");
        log.info("Story DTO: {}", storyDTO);

        try {
            User author = userRepository.findByUsername(username)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + username));

            Story story = Story.builder()
                    .title(storyDTO.getTitle())
                    .description(storyDTO.getDescription())
                    .content(storyDTO.getContent())
                    .published(false)
                    .views(0)
                    .likes(0)
                    .tags(storyDTO.getTags() != null ? storyDTO.getTags() : new HashSet<>())
                    .comments(new HashSet<>())
                    .author(author)
                    .build();

            Story savedStory = storyRepository.save(story);
            log.info("Story saved successfully with id: {}", savedStory.getId());

            return convertToDTO(savedStory);
        } catch (Exception e) {
            log.error("Error creating story in service layer: ", e);
            throw new RuntimeException("Failed to create story", e);
        }
    }

    @Transactional
    public StoryDTO updateStory(Long id, StoryDTO storyDTO, String username) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Story not found with id: " + id));

        if (!story.getAuthor().getUsername().equals(username)) {
            throw new IllegalStateException("User is not authorized to update this story");
        }

        updateStoryFromDTO(story, storyDTO);
        return convertToDTO(storyRepository.save(story));
    }

    @Transactional
    public void deleteStory(Long id, String username) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Story not found with id: " + id));

        if (!story.getAuthor().getUsername().equals(username)) {
            throw new IllegalStateException("User is not authorized to delete this story");
        }

        storyRepository.delete(story);
    }

    @Transactional
    public StoryDTO publishStory(Long id, String username) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Story not found with id: " + id));

        if (!story.getAuthor().getUsername().equals(username)) {
            throw new IllegalStateException("User is not authorized to publish this story");
        }

        story.setPublished(true);
        Story savedStory = storyRepository.save(story);
        return convertToDTO(savedStory);
    }

    @Transactional
    public StoryDTO unpublishStory(Long id, String username) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Story not found with id: " + id));

        if (!story.getAuthor().getUsername().equals(username)) {
            throw new IllegalStateException("User is not authorized to unpublish this story");
        }

        story.setPublished(false);
        Story savedStory = storyRepository.save(story);
        return convertToDTO(savedStory);
    }

    @Transactional
    public StoryDTO incrementViews(Long id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Story not found with id: " + id));

        story.setViews(story.getViews() + 1);
        Story savedStory = storyRepository.save(story);
        return convertToDTO(savedStory);
    }

    @Transactional(readOnly = true)
    public StoryDTO convertToDTO(Story story) {
        if (story == null) {
            throw new IllegalArgumentException("Story cannot be null");
        }

        StoryDTO dto = new StoryDTO();
        dto.setId(story.getId());
        dto.setTitle(story.getTitle());
        dto.setDescription(story.getDescription());
        dto.setContent(story.getContent());
        dto.setPublished(story.isPublished());
        dto.setViews(story.getViews());
        dto.setLikes(story.getLikes());
        dto.setTags(story.getTags() != null ? story.getTags() : new HashSet<>());
        dto.setCreatedAt(story.getCreatedAt());
        dto.setUpdatedAt(story.getUpdatedAt());

        if (story.getAuthor() != null) {
            UserDTO authorDTO = new UserDTO();
            authorDTO.setId(story.getAuthor().getId());
            authorDTO.setUsername(story.getAuthor().getUsername());
            authorDTO.setDisplayName(story.getAuthor().getDisplayName());
            dto.setAuthor(authorDTO);
        }

        return dto;
    }

    private void updateStoryFromDTO(Story story, StoryDTO dto) {
        story.setTitle(dto.getTitle());
        story.setDescription(dto.getDescription());
        story.setContent(dto.getContent());
        story.setTags(dto.getTags() != null ? dto.getTags() : new HashSet<>());
    }

    @Transactional(readOnly = true)
    public Page<StoryDTO> getAllStories(Pageable pageable) {
        return storyRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public StoryDTO getStoryById(Long id) {
        return storyRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<StoryDTO> getStoriesByAuthor(String username) {
        return storyRepository.findByAuthorUsername(username)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StoryDTO> getTopStories(String sortBy) {
        Sort sort = getSort(sortBy);
        return storyRepository.findAll(sort)
                .stream()
                .limit(10)
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Story> searchStories(String query) {
        return storyRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    @Transactional(readOnly = true)
    public List<Story> getStoriesByTag(String tag) {
        return storyRepository.findByTagsContaining(tag);
    }
}