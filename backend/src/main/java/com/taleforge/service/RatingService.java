package com.taleforge.service;

import com.taleforge.domain.Rating;
import com.taleforge.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RatingService {
    private final RatingRepository ratingRepository;

    public List<Rating> getRatingsByStoryId(Long storyId) {
        return ratingRepository.findByStoryId(storyId);
    }

    public List<Rating> getRatingsByUserId(Long userId) {
        return ratingRepository.findByUserId(userId);
    }

    public Rating createRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    public boolean hasUserRatedStory(Long userId, Long storyId) {
        return ratingRepository.existsByUserIdAndStoryId(userId, storyId);
    }
} 