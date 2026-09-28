package com.taleforge.security;

/** The authenticated principal, rebuilt from the JWT on every request without a database lookup. */
public record AuthUser(Long id, String username) {
}
