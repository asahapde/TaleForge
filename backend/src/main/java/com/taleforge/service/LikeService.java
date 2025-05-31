package com.taleforge.service;

import com.taleforge.domain.Like;
import com.taleforge.domain.Story;
import com.taleforge.domain.User;
import com.taleforge.repository.LikeRepository;
import com.taleforge.repository.StoryRepository;
import com.taleforge.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    @Transactional
    public void likeStory(Long storyId, String username) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new EntityNotFoundException("Story not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!likeRepository.existsByUserAndStory(user, story)) {
            Like like = new Like();
            like.setUser(user);
            like.setStory(story);
            like.setCreatedAt(LocalDateTime.now());
            likeRepository.save(like);
            
            story.setLikes(story.getLikes() + 1);
            storyRepository.save(story);
        }
    }

    @Transactional
    public void unlikeStory(Long storyId, String username) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new EntityNotFoundException("Story not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        likeRepository.findByUserAndStory(user, story).ifPresent(like -> {
            likeRepository.delete(like);
            story.setLikes(story.getLikes() - 1);
            storyRepository.save(story);
        });
    }

    public boolean hasLikedStory(Long storyId, String username) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new EntityNotFoundException("Story not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return likeRepository.existsByUserAndStory(user, story);
    }
} 