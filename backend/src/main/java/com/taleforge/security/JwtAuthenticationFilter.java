package com.taleforge.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.taleforge.domain.User;
import com.taleforge.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserService userService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        logger.debug("Checking path: {} with method: {}", path, method);

        boolean shouldNotFilter = path.startsWith("/auth/") ||
                path.startsWith("/h2-console/") ||
                (path.startsWith("/stories/") && method.equals("GET")) ||
                (path.startsWith("/likes/") && method.equals("GET")) ||
                (path.startsWith("/comments/story/") && method.equals("GET"));

        logger.debug("Should not filter: {}", shouldNotFilter);
        return shouldNotFilter;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            final String authHeader = request.getHeader("Authorization");
            logger.debug("Authorization header: {}", authHeader);
            logger.debug("Request URI: {}", request.getRequestURI());
            logger.debug("Request Method: {}", request.getMethod());

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.debug("No valid Authorization header found");
                filterChain.doFilter(request, response);
                return;
            }

            final String jwt = authHeader.substring(7);
            final String username = jwtService.extractUsername(jwt);
            logger.debug("Extracted username: {}", username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                logger.debug("Loaded user details for username: {}", username);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    User user = userService.getUserByUsername(username)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    request.setAttribute("user", user);
                    logger.debug("Authentication successful for user: {}", username);
                } else {
                    logger.debug("Token validation failed for user: {}", username);
                }
            }
        } catch (Exception e) {
            logger.error("Error processing JWT token", e);
        }

        filterChain.doFilter(request, response);
    }
}