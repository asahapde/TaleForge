package com.taleforge.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.taleforge.domain.Chapter;
import com.taleforge.domain.Story;
import com.taleforge.exception.ApiException;
import com.taleforge.repository.ChapterRepository;
import com.taleforge.repository.CommentRepository;
import com.taleforge.repository.StoryRepository;
import com.taleforge.repository.StorySpecifications;
import com.taleforge.web.dto.PageResponse;
import com.taleforge.web.dto.StoryDtos.StoryDetail;
import com.taleforge.web.dto.StoryDtos.StoryRequest;
import com.taleforge.web.dto.StoryDtos.StorySummary;
import com.taleforge.web.dto.TagCount;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StoryService {

    private static final int MAX_PAGE_SIZE = 48;

    private final StoryRepository stories;
    private final ChapterRepository chapters;
    private final CommentRepository comments;
    private final UserService userService;

    @Transactional(readOnly = true)
    public PageResponse<StorySummary> search(String q, String tag, String sort, int page, int size) {
        Specification<Story> spec = StorySpecifications.published();
        if (StringUtils.hasText(q)) {
            spec = spec.and(StorySpecifications.matches(q.trim()));
        }
        if (StringUtils.hasText(tag)) {
            spec = spec.and(StorySpecifications.hasTag(normalizeTag(tag)));
        }
        var pageable = PageRequest.of(Math.max(page, 0), Math.clamp(size, 1, MAX_PAGE_SIZE), sortFor(sort));
        return PageResponse.of(stories.findAll(spec, pageable), Mapper::story);
    }

    @Transactional(readOnly = true)
    public StoryDetail get(Long id, Long viewerId) {
        Story story = requireVisible(id, viewerId);
        return detail(story);
    }

    @Transactional(readOnly = true)
    public List<TagCount> topTags(int limit) {
        return stories.topTags(PageRequest.of(0, Math.clamp(limit, 1, 50)));
    }

    @Transactional
    public StoryDetail create(StoryRequest request, Long authorId) {
        if (request.firstChapter() == null) {
            throw ApiException.badRequest("A story needs its first chapter.");
        }
        Story story = new Story();
        story.setAuthor(userService.require(authorId));
        apply(story, request);
        story.setChapterCount(1);
        stories.save(story);

        Chapter root = new Chapter();
        root.setStory(story);
        root.setAuthor(story.getAuthor());
        root.setTitle(request.firstChapter().title().trim());
        root.setContent(ChapterService.cleanContent(request.firstChapter().content()));
        root.setDepth(0);
        chapters.save(root);

        return detail(story);
    }

    @Transactional
    public StoryDetail update(Long id, StoryRequest request, Long viewerId) {
        Story story = requireOwned(id, viewerId);
        apply(story, request);
        return detail(story);
    }

    @Transactional
    public void delete(Long id, Long viewerId) {
        stories.delete(requireOwned(id, viewerId));
    }

    @Transactional
    public void recordView(Long id) {
        stories.incrementViews(id);
    }

    Story requireVisible(Long id, Long viewerId) {
        Story story = stories.findWithAuthor(id).orElseThrow(() -> ApiException.notFound("Story"));
        if (!story.isPublished() && !story.isAuthoredBy(viewerId)) {
            throw ApiException.notFound("Story");
        }
        return story;
    }

    private Story requireOwned(Long id, Long viewerId) {
        Story story = stories.findWithAuthor(id).orElseThrow(() -> ApiException.notFound("Story"));
        if (!story.isAuthoredBy(viewerId)) {
            throw ApiException.forbidden("Only the author can change this story.");
        }
        return story;
    }

    private StoryDetail detail(Story s) {
        return new StoryDetail(s.getId(), s.getTitle(), s.getDescription(), Mapper.sortedTags(s),
                Mapper.user(s.getAuthor()), s.isPublished(), s.isOpenToBranches(), s.getViews(), s.getLikeCount(),
                s.getChapterCount(), chapters.countContributors(s.getId()), comments.countByStoryId(s.getId()),
                chapters.findRootId(s.getId()).orElse(null), s.getCreatedAt(), s.getUpdatedAt());
    }

    private static void apply(Story story, StoryRequest request) {
        story.setTitle(request.title().trim());
        story.setDescription(request.description().trim());
        story.setPublished(request.published());
        if (request.openToBranches() != null) {
            story.setOpenToBranches(request.openToBranches());
        }
        Set<String> tags = new LinkedHashSet<>();
        if (request.tags() != null) {
            request.tags().stream().map(StoryService::normalizeTag).filter(StringUtils::hasText).limit(6)
                    .forEach(tags::add);
        }
        story.getTags().clear();
        story.getTags().addAll(tags);
    }

    static String normalizeTag(String raw) {
        String tag = raw.trim().toLowerCase(Locale.ROOT).replaceAll("^#+", "").replaceAll("[\\s_]+", "-")
                .replaceAll("[^a-z0-9-]", "").replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
        return tag.length() > 30 ? tag.substring(0, 30) : tag;
    }

    private static Sort sortFor(String sort) {
        String key = sort == null ? "new" : sort.toLowerCase(Locale.ROOT);
        Sort primary = switch (key) {
            case "popular" -> Sort.by(Sort.Direction.DESC, "views");
            case "liked" -> Sort.by(Sort.Direction.DESC, "likeCount");
            case "branching" -> Sort.by(Sort.Direction.DESC, "chapterCount");
            case "updated" -> Sort.by(Sort.Direction.DESC, "updatedAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
        return primary.and(Sort.by(Sort.Direction.DESC, "id"));
    }
}
