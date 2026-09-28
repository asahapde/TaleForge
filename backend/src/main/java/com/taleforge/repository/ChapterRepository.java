package com.taleforge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taleforge.domain.Chapter;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    @Query("""
            select new com.taleforge.repository.ChapterRow(
                c.id, c.parentId, c.title, c.choiceLabel, c.depth, c.views,
                a.id, a.username, a.displayName, c.createdAt)
            from Chapter c join c.author a
            where c.storyId = :storyId
            order by c.depth, c.createdAt, c.id
            """)
    List<ChapterRow> findTree(@Param("storyId") Long storyId);

    @Query("""
            select c from Chapter c
            join fetch c.author
            join fetch c.story s
            join fetch s.author
            where c.id = :id
            """)
    Optional<Chapter> findDetail(@Param("id") Long id);

    @Query("select c.id from Chapter c where c.storyId = :storyId and c.parentId is null")
    Optional<Long> findRootId(@Param("storyId") Long storyId);

    long countByStoryId(Long storyId);

    long countByParentId(Long parentId);

    @Query("select count(distinct c.author.id) from Chapter c where c.storyId = :storyId")
    long countContributors(@Param("storyId") Long storyId);

    @Query("""
            select count(c) from Chapter c
            where c.author.id = :authorId and c.parentId is not null and c.story.published = true
            """)
    long countPublishedBranchesBy(@Param("authorId") Long authorId);

    @Query("""
            select c from Chapter c
            join fetch c.author
            join fetch c.story s
            where s.published = true and c.parentId is not null
            order by c.createdAt desc, c.id desc
            """)
    List<Chapter> findRecentBranches(Pageable pageable);

    @Query("""
            select c from Chapter c
            join fetch c.author
            join fetch c.story s
            where c.author.id = :authorId and c.parentId is not null
              and (s.published = true or :includeDrafts = true)
            order by c.createdAt desc, c.id desc
            """)
    List<Chapter> findBranchesBy(@Param("authorId") Long authorId, @Param("includeDrafts") boolean includeDrafts);

    @Modifying
    @Query("update Chapter c set c.views = c.views + 1 where c.id = :id")
    int incrementViews(@Param("id") Long id);

    /** Removes the chapter; the database cascades the delete down its subtree. */
    @Modifying
    @Query("delete from Chapter c where c.id = :id")
    void deleteSubtree(@Param("id") Long id);
}
