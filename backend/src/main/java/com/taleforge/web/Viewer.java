package com.taleforge.web;

import com.taleforge.security.AuthUser;

final class Viewer {

    private Viewer() {
    }

    /** The signed-in user's id, or null for anonymous readers on public endpoints. */
    static Long id(AuthUser user) {
        return user == null ? null : user.id();
    }
}
