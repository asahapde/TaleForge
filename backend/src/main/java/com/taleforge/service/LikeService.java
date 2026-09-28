package com.taleforge.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taleforge.domain.StoryLike;
import com.taleforge.exception.ApiException;
import com.taleforge.repository.StoryLikeRepository;
import com.taleforge.repository.StoryRepository;
import com.taleforge.web.dto.StoryDtos.LikeResponse;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final StoryLikeRepository likes;
    private final StoryRepository stories;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public LikeResponse status(Long storyId, Long viewerId) {
        var story = stories.findById(storyId).orElseThrow(() -> ApiException.notFound("Story"));
        boolean liked = viewerId != null && likes.existsById(new StoryLike.Id(viewerId, storyId));
        return new LikeResponse(liked, story.getLikeCount());
    }

    @Transactional
    public LikeResponse like(Long storyId, Long viewerId) {
        var story = stories.findById(storyId).orElseThrow(() -> ApiException.notFound("Story"));
        if (!story.isPublished()) {
            throw ApiException.badRequest("Drafts can't be liked.");
        }
        var id = new StoryLike.Id(viewerId, storyId);
        if (!likes.existsById(id)) {
            likes.save(new StoryLike(viewerId, storyId));
            stories.adjustLikeCount(storyId, 1);
        }
        return fresh(storyId, true);
    }

    @Transactional
    public LikeResponse unlike(Long storyId, Long viewerId) {
        var id = new StoryLike.Id(viewerId, storyId);
        if (likes.existsById(id)) {
            likes.deleteById(id);
            likes.flush();
            stories.adjustLikeCount(storyId, -1);
        }
        return fresh(storyId, false);
    }

    private LikeResponse fresh(Long storyId, boolean liked) {
        entityManager.flush();
        entityManager.clear();
        return new LikeResponse(liked, stories.findById(storyId).map(s -> s.getLikeCount()).orElse(0));
    }
}
