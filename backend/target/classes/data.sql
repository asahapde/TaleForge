-- Insert test user
INSERT INTO users (username, email, password, display_name, bio, enabled)
VALUES ('testuser', 'test@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'Test User', 'A test user account', true);

-- Insert user roles
INSERT INTO user_roles (user_id, role)
VALUES (1, 'ROLE_USER'), (1, 'ROLE_AUTHOR');

-- Insert test story
INSERT INTO stories (title, description, content, author_id, published, views, likes)
VALUES ('Test Story', 'This is a test story description', 'This is the content of the test story.', 1, true, 0, 0);

-- Insert test story tags
INSERT INTO story_tags (story_id, tag)
VALUES (1, 'test'), (1, 'sample');

-- Insert sample users
INSERT INTO users (username, email, password, display_name, bio, enabled)
VALUES ('admin', 'admin@example.com', '$2a$10$rDkPvvAFV6GgJjXpYWYw8OZqXZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Admin User', 'System Administrator', true);

-- Insert sample stories
INSERT INTO stories (title, description, content, author_id, published, views, likes)
VALUES ('Sample Story', 'A sample story description', 'This is the content of the sample story.', 1, true, 0, 0); 