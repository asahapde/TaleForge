package com.taleforge.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taleforge.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameIgnoreCase(String username);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);
}
