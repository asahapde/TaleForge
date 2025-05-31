package com.taleforge.security;

import com.taleforge.domain.User;
import com.taleforge.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        log.debug("Loading user by username or email: {}", usernameOrEmail);
        
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> {
                    log.debug("User not found by username, trying email: {}", usernameOrEmail);
                    return userRepository.findByEmail(usernameOrEmail)
                            .orElseThrow(() -> {
                                log.error("User not found with username or email: {}", usernameOrEmail);
                                return new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail);
                            });
                });

        log.debug("User found: {}", user.getUsername());
        
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
                .build();
    }
} 