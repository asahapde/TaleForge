package com.taleforge.repository;

import com.taleforge.domain.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByAuthorId(Long authorId);
    
    List<Story> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    
    List<Story> findByTagsContaining(String tag);
    
    List<Story> findTop10ByOrderByRatingDesc();
    
    List<Story> findTop10ByOrderByViewsDesc();
} 