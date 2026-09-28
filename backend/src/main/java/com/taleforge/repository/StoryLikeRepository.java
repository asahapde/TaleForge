package com.taleforge.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taleforge.domain.StoryLike;

public interface StoryLikeRepository extends JpaRepository<StoryLike, StoryLike.Id> {
}
