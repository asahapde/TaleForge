package com.taleforge.repository;

import com.taleforge.domain.Story;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByAuthorUsername(String username);
    
    List<Story> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    
    List<Story> findByTagsContaining(String tag);
    
    List<Story> findTop10ByOrderByViewsDesc();

    Page<Story> findByPublishedTrue(Pageable pageable);
    Page<Story> findByTagsContainingAndPublishedTrue(String tag, Pageable pageable);
} 