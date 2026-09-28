package com.taleforge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taleforge.domain.Story;
import com.taleforge.web.dto.TagCount;

public interface StoryRepository extends JpaRepository<Story, Long>, JpaSpecificationExecutor<Story> {

    @Query("select s from Story s join fetch s.author where s.id = :id")
    Optional<Story> findWithAuthor(@Param("id") Long id);

    List<Story> findByAuthorIdOrderByUpdatedAtDesc(Long authorId);

    List<Story> findByAuthorIdAndPublishedTrueOrderByUpdatedAtDesc(Long authorId);

    long countByAuthorIdAndPublishedTrue(Long authorId);

    @Query("""
            select new com.taleforge.web.dto.TagCount(t, count(s))
            from Story s join s.tags t
            where s.published = true
            group by t
            order by count(s) desc, t asc
            """)
    List<TagCount> topTags(Pageable pageable);

    @Modifying
    @Query("update Story s set s.views = s.views + 1 where s.id = :id and s.published = true")
    int incrementViews(@Param("id") Long id);

    @Modifying
    @Query("update Story s set s.likeCount = s.likeCount + :delta where s.id = :id")
    void adjustLikeCount(@Param("id") Long id, @Param("delta") int delta);
}
