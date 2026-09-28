package com.taleforge.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.taleforge.domain.Chapter;
import com.taleforge.domain.Story;
import com.taleforge.exception.ApiException;
import com.taleforge.repository.ChapterRepository;
import com.taleforge.repository.ChapterRow;
import com.taleforge.web.dto.ChapterDtos.BranchActivity;
import com.taleforge.web.dto.ChapterDtos.ChapterDetail;
import com.taleforge.web.dto.ChapterDtos.ChapterNode;
import com.taleforge.web.dto.ChapterDtos.ChapterRequest;
import com.taleforge.web.dto.ChapterDtos.PathStep;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChapterService {

    /** Keeps the list of choices under a chapter readable. */
    static final int MAX_BRANCHES_PER_CHAPTER = 8;

    private final ChapterRepository chapters;
    private final StoryService storyService;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<ChapterNode> tree(Long storyId, Long viewerId) {
        Story story = storyService.requireVisible(storyId, viewerId);
        Long authorId = story.getAuthor().getId();
        return chapters.findTree(storyId).stream().map(row -> Mapper.node(row, authorId)).toList();
    }

    @Transactional(readOnly = true)
    public ChapterDetail get(Long id, Long viewerId) {
        Chapter chapter = chapters.findDetail(id).orElseThrow(() -> ApiException.notFound("Chapter"));
        Story story = chapter.getStory();
        if (!story.isPublished() && !story.isAuthoredBy(viewerId)) {
            throw ApiException.notFound("Chapter");
        }
        Long storyAuthorId = story.getAuthor().getId();
        List<ChapterRow> tree = chapters.findTree(story.getId());
        Map<Long, ChapterRow> byId = tree.stream().collect(Collectors.toMap(ChapterRow::id, Function.identity()));

        Long parentId = byId.get(chapter.getId()).parentId();

        List<PathStep> path = new ArrayList<>();
        for (Long cursor = parentId; cursor != null; cursor = byId.get(cursor).parentId()) {
            ChapterRow step = byId.get(cursor);
            path.add(new PathStep(step.id(), step.title(), step.choiceLabel()));
        }
        Collections.reverse(path);

        // The author's own continuation comes first, then the paths readers have taken most.
        List<ChapterNode> choices = tree.stream()
                .filter(row -> id.equals(row.parentId()))
                .map(row -> Mapper.node(row, storyAuthorId))
                .sorted(Comparator.comparing(ChapterNode::byStoryAuthor).reversed()
                        .thenComparing(Comparator.comparingInt(ChapterNode::views).reversed())
                        .thenComparing(ChapterNode::createdAt))
                .toList();

        return new ChapterDetail(chapter.getId(), story.getId(), story.getTitle(), Mapper.user(story.getAuthor()),
                story.isPublished(), story.isOpenToBranches(), parentId, chapter.getTitle(),
                chapter.getChoiceLabel(), chapter.getContent(), chapter.getDepth(), chapter.getViews(),
                Mapper.user(chapter.getAuthor()), chapter.getAuthor().getId().equals(storyAuthorId),
                chapter.getCreatedAt(), chapter.getUpdatedAt(), path, choices);
    }

    @Transactional
    public ChapterDetail branch(Long parentId, ChapterRequest request, Long viewerId) {
        Chapter parent = chapters.findDetail(parentId).orElseThrow(() -> ApiException.notFound("Chapter"));
        Story story = parent.getStory();
        boolean isStoryAuthor = story.isAuthoredBy(viewerId);
        if (!story.isPublished() && !isStoryAuthor) {
            throw ApiException.notFound("Chapter");
        }
        if (!story.isOpenToBranches() && !isStoryAuthor) {
            throw ApiException.forbidden("The author isn't accepting new branches for this story.");
        }
        if (!StringUtils.hasText(request.choiceLabel())) {
            throw ApiException.badRequest("Write the choice readers will pick to follow your branch.");
        }
        if (chapters.countByParentId(parentId) >= MAX_BRANCHES_PER_CHAPTER) {
            throw ApiException.conflict("This chapter already has " + MAX_BRANCHES_PER_CHAPTER
                    + " branches. Try continuing one of them instead.");
        }

        Chapter chapter = new Chapter();
        chapter.setStory(story);
        chapter.setParent(parent);
        chapter.setAuthor(userService.require(viewerId));
        chapter.setDepth(parent.getDepth() + 1);
        applyText(chapter, request);
        chapters.saveAndFlush(chapter);
        story.setChapterCount((int) chapters.countByStoryId(story.getId()));

        return get(chapter.getId(), viewerId);
    }

    @Transactional
    public ChapterDetail update(Long id, ChapterRequest request, Long viewerId) {
        Chapter chapter = chapters.findDetail(id).orElseThrow(() -> ApiException.notFound("Chapter"));
        if (!chapter.getAuthor().getId().equals(viewerId)) {
            throw ApiException.forbidden("Only the writer of this chapter can edit it.");
        }
        if (chapter.getParentId() != null && !StringUtils.hasText(request.choiceLabel())) {
            throw ApiException.badRequest("Write the choice readers will pick to follow this branch.");
        }
        applyText(chapter, request);
        chapters.flush();
        return get(id, viewerId);
    }

    @Transactional
    public void delete(Long id, Long viewerId) {
        Chapter chapter = chapters.findDetail(id).orElseThrow(() -> ApiException.notFound("Chapter"));
        Story story = chapter.getStory();
        if (chapter.getParentId() == null) {
            throw ApiException.badRequest("This is the opening chapter. Delete the whole story instead.");
        }
        boolean isStoryAuthor = story.isAuthoredBy(viewerId);
        boolean isChapterAuthor = chapter.getAuthor().getId().equals(viewerId);
        if (!isStoryAuthor && !isChapterAuthor) {
            throw ApiException.forbidden("You can only delete chapters you wrote.");
        }
        if (!isStoryAuthor && chapters.countByParentId(id) > 0) {
            throw ApiException.conflict("Other writers have continued from this chapter, so it can't be deleted.");
        }
        chapters.deleteSubtree(id);
        story.setChapterCount((int) chapters.countByStoryId(story.getId()));
    }

    @Transactional
    public void recordView(Long id) {
        chapters.incrementViews(id);
    }

    @Transactional(readOnly = true)
    public List<BranchActivity> recentBranches(int limit) {
        return chapters.findRecentBranches(PageRequest.of(0, Math.clamp(limit, 1, 24))).stream()
                .map(Mapper::branch).toList();
    }

    private static void applyText(Chapter chapter, ChapterRequest request) {
        chapter.setTitle(request.title().trim());
        chapter.setContent(cleanContent(request.content()));
        chapter.setChoiceLabel(chapter.getParentId() == null && chapter.getParent() == null
                ? null
                : request.choiceLabel().trim());
    }

    /** Normalizes line endings and trims runs of blank lines; paragraphs are separated by one blank line. */
    static String cleanContent(String content) {
        return content.replace("\r\n", "\n").replaceAll("[ \\t]+\\n", "\n").replaceAll("\\n{3,}", "\n\n").strip();
    }
}
