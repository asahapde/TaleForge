package com.taleforge.controller;

import com.taleforge.domain.Story;
import com.taleforge.domain.User;
import com.taleforge.dto.ErrorResponse;
import com.taleforge.dto.StoryDTO;
import com.taleforge.service.StoryService;
import com.taleforge.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class StoryController {
    private final StoryService storyService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<StoryDTO>> getStories(
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        try {
            log.info("Fetching stories with sort: {}, tag: {}, page: {}, size: {}", sort, tag, page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<StoryDTO> stories = storyService.getStories(sort, tag, pageable);
            log.info("Successfully fetched {} stories", stories.getTotalElements());
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error fetching stories: ", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoryDTO> getStory(@PathVariable Long id) {
        return ResponseEntity.ok(storyService.getStory(id));
    }

    @PostMapping
    public ResponseEntity<StoryDTO> createStory(
            @Valid @RequestBody StoryDTO storyDTO,
            @AuthenticationPrincipal User user) {
        log.info("Creating story with title: {}", storyDTO.getTitle());
        log.info("Story DTO: {}", storyDTO);
        log.info("User: {}", user);
        try {
            StoryDTO createdStory = storyService.createStory(storyDTO, user);
            log.info("Story created successfully with id: {}", createdStory.getId());
            return ResponseEntity.ok(createdStory);
        } catch (Exception e) {
            log.error("Error creating story: ", e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoryDTO> updateStory(
            @PathVariable Long id,
            @Valid @RequestBody StoryDTO storyDTO,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(storyService.updateStory(id, storyDTO, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        storyService.deleteStory(id, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<?> getStoriesByAuthor(@PathVariable Long authorId) {
        try {
            log.info("Fetching stories for author with id: {}", authorId);
            List<Story> stories = storyService.getStoriesByAuthor(authorId);
            log.info("Successfully fetched {} stories for author {}", stories.size(), authorId);
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error fetching stories for author {}: ", authorId, e);
            return ResponseEntity.internalServerError().body("Error fetching stories: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchStories(@RequestParam String query) {
        try {
            log.info("Searching stories with query: {}", query);
            List<Story> stories = storyService.searchStories(query);
            log.info("Found {} stories matching query: {}", stories.size(), query);
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error searching stories: ", e);
            return ResponseEntity.internalServerError().body("Error searching stories: " + e.getMessage());
        }
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<?> getStoriesByTag(@PathVariable String tag) {
        try {
            log.info("Fetching stories with tag: {}", tag);
            List<Story> stories = storyService.getStoriesByTag(tag);
            log.info("Found {} stories with tag: {}", stories.size(), tag);
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error fetching stories with tag {}: ", tag, e);
            return ResponseEntity.internalServerError().body("Error fetching stories: " + e.getMessage());
        }
    }

    @GetMapping("/top-rated")
    public ResponseEntity<?> getTopRatedStories() {
        try {
            log.info("Fetching top rated stories");
            List<Story> stories = storyService.getTopRatedStories();
            log.info("Successfully fetched {} top rated stories", stories.size());
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error fetching top rated stories: ", e);
            return ResponseEntity.internalServerError().body("Error fetching stories: " + e.getMessage());
        }
    }

    @GetMapping("/most-viewed")
    public ResponseEntity<?> getMostViewedStories() {
        try {
            log.info("Fetching most viewed stories");
            List<Story> stories = storyService.getMostViewedStories();
            log.info("Successfully fetched {} most viewed stories", stories.size());
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error fetching most viewed stories: ", e);
            return ResponseEntity.internalServerError().body("Error fetching stories: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<StoryDTO> publishStory(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(storyService.publishStory(id, user));
    }

    @PostMapping("/{id}/unpublish")
    public ResponseEntity<StoryDTO> unpublishStory(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(storyService.unpublishStory(id, user));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateStory(@PathVariable Long id, @RequestBody Map<String, Double> request) {
        try {
            log.info("Rating story with id: {}", id);
            Double rating = request.get("rating");
            if (rating == null || rating < 0 || rating > 5) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Invalid rating", "Rating must be between 0 and 5"));
            }
            Story story = storyService.updateRating(id, rating);
            return ResponseEntity.ok(StoryDTO.fromEntity(story));
        } catch (EntityNotFoundException e) {
            log.error("Error rating story: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Story not found", e.getMessage()));
        } catch (Exception e) {
            log.error("Error rating story: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error rating story", e.getMessage()));
        }
    }
} 