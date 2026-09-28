package com.taleforge.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.taleforge.security.AuthUser;
import com.taleforge.service.ChapterService;
import com.taleforge.service.CommentService;
import com.taleforge.service.LikeService;
import com.taleforge.service.StoryService;
import com.taleforge.web.dto.ChapterDtos.ChapterNode;
import com.taleforge.web.dto.CommentDtos.CommentRequest;
import com.taleforge.web.dto.CommentDtos.CommentResponse;
import com.taleforge.web.dto.PageResponse;
import com.taleforge.web.dto.StoryDtos.LikeResponse;
import com.taleforge.web.dto.StoryDtos.StoryDetail;
import com.taleforge.web.dto.StoryDtos.StoryRequest;
import com.taleforge.web.dto.StoryDtos.StorySummary;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;
    private final ChapterService chapterService;
    private final CommentService commentService;
    private final LikeService likeService;

    @GetMapping
    public PageResponse<StorySummary> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "new") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return storyService.search(q, tag, sort, page, size);
    }

    @GetMapping("/{id}")
    public StoryDetail get(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return storyService.get(id, Viewer.id(user));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StoryDetail create(@Valid @RequestBody StoryRequest request, @AuthenticationPrincipal AuthUser user) {
        return storyService.create(request, user.id());
    }

    @PutMapping("/{id}")
    public StoryDetail update(@PathVariable Long id, @Valid @RequestBody StoryRequest request,
            @AuthenticationPrincipal AuthUser user) {
        return storyService.update(id, request, user.id());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        storyService.delete(id, user.id());
    }

    @PostMapping("/{id}/view")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void view(@PathVariable Long id) {
        storyService.recordView(id);
    }

    @GetMapping("/{id}/tree")
    public List<ChapterNode> tree(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return chapterService.tree(id, Viewer.id(user));
    }

    @GetMapping("/{id}/like")
    public LikeResponse likeStatus(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return likeService.status(id, Viewer.id(user));
    }

    @PostMapping("/{id}/like")
    public LikeResponse like(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return likeService.like(id, user.id());
    }

    @DeleteMapping("/{id}/like")
    public LikeResponse unlike(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return likeService.unlike(id, user.id());
    }

    @GetMapping("/{id}/comments")
    public List<CommentResponse> comments(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return commentService.forStory(id, Viewer.id(user));
    }

    @PostMapping("/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse comment(@PathVariable Long id, @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal AuthUser user) {
        return commentService.add(id, request, user.id());
    }
}
