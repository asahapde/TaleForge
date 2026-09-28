package com.taleforge.web;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taleforge.security.AuthUser;
import com.taleforge.service.UserService;
import com.taleforge.web.dto.ChapterDtos.BranchActivity;
import com.taleforge.web.dto.StoryDtos.StorySummary;
import com.taleforge.web.dto.UserDtos.Me;
import com.taleforge.web.dto.UserDtos.UpdateProfileRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/me")
@RequiredArgsConstructor
public class MeController {

    private final UserService userService;

    @GetMapping
    public Me me(@AuthenticationPrincipal AuthUser user) {
        return userService.me(user.id());
    }

    @PutMapping
    public Me update(@AuthenticationPrincipal AuthUser user, @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(user.id(), request);
    }

    @GetMapping("/stories")
    public List<StorySummary> stories(@AuthenticationPrincipal AuthUser user) {
        return userService.myStories(user.id());
    }

    @GetMapping("/branches")
    public List<BranchActivity> branches(@AuthenticationPrincipal AuthUser user) {
        return userService.myBranches(user.id());
    }
}
