package com.taleforge.security;

import com.taleforge.domain.User;
import com.taleforge.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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

import java.io.IOException;
import java.util.Enumeration;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            logger.debug("Processing request to: {}", request.getRequestURI());
            logger.debug("Request method: {}", request.getMethod());
            
            // Log all headers
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                logger.debug("Header {}: {}", headerName, request.getHeader(headerName));
            }

            final String authHeader = request.getHeader("Authorization");
            logger.debug("Authorization header: {}", authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.debug("No valid Authorization header found");
                filterChain.doFilter(request, response);
                return;
            }

            final String jwt = authHeader.substring(7);
            logger.debug("Extracted JWT token: {}", jwt);

            final String username = jwtService.extractUsername(jwt);
            logger.debug("Extracted username from token: {}", username);

            if (username != null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    logger.debug("Token is valid for user: {}", username);
                    User user = userService.getUserByUsername(username)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    
                    // Set the authentication in the security context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    // Store the user in the request attributes for later use
                    request.setAttribute("user", user);
                    logger.debug("Authentication set in SecurityContext for user: {}", username);
                } else {
                    logger.warn("Invalid token for user: {}", username);
                }
            }
        } catch (Exception e) {
            logger.error("Error processing JWT token", e);
        }
        
        filterChain.doFilter(request, response);
    }
} 