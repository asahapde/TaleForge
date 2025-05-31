package com.taleforge.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
@Table(name = "story_nodes")
@EntityListeners(AuditingEntityListener.class)
public class StoryNode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @Column(nullable = false, length = 10000)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_node_id")
    private StoryNode parentNode;

    @OneToMany(mappedBy = "parentNode", cascade = CascadeType.ALL)
    private Set<StoryNode> childNodes = new HashSet<>();

    @Column(nullable = false)
    private int position;

    @Column(nullable = false)
    private boolean isRoot = false;

    @Column(nullable = false)
    private boolean isEnding = false;

    @Column(nullable = false)
    private boolean approved = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private int votes = 0;

    @ElementCollection
    @CollectionTable(name = "node_tags", joinColumns = @JoinColumn(name = "node_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();
} 