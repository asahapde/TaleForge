package com.taleforge.repository;

import java.time.Instant;

/** A chapter without its text, used to assemble branch trees cheaply. */
public record ChapterRow(
        Long id,
        Long parentId,
        String title,
        String choiceLabel,
        int depth,
        int views,
        Long authorId,
        String authorUsername,
        String authorDisplayName,
        Instant createdAt) {
}
