package com.taleforge.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.taleforge.domain.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.author LEFT JOIN FETCH c.story WHERE c.story.id = :storyId ORDER BY c.createdAt DESC")
    List<Comment> findByStoryIdOrderByCreatedAtDesc(Long storyId);

    void deleteByAuthorIdAndId(Long authorId, Long id);
}