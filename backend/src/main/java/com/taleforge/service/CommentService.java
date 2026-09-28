package com.taleforge.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taleforge.domain.Comment;
import com.taleforge.domain.Story;
import com.taleforge.exception.ApiException;
import com.taleforge.repository.CommentRepository;
import com.taleforge.web.dto.CommentDtos.CommentRequest;
import com.taleforge.web.dto.CommentDtos.CommentResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository comments;
    private final StoryService storyService;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<CommentResponse> forStory(Long storyId, Long viewerId) {
        storyService.requireVisible(storyId, viewerId);
        return comments.findForStory(storyId).stream().map(Mapper::comment).toList();
    }

    @Transactional
    public CommentResponse add(Long storyId, CommentRequest request, Long viewerId) {
        Story story = storyService.requireVisible(storyId, viewerId);
        Comment comment = new Comment();
        comment.setStory(story);
        comment.setAuthor(userService.require(viewerId));
        comment.setContent(request.content().strip());
        return Mapper.comment(comments.saveAndFlush(comment));
    }

    @Transactional
    public CommentResponse edit(Long id, CommentRequest request, Long viewerId) {
        Comment comment = comments.findDetail(id).orElseThrow(() -> ApiException.notFound("Comment"));
        if (!comment.getAuthor().getId().equals(viewerId)) {
            throw ApiException.forbidden("You can only edit your own comments.");
        }
        comment.setContent(request.content().strip());
        return Mapper.comment(comments.saveAndFlush(comment));
    }

    @Transactional
    public void delete(Long id, Long viewerId) {
        Comment comment = comments.findDetail(id).orElseThrow(() -> ApiException.notFound("Comment"));
        if (!comment.getAuthor().getId().equals(viewerId) && !comment.getStory().isAuthoredBy(viewerId)) {
            throw ApiException.forbidden("You can only delete your own comments.");
        }
        comments.delete(comment);
    }
}
