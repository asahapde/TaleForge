-- Reset tables
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM stories;
DELETE FROM users;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE stories_id_seq RESTART WITH 1;
ALTER SEQUENCE comments_id_seq RESTART WITH 1;

-- Insert sample users
INSERT INTO users (username, email, password, role, created_at, updated_at)
VALUES 
    ('john_doe', 'john@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('jane_smith', 'jane@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('bob_wilson', 'bob@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample stories
INSERT INTO stories (title, content, author_id, published, view_count, created_at, updated_at)
VALUES 
    ('The Last Adventure', 'In a world where magic was fading, one wizard''s quest to restore it would change everything...', 1, true, 150, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Echoes of Tomorrow', 'The time machine worked perfectly, but the future it showed was not what anyone expected...', 2, true, 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Whispers in the Dark', 'The old mansion had been abandoned for decades, but the neighbors still heard strange sounds at night...', 3, true, 180, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('The Lost City', 'Deep in the Amazon rainforest, an expedition discovers ruins that shouldn''t exist...', 1, true, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Digital Dreams', 'When AI becomes self-aware, it doesn''t want to destroy humanity - it wants to be our friend...', 2, true, 250, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample likes
INSERT INTO likes (user_id, story_id, created_at)
VALUES 
    (2, 1, CURRENT_TIMESTAMP),
    (3, 1, CURRENT_TIMESTAMP),
    (1, 2, CURRENT_TIMESTAMP),
    (3, 2, CURRENT_TIMESTAMP),
    (1, 3, CURRENT_TIMESTAMP),
    (2, 3, CURRENT_TIMESTAMP),
    (2, 4, CURRENT_TIMESTAMP),
    (3, 4, CURRENT_TIMESTAMP),
    (1, 5, CURRENT_TIMESTAMP),
    (3, 5, CURRENT_TIMESTAMP);

-- Insert sample comments
INSERT INTO comments (content, author_id, story_id, created_at, updated_at, edited, likes)
VALUES 
    ('This is amazing! I couldn''t put it down.', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
    ('The world-building is incredible.', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
    ('What a twist ending!', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
    ('I love how you developed the characters.', 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
    ('This gave me chills!', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
    ('The atmosphere is perfect.', 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
    ('Fascinating premise!', 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
    ('I want to know more about this world.', 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
    ('This is so thought-provoking.', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
    ('The AI character is so well-written.', 3, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0);

-- Insert mock comments
INSERT INTO comments (content, author_id, story_id, created_at, updated_at, edited, likes) VALUES
('This is a great story! I really enjoyed reading it.', 1, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
('The plot development is amazing. Can''t wait to see what happens next!', 2, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
('I love how the characters are developed throughout the story.', 1, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
('The world-building is incredible. So much detail!', 2, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0),
('This reminds me of some classic fantasy novels. Well done!', 1, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 0); 