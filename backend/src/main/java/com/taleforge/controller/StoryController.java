package com.taleforge.controller;

import com.taleforge.domain.Story;
import com.taleforge.dto.ErrorResponse;
import com.taleforge.dto.StoryDTO;
import com.taleforge.service.StoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public ResponseEntity<?> getAllStories() {
        try {
            log.info("Fetching all stories");
            List<Story> stories = storyService.getAllStories();
            log.info("Successfully fetched {} stories", stories.size());
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error fetching stories: ", e);
            return ResponseEntity.internalServerError().body("Error fetching stories: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStoryById(@PathVariable Long id) {
        try {
            log.info("Fetching story with id: {}", id);
            Story story = storyService.getStoryById(id);
            if (story != null) {
                log.info("Successfully fetched story with id: {}", id);
                return ResponseEntity.ok(story);
            } else {
                log.warn("Story not found with id: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error fetching story with id {}: ", id, e);
            return ResponseEntity.internalServerError().body("Error fetching story: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createStory(@RequestBody Story story) {
        try {
            log.info("Creating new story: {}", story.getTitle());
            Story createdStory = storyService.createStory(story);
            log.info("Successfully created story with id: {}", createdStory.getId());
            return ResponseEntity.ok(createdStory);
        } catch (Exception e) {
            log.error("Error creating story: ", e);
            return ResponseEntity.internalServerError().body("Error creating story: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStory(@PathVariable Long id, @RequestBody Story story) {
        try {
            log.info("Updating story with id: {}", id);
            Story updatedStory = storyService.updateStory(id, story);
            if (updatedStory != null) {
                log.info("Successfully updated story with id: {}", id);
                return ResponseEntity.ok(updatedStory);
            } else {
                log.warn("Story not found with id: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error updating story with id {}: ", id, e);
            return ResponseEntity.internalServerError().body("Error updating story: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStory(@PathVariable Long id) {
        try {
            log.info("Deleting story with id: {}", id);
            boolean deleted = storyService.deleteStory(id);
            if (deleted) {
                log.info("Successfully deleted story with id: {}", id);
                return ResponseEntity.ok().build();
            } else {
                log.warn("Story not found with id: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error deleting story with id {}: ", id, e);
            return ResponseEntity.internalServerError().body("Error deleting story: " + e.getMessage());
        }
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
    public ResponseEntity<?> publishStory(@PathVariable Long id) {
        try {
            log.info("Publishing story with id: {}", id);
            Story story = storyService.publishStory(id);
            if (story != null) {
                log.info("Successfully published story with id: {}", id);
                return ResponseEntity.ok(story);
            } else {
                log.warn("Story not found with id: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error publishing story with id {}: ", id, e);
            return ResponseEntity.internalServerError().body("Error publishing story: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/unpublish")
    public ResponseEntity<?> unpublishStory(@PathVariable Long id) {
        try {
            log.info("Unpublishing story with id: {}", id);
            Story story = storyService.unpublishStory(id);
            if (story != null) {
                log.info("Successfully unpublished story with id: {}", id);
                return ResponseEntity.ok(story);
            } else {
                log.warn("Story not found with id: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error unpublishing story with id {}: ", id, e);
            return ResponseEntity.internalServerError().body("Error unpublishing story: " + e.getMessage());
        }
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