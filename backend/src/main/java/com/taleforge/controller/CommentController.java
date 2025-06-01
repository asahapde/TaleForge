package com.taleforge.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taleforge.domain.Comment;
import com.taleforge.dto.CommentDTO;
import com.taleforge.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@Transactional
public class CommentController {
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);
    private final CommentService commentService;

    @GetMapping("/story/{storyId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<CommentDTO>> getCommentsByStoryId(
            @PathVariable Long storyId,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Getting comments for story ID: {}", storyId);
        List<Comment> comments = commentService.getCommentsByStoryId(storyId,
                userDetails != null ? userDetails.getUsername() : null);
        return ResponseEntity.ok(comments.stream().map(CommentDTO::fromEntity).collect(Collectors.toList()));
    }

    @PostMapping("/story/{storyId}")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long storyId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Creating comment for story ID: {} by user: {}", storyId, userDetails.getUsername());
        Comment comment = commentService.createComment(storyId, userDetails.getUsername(), request.content());
        return ResponseEntity.ok(CommentDTO.fromEntity(comment));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Updating comment ID: {} by user: {}", commentId, userDetails.getUsername());
        Comment comment = commentService.updateComment(commentId, userDetails.getUsername(), request.content());
        return ResponseEntity.ok(CommentDTO.fromEntity(comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Deleting comment ID: {} by user: {}", commentId, userDetails.getUsername());
        commentService.deleteComment(commentId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<CommentDTO> likeComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Liking comment ID: {} by user: {}", commentId, userDetails.getUsername());
        Comment comment = commentService.likeComment(commentId, userDetails.getUsername());
        return ResponseEntity.ok(CommentDTO.fromEntity(comment));
    }

    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<CommentDTO> unlikeComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        logger.debug("Unliking comment ID: {} by user: {}", commentId, userDetails.getUsername());
        Comment comment = commentService.unlikeComment(commentId, userDetails.getUsername());
        return ResponseEntity.ok(CommentDTO.fromEntity(comment));
    }
}

record CommentRequest(String content) {
}