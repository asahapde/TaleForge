package com.taleforge.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.taleforge.domain.User;
import com.taleforge.exception.ApiException;
import com.taleforge.repository.ChapterRepository;
import com.taleforge.repository.StoryRepository;
import com.taleforge.repository.UserRepository;
import com.taleforge.security.JwtService;
import com.taleforge.web.dto.ChapterDtos.BranchActivity;
import com.taleforge.web.dto.StoryDtos.StorySummary;
import com.taleforge.web.dto.UserDtos.AuthResponse;
import com.taleforge.web.dto.UserDtos.LoginRequest;
import com.taleforge.web.dto.UserDtos.Me;
import com.taleforge.web.dto.UserDtos.Profile;
import com.taleforge.web.dto.UserDtos.RegisterRequest;
import com.taleforge.web.dto.UserDtos.UpdateProfileRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository users;
    private final StoryRepository stories;
    private final ChapterRepository chapters;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();
        if (users.existsByUsernameIgnoreCase(username)) {
            throw ApiException.conflict("That username is taken.");
        }
        if (users.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("An account with that email already exists.");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setDisplayName(StringUtils.hasText(request.displayName()) ? request.displayName().trim() : username);
        users.save(user);
        return new AuthResponse(jwtService.issue(user), Mapper.me(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String login = request.login().trim();
        User user = (login.contains("@") ? users.findByEmailIgnoreCase(login) : users.findByUsernameIgnoreCase(login))
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Wrong username or password."));
        return new AuthResponse(jwtService.issue(user), Mapper.me(user));
    }

    @Transactional(readOnly = true)
    public Me me(Long userId) {
        return Mapper.me(require(userId));
    }

    @Transactional
    public Me updateProfile(Long userId, UpdateProfileRequest request) {
        User user = require(userId);
        user.setDisplayName(request.displayName().trim());
        user.setBio(StringUtils.hasText(request.bio()) ? request.bio().trim() : null);
        return Mapper.me(user);
    }

    @Transactional(readOnly = true)
    public Profile profile(String username) {
        User user = byUsername(username);
        return new Profile(user.getId(), user.getUsername(), user.getDisplayName(), user.getBio(), user.getCreatedAt(),
                stories.countByAuthorIdAndPublishedTrue(user.getId()),
                chapters.countPublishedBranchesBy(user.getId()));
    }

    @Transactional(readOnly = true)
    public List<StorySummary> storiesBy(String username) {
        return stories.findByAuthorIdAndPublishedTrueOrderByUpdatedAtDesc(byUsername(username).getId())
                .stream().map(Mapper::story).toList();
    }

    @Transactional(readOnly = true)
    public List<BranchActivity> branchesBy(String username) {
        return chapters.findBranchesBy(byUsername(username).getId(), false).stream().map(Mapper::branch).toList();
    }

    @Transactional(readOnly = true)
    public List<StorySummary> myStories(Long userId) {
        return stories.findByAuthorIdOrderByUpdatedAtDesc(userId).stream().map(Mapper::story).toList();
    }

    @Transactional(readOnly = true)
    public List<BranchActivity> myBranches(Long userId) {
        return chapters.findBranchesBy(userId, true).stream().map(Mapper::branch).toList();
    }

    User require(Long userId) {
        return users.findById(userId).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED,
                "Your account no longer exists. Please sign in again."));
    }

    private User byUsername(String username) {
        return users.findByUsernameIgnoreCase(username).orElseThrow(() -> ApiException.notFound("Writer"));
    }
}
