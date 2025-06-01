package com.taleforge.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taleforge.domain.Comment;
import com.taleforge.domain.Story;
import com.taleforge.domain.User;
import com.taleforge.repository.CommentRepository;
import com.taleforge.repository.StoryRepository;
import com.taleforge.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Comment> getCommentsByStoryId(Long storyId) {
        List<Comment> comments = commentRepository.findByStoryIdOrderByCreatedAtDesc(storyId);
        // Initialize the lazy-loaded relationships
        comments.forEach(comment -> {
            comment.getAuthor().getUsername();
            comment.getStory().getId();
        });
        return comments;
    }

    @Transactional
    public Comment createComment(Long storyId, String username, String content) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new EntityNotFoundException("Story not found"));
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setStory(story);
        comment.setAuthor(author);

        Comment savedComment = commentRepository.save(comment);

        // Initialize lazy-loaded relationships
        savedComment.getAuthor().getUsername();
        savedComment.getStory().getId();

        return savedComment;
    }

    @Transactional
    public Comment updateComment(Long commentId, String username, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!comment.getAuthor().getId().equals(author.getId())) {
            throw new IllegalStateException("User is not authorized to edit this comment");
        }

        comment.setContent(content);
        comment.setEdited(true);
        Comment savedComment = commentRepository.save(comment);

        // Initialize lazy-loaded relationships
        savedComment.getAuthor().getUsername();
        savedComment.getStory().getId();

        return savedComment;
    }

    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!comment.getAuthor().getId().equals(author.getId())) {
            throw new IllegalStateException("User is not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public Comment likeComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (comment.getAuthor().getId().equals(user.getId())) {
            throw new IllegalStateException("Cannot like your own comment");
        }

        comment.setLikes(comment.getLikes() + 1);
        comment.setLiked(true);
        Comment savedComment = commentRepository.save(comment);

        // Initialize lazy-loaded relationships
        savedComment.getAuthor().getUsername();
        savedComment.getStory().getId();

        return savedComment;
    }

    @Transactional
    public Comment unlikeComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (comment.getAuthor().getId().equals(user.getId())) {
            throw new IllegalStateException("Cannot unlike your own comment");
        }

        if (comment.getLikes() > 0) {
            comment.setLikes(comment.getLikes() - 1);
        }
        comment.setLiked(false);
        Comment savedComment = commentRepository.save(comment);

        // Initialize lazy-loaded relationships
        savedComment.getAuthor().getUsername();
        savedComment.getStory().getId();

        return savedComment;
    }
}