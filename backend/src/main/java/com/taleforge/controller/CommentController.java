package com.taleforge.controller;

import com.taleforge.domain.Comment;
import com.taleforge.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);
    private final CommentService commentService;

    @GetMapping("/story/{storyId}")
    public ResponseEntity<List<Comment>> getCommentsByStoryId(@PathVariable Long storyId) {
        logger.debug("Getting comments for story ID: {}", storyId);
        return ResponseEntity.ok(commentService.getCommentsByStoryId(storyId));
    }

    @PostMapping("/story/{storyId}")
    public ResponseEntity<Comment> createComment(
            @PathVariable Long storyId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Creating comment for story ID: {} by user: {}", storyId, userDetails.getUsername());
        return ResponseEntity.ok(commentService.createComment(storyId, userDetails.getUsername(), request.content()));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Updating comment ID: {} by user: {}", commentId, userDetails.getUsername());
        return ResponseEntity.ok(commentService.updateComment(commentId, userDetails.getUsername(), request.content()));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Deleting comment ID: {} by user: {}", commentId, userDetails.getUsername());
        commentService.deleteComment(commentId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}

record CommentRequest(String content) {} 