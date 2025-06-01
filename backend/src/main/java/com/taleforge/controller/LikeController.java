package com.taleforge.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taleforge.service.LikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/stories/{storyId}")
    public ResponseEntity<Void> likeStory(
            @PathVariable Long storyId,
            @AuthenticationPrincipal UserDetails userDetails) {
        likeService.likeStory(storyId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/stories/{storyId}")
    public ResponseEntity<Void> unlikeStory(
            @PathVariable Long storyId,
            @AuthenticationPrincipal UserDetails userDetails) {
        likeService.unlikeStory(storyId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stories/{storyId}/status")
    public ResponseEntity<Boolean> hasLikedStory(
            @PathVariable Long storyId,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean hasLiked = likeService.hasLikedStory(storyId, userDetails.getUsername());
        return ResponseEntity.ok(hasLiked);
    }
}