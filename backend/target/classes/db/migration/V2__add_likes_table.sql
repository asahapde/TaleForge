-- Drop rating column from stories table
ALTER TABLE stories DROP COLUMN IF EXISTS rating;

-- Add likes column to stories table
ALTER TABLE stories ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0;

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_story (user_id, story_id)
); 