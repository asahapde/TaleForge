package com.taleforge.repository;

import com.taleforge.domain.Like;
import com.taleforge.domain.Story;
import com.taleforge.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserAndStory(User user, Story story);
    Optional<Like> findByUserAndStory(User user, Story story);
    void deleteByUserAndStory(User user, Story story);
    long countByStory(Story story);
} 