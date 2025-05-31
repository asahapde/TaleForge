package com.taleforge.service;

import com.taleforge.domain.Story;
import com.taleforge.repository.StoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoryService {
    private final StoryRepository storyRepository;

    @Transactional(readOnly = true)
    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Story getStoryById(Long id) {
        return storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Story not found with id: " + id));
    }

    @Transactional
    public Story createStory(Story story) {
        return storyRepository.save(story);
    }

    @Transactional
    public Story updateStory(Long id, Story storyDetails) {
        Story story = getStoryById(id);
        story.setTitle(storyDetails.getTitle());
        story.setDescription(storyDetails.getDescription());
        story.setPublished(storyDetails.isPublished());
        story.setTags(storyDetails.getTags());
        return storyRepository.save(story);
    }

    @Transactional
    public boolean deleteStory(Long id) {
        if (storyRepository.existsById(id)) {
            storyRepository.deleteById(id);
            return true;
        }
        return false;
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
    public Story publishStory(Long id) {
        Story story = getStoryById(id);
        story.setPublished(true);
        return storyRepository.save(story);
    }

    @Transactional
    public Story unpublishStory(Long id) {
        Story story = getStoryById(id);
        story.setPublished(false);
        return storyRepository.save(story);
    }

    @Transactional
    public Story updateRating(Long id, Double rating) {
        Story story = getStoryById(id);
        story.setRating(rating);
        return storyRepository.save(story);
    }
} 