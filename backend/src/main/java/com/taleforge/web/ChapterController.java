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
import com.taleforge.web.dto.ChapterDtos.BranchActivity;
import com.taleforge.web.dto.ChapterDtos.ChapterDetail;
import com.taleforge.web.dto.ChapterDtos.ChapterRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chapters")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    @GetMapping("/recent")
    public List<BranchActivity> recent(@RequestParam(defaultValue = "6") int limit) {
        return chapterService.recentBranches(limit);
    }

    @GetMapping("/{id}")
    public ChapterDetail get(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return chapterService.get(id, Viewer.id(user));
    }

    @PostMapping("/{id}/branches")
    @ResponseStatus(HttpStatus.CREATED)
    public ChapterDetail branch(@PathVariable Long id, @Valid @RequestBody ChapterRequest request,
            @AuthenticationPrincipal AuthUser user) {
        return chapterService.branch(id, request, user.id());
    }

    @PutMapping("/{id}")
    public ChapterDetail update(@PathVariable Long id, @Valid @RequestBody ChapterRequest request,
            @AuthenticationPrincipal AuthUser user) {
        return chapterService.update(id, request, user.id());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        chapterService.delete(id, user.id());
    }

    @PostMapping("/{id}/view")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void view(@PathVariable Long id) {
        chapterService.recordView(id);
    }
}
