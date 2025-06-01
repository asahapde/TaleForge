package com.taleforge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taleforge.domain.Like;
import com.taleforge.domain.Story;
import com.taleforge.domain.User;

@Repository
public interface LikeRepository extends JpaRepository<Like, Like.LikeId> {
    boolean existsByUserAndStory(User user, Story story);

    Optional<Like> findByUserAndStory(User user, Story story);

    void deleteByUserAndStory(User user, Story story);

    long countByStory(Story story);
}