package com.taleforge.repository;

import com.taleforge.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByStoryId(Long storyId);
    List<Rating> findByUserId(Long userId);
    boolean existsByUserIdAndStoryId(Long userId, Long storyId);
} 