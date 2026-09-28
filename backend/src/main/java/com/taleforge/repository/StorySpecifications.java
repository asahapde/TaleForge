package com.taleforge.repository;

import org.springframework.data.jpa.domain.Specification;

import com.taleforge.domain.Story;

public final class StorySpecifications {

    private StorySpecifications() {
    }

    public static Specification<Story> published() {
        return (root, query, cb) -> cb.isTrue(root.get("published"));
    }

    public static Specification<Story> matches(String text) {
        String pattern = "%" + text.toLowerCase().replace("%", "\\%").replace("_", "\\_") + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), pattern, '\\'),
                cb.like(cb.lower(root.get("description")), pattern, '\\'));
    }

    public static Specification<Story> hasTag(String tag) {
        return (root, query, cb) -> cb.equal(root.join("tags"), tag);
    }
}
