package com.taleforge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taleforge.domain.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("select c from Comment c join fetch c.author where c.story.id = :storyId order by c.createdAt desc, c.id desc")
    List<Comment> findForStory(@Param("storyId") Long storyId);

    @Query("select c from Comment c join fetch c.author join fetch c.story s join fetch s.author where c.id = :id")
    Optional<Comment> findDetail(@Param("id") Long id);

    long countByStoryId(Long storyId);
}
