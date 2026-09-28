package com.taleforge.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taleforge.service.UserService;
import com.taleforge.web.dto.ChapterDtos.BranchActivity;
import com.taleforge.web.dto.StoryDtos.StorySummary;
import com.taleforge.web.dto.UserDtos.Profile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users/{username}")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public Profile profile(@PathVariable String username) {
        return userService.profile(username);
    }

    @GetMapping("/stories")
    public List<StorySummary> stories(@PathVariable String username) {
        return userService.storiesBy(username);
    }

    @GetMapping("/branches")
    public List<BranchActivity> branches(@PathVariable String username) {
        return userService.branchesBy(username);
    }
}
