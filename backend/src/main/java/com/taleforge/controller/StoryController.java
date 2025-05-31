package com.taleforge.controller;

import com.taleforge.domain.Story;
import com.taleforge.dto.StoryDTO;
import com.taleforge.service.StoryService;
import com.taleforge.service.LikeService;
import com.taleforge.dto.ErrorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/stories")
@RequiredArgsConstructor
public class StoryController {
    private final StoryService storyService;
    private final LikeService likeService;

    @GetMapping
    public ResponseEntity<Page<StoryDTO>> getAllStories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        log.info("Getting all stories");
        Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return ResponseEntity.ok(storyService.getAllStories(pageRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoryDTO> getStoryById(@PathVariable Long id) {
        log.info("Getting story with id: {}", id);
        return ResponseEntity.ok(storyService.getStoryById(id));
    }

    @PostMapping
    public ResponseEntity<StoryDTO> createStory(
            @RequestBody StoryDTO storyDTO,
            Authentication authentication) {
        log.info("Creating new story");
        return ResponseEntity.ok(storyService.createStory(storyDTO, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoryDTO> updateStory(
            @PathVariable Long id,
            @RequestBody StoryDTO storyDTO,
            Authentication authentication) {
        log.info("Updating story with id: {}", id);
        return ResponseEntity.ok(storyService.updateStory(id, storyDTO, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Deleting story with id: {}", id);
        storyService.deleteStory(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<StoryDTO> publishStory(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Publishing story with id: {}", id);
        return ResponseEntity.ok(storyService.publishStory(id, authentication.getName()));
    }

    @PostMapping("/{id}/unpublish")
    public ResponseEntity<StoryDTO> unpublishStory(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Unpublishing story with id: {}", id);
        return ResponseEntity.ok(storyService.unpublishStory(id, authentication.getName()));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<StoryDTO> incrementViews(@PathVariable Long id) {
        log.info("Incrementing views for story with id: {}", id);
        return ResponseEntity.ok(storyService.incrementViews(id));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<StoryDTO> likeStory(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Liking story with id: {}", id);
        likeService.likeStory(id, authentication.getName());
        return ResponseEntity.ok(storyService.getStoryById(id));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<StoryDTO> unlikeStory(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Unliking story with id: {}", id);
        likeService.unlikeStory(id, authentication.getName());
        return ResponseEntity.ok(storyService.getStoryById(id));
    }

    @GetMapping("/{id}/like")
    public ResponseEntity<Boolean> hasLikedStory(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Checking if user has liked story with id: {}", id);
        return ResponseEntity.ok(likeService.hasLikedStory(id, authentication.getName()));
    }

    @GetMapping("/top")
    public ResponseEntity<List<StoryDTO>> getTopStories(
            @RequestParam(defaultValue = "views") String sortBy) {
        log.info("Getting top stories sorted by: {}", sortBy);
        return ResponseEntity.ok(storyService.getTopStories(sortBy));
    }

    @GetMapping("/author/{username}")
    public ResponseEntity<List<StoryDTO>> getStoriesByAuthor(@PathVariable String username) {
        log.info("Getting stories by author: {}", username);
        return ResponseEntity.ok(storyService.getStoriesByAuthor(username));
    }

    @GetMapping("/me")
    public ResponseEntity<List<StoryDTO>> getMyStories(Authentication authentication) {
        log.info("Getting stories for current user: {}", authentication.getName());
        return ResponseEntity.ok(storyService.getStoriesByAuthor(authentication.getName()));
    }

    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debug() {
        log.info("Debug endpoint called");
        return ResponseEntity.ok(Map.of(
            "message", "Debug endpoint is accessible",
            "timestamp", System.currentTimeMillis()
        ));
    }
} 