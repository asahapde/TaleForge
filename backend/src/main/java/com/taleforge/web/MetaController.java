package com.taleforge.web;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taleforge.service.StoryService;
import com.taleforge.web.dto.TagCount;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MetaController {

    private final StoryService storyService;

    /** Liveness check for the host and the keep-warm ping. Deliberately does not touch the database. */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/tags")
    public List<TagCount> tags(@RequestParam(defaultValue = "20") int limit) {
        return storyService.topTags(limit);
    }
}
