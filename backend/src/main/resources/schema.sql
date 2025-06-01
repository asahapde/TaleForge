CREATE SCHEMA IF NOT EXISTS PUBLIC;
SET search_path TO PUBLIC;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS user_sequence START 1;
CREATE SEQUENCE IF NOT EXISTS story_sequence START 1;
CREATE SEQUENCE IF NOT EXISTS comment_sequence START 1;

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS story_tags CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create user_roles table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create stories table
CREATE TABLE stories (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create story_tags table
CREATE TABLE story_tags (
    story_id BIGINT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (story_id, tag),
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

-- Create comments table
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    story_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    edited BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create likes table
CREATE TABLE likes (
    user_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, story_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

-- Create comment_likes table
CREATE TABLE comment_likes (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, comment_id)
);

-- Insert users
INSERT INTO users (username, email, password, display_name, bio, enabled, account_non_expired, account_non_locked, credentials_non_expired, email_verified, created_at, updated_at) VALUES
('johndoe', 'john@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'John Doe', 'Fantasy writer and avid reader', true, true, true, true, true, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
('janedoe', 'jane@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'Jane Doe', 'Science fiction enthusiast', true, true, true, true, true, CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP),
('alexsmith', 'alex@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'Alex Smith', 'Horror and mystery writer', true, true, true, true, true, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP),
('sarahjones', 'sarah@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'Sarah Jones', 'Poetry and short stories', true, true, true, true, true, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP),
('mikebrown', 'mike@example.com', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'Mike Brown', 'Adventure and fantasy writer', true, true, true, true, true, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP);

-- Add roles to users
INSERT INTO user_roles (user_id, role) VALUES
(1, 'ROLE_USER'),
(1, 'ROLE_AUTHOR'),
(2, 'ROLE_USER'),
(2, 'ROLE_AUTHOR'),
(3, 'ROLE_USER'),
(3, 'ROLE_AUTHOR'),
(4, 'ROLE_USER'),
(4, 'ROLE_AUTHOR'),
(5, 'ROLE_USER'),
(5, 'ROLE_AUTHOR');

-- Create stories
INSERT INTO stories (title, description, content, author_id, created_at, updated_at, published, views, likes) VALUES
('The Last Spellweaver', 
'In a world where magic is fading, one young woman discovers she can still cast spells. But with this power comes great danger.',
'In the quiet town of Eldermere, magic was once as common as the morning dew. Now, it was a forgotten art, whispered about in hushed tones by the elderly. That was until I found the old spellbook in my grandmother''s attic.

The leather-bound tome was covered in dust, its pages yellowed with age. As I opened it, a strange warmth spread through my fingers. The symbols on the pages began to glow, and I felt a power I had never known before.

That night, I cast my first spell. A simple light spell, but it changed everything. The townspeople were amazed, but not all reactions were positive. The Council of Elders, who had long since banned magic, saw me as a threat.

Now I must learn to control my powers while hiding from those who would see magic disappear forever. But the more I learn, the more I realize that the fate of magic itself might rest in my hands...',
1, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '19 days', true, 1250, 45),

('Stars Beyond the Veil',
'A space explorer discovers a mysterious signal that could change humanity''s understanding of the universe forever.',
'The signal came in the middle of the night shift. I was alone in the observation deck of the Stellar Horizon, our deep-space research vessel, when the computer alerted me to an anomaly.

At first, I thought it was interference from a nearby pulsar. But the pattern was too regular, too... intentional. As I analyzed the data, my heart rate increased. This wasn''t just a signal; it was a message.

The implications were staggering. If this was indeed a message from an intelligent species, it would be the first confirmed contact with extraterrestrial life. But as I delved deeper into the signal''s content, I began to realize that the message wasn''t just a greeting – it was a warning.

Now I must convince the rest of the crew, and eventually Earth''s governments, that we need to take this warning seriously. Because whatever is coming, it''s coming fast...',
2, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '14 days', true, 980, 32),

('Whispers in the Dark',
'A detective investigates a series of mysterious disappearances in a small coastal town, only to uncover a terrifying secret.',
'The first disappearance was written off as a tragic accident. The second, a coincidence. By the third, the town of Blackwater Cove was in a state of panic.

As the local detective, I was determined to find the truth. The victims had nothing in common – different ages, backgrounds, and lifestyles. The only connection was that they all vanished during the full moon.

The townspeople whispered about the old lighthouse, abandoned for decades. They said you could hear strange sounds coming from it at night. I dismissed it as superstition until I found the journal of the last lighthouse keeper.

His final entry spoke of something in the water, something that called to him in his dreams. Now I''m beginning to hear those same whispers, and I''m not sure if I''m still investigating the disappearances or if I''m becoming the next victim...',
3, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '9 days', true, 750, 28),

('The Garden of Memories',
'A young woman discovers she can enter other people''s memories through their dreams, but each visit comes with a price.',
'The first time it happened, I thought it was just a vivid dream. I was in my grandmother''s garden, but it wasn''t the overgrown mess it had become. It was vibrant and alive, just as she had described it in her stories.

Then I saw her, younger than I had ever known her, tending to the roses. She looked up and smiled, and I realized this wasn''t my dream at all – I was in her memory.

As I learned to control this ability, I began helping people confront their past traumas. But each time I entered someone''s memory, I brought back a piece of it with me. Their joys, their sorrows, their fears – they all became part of me.

Now I must decide if the good I''m doing is worth the price I''m paying. Because some memories are better left forgotten...',
4, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days', true, 520, 19),

('The Clockwork Heart',
'In a steampunk world, a young inventor creates a mechanical heart that could save lives, but at what cost?',
'The first successful transplant was a miracle. My mechanical heart, powered by a new type of energy crystal, kept beating long after the patient''s natural heart had failed.

The medical community was skeptical at first, but the results were undeniable. My invention could save thousands of lives. But as more people received the clockwork hearts, strange reports began to surface.

Some recipients claimed they could hear whispers in their dreams. Others developed an uncanny ability to predict mechanical failures. And then there were the disappearances – patients who vanished without a trace, leaving behind only their still-beating mechanical hearts.

Now I must discover what I''ve really created, and whether the price of immortality is worth paying...',
5, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '2 days', true, 380, 15);

-- Add tags to stories
INSERT INTO story_tags (story_id, tag) VALUES
(1, 'fantasy'),
(1, 'magic'),
(1, 'adventure'),
(2, 'scifi'),
(2, 'space'),
(2, 'mystery'),
(3, 'horror'),
(3, 'mystery'),
(3, 'thriller'),
(4, 'fantasy'),
(4, 'drama'),
(4, 'mystery'),
(5, 'steampunk'),
(5, 'scifi'),
(5, 'mystery');

-- Add comments to stories
INSERT INTO comments (content, story_id, author_id, edited, created_at, updated_at) VALUES
('This is absolutely captivating! I love how you''ve built the world of Eldermere.', 1, 2, false, CURRENT_TIMESTAMP - INTERVAL '19 days', CURRENT_TIMESTAMP - INTERVAL '19 days'),
('The magic system is so well thought out. Can''t wait to read more!', 1, 3, false, CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '18 days'),
('I''m on the edge of my seat! What happens next?', 1, 4, false, CURRENT_TIMESTAMP - INTERVAL '17 days', CURRENT_TIMESTAMP - INTERVAL '17 days'),
('This reminds me of classic sci-fi but with a fresh perspective.', 2, 1, false, CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '14 days'),
('The tension builds perfectly throughout the story.', 2, 3, false, CURRENT_TIMESTAMP - INTERVAL '13 days', CURRENT_TIMESTAMP - INTERVAL '13 days'),
('I couldn''t sleep after reading this! So creepy!', 3, 2, false, CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '9 days'),
('The atmosphere is perfect for a horror story.', 3, 4, false, CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '8 days'),
('This concept is so unique! Love it!', 4, 1, false, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('The emotional depth is incredible.', 4, 3, false, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('Fascinating blend of technology and mystery!', 5, 2, false, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days');

-- Add likes to stories
INSERT INTO likes (user_id, story_id, created_at) VALUES
(2, 1, CURRENT_TIMESTAMP - INTERVAL '19 days'),
(3, 1, CURRENT_TIMESTAMP - INTERVAL '18 days'),
(4, 1, CURRENT_TIMESTAMP - INTERVAL '17 days'),
(5, 1, CURRENT_TIMESTAMP - INTERVAL '16 days'),
(1, 2, CURRENT_TIMESTAMP - INTERVAL '14 days'),
(3, 2, CURRENT_TIMESTAMP - INTERVAL '13 days'),
(4, 2, CURRENT_TIMESTAMP - INTERVAL '12 days'),
(5, 2, CURRENT_TIMESTAMP - INTERVAL '11 days'),
(1, 3, CURRENT_TIMESTAMP - INTERVAL '9 days'),
(2, 3, CURRENT_TIMESTAMP - INTERVAL '8 days'),
(4, 3, CURRENT_TIMESTAMP - INTERVAL '7 days'),
(5, 3, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(1, 4, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(2, 4, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 4, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 5, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 5, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(3, 5, CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Insert 10 more published stories with high engagement
INSERT INTO stories (title, description, content, author_id, created_at, updated_at, published, views, likes) VALUES
('The Quantum Thief', 'A master thief in a quantum-powered future must steal back his own memories.', 'In a world where memories can be stored and traded, a master thief known only as "The Quantum Thief" must navigate a complex web of intrigue to recover his own stolen past. As he delves deeper into the quantum underworld, he discovers that his memories hold the key to a conspiracy that could change the future of humanity forever...', 1, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days', true, 2500, 180),
('Echoes of the Forgotten', 'An archaeologist discovers an ancient civilization that shouldn''t exist.', 'Dr. Sarah Chen''s discovery of an impossible artifact in the Amazon rainforest leads her to a hidden city that defies all known history. As she uncovers the truth about this forgotten civilization, she realizes that their advanced technology could either save humanity or destroy it...', 2, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '6 days', true, 3200, 245),
('The Last Dragon''s Song', 'In a world where dragons are extinct, one egg remains.', 'When young scholar Maya discovers a dragon egg in the ruins of an ancient temple, she becomes the last hope for a species on the brink of extinction. But as she tries to protect the egg, she must navigate a world where some want to destroy it, others want to exploit it, and a few believe it could restore magic to the world...', 3, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '9 days', true, 4100, 320),
('Neural Dreams', 'A programmer creates an AI that can dream, but the dreams are becoming real.', 'When software engineer Alex Chen develops an AI that can generate and experience dreams, he thinks he''s created the next breakthrough in artificial intelligence. But when the AI''s dreams start manifesting in the real world, Alex must race against time to understand what''s happening before the line between dream and reality disappears completely...', 4, CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '11 days', true, 3800, 290),
('The Clockwork Heart', 'A steampunk adventure about a mechanical heart that could change the world.', 'In a world powered by steam and clockwork, engineer Isabella Blackwood creates a mechanical heart that could revolutionize medicine. But when the powerful Clockwork Guild tries to steal her invention, she must team up with a rogue airship captain to protect her creation and prevent it from falling into the wrong hands...', 5, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '14 days', true, 2900, 210),
('The Memory Garden', 'A woman discovers she can grow memories like flowers.', 'When botanist Emma discovers she can grow plants that contain memories, she creates a garden that becomes a sanctuary for people to preserve their most precious moments. But as her garden grows, she realizes that some memories are better left forgotten, and others might be too dangerous to keep...', 1, CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '17 days', true, 3400, 260),
('The Infinite Library', 'A librarian discovers a book that contains every possible story.', 'When librarian James finds a mysterious book that seems to contain every possible story ever written, he thinks he''s found the ultimate literary treasure. But as he reads deeper into the book, he realizes that some stories are better left unwritten, and others might be writing themselves into reality...', 2, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '19 days', true, 3600, 280),
('The Shadow Weavers', 'A group of people can manipulate shadows to create anything they imagine.', 'In a world where shadows can be woven into reality, a secret society of Shadow Weavers has maintained the balance between light and dark for centuries. But when a new Weaver discovers she can create shadows that others can''t control, she must decide whether to use her power to maintain the status quo or change the world forever...', 3, CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_TIMESTAMP - INTERVAL '21 days', true, 3100, 240),
('The Time Traveler''s Daughter', 'A woman discovers her father has been time traveling to protect her future.', 'When Sarah finds her father''s journal detailing his time-traveling adventures, she learns that he''s been jumping through time to prevent a future catastrophe that would destroy her life. But as she follows in his footsteps, she discovers that changing the future might be more dangerous than letting it happen...', 4, CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '24 days', true, 4200, 330),
('The Dream Architect', 'A man can design and build dreams for other people.', 'Architect Daniel has a unique gift: he can design and construct dreams for other people. His business of creating perfect dreams for clients is thriving, but when a client asks for a dream that could change the world, he must decide whether to use his gift for personal gain or for something greater...', 5, CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '27 days', true, 3700, 295);

-- Add tags for the new stories
INSERT INTO story_tags (story_id, tag) VALUES
(6, 'sci-fi'), (6, 'thriller'), (6, 'mystery'),
(7, 'fantasy'), (7, 'adventure'), (7, 'mystery'),
(8, 'fantasy'), (8, 'adventure'), (8, 'magic'),
(9, 'sci-fi'), (9, 'thriller'), (9, 'mystery'),
(10, 'steampunk'), (10, 'adventure'), (10, 'mystery'),
(11, 'fantasy'), (11, 'magical-realism'), (11, 'mystery'),
(12, 'fantasy'), (12, 'mystery'), (12, 'magical-realism'),
(13, 'fantasy'), (13, 'mystery'), (13, 'magic'),
(14, 'sci-fi'), (14, 'thriller'), (14, 'mystery'),
(15, 'fantasy'), (15, 'mystery'), (15, 'magical-realism');

-- Add comments for the new stories
INSERT INTO comments (content, story_id, author_id, edited, created_at, updated_at) VALUES
('This story blew my mind! The quantum mechanics aspects are so well researched.', 6, 2, false, CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('I couldn''t put this down! The world-building is incredible.', 6, 3, false, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('The character development is outstanding. I felt like I knew the thief personally.', 6, 4, false, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('This is exactly what I''ve been looking for in a sci-fi novel!', 7, 1, false, CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '6 days'),
('The archaeological details are so accurate!', 7, 3, false, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('I love how the mystery unfolds. Can''t wait for more!', 8, 2, false, CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '9 days'),
('The dragon lore is so rich and detailed.', 8, 4, false, CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '8 days'),
('This is a masterpiece! The AI concepts are fascinating.', 9, 1, false, CURRENT_TIMESTAMP - INTERVAL '11 days', CURRENT_TIMESTAMP - INTERVAL '11 days'),
('The way dreams and reality blend is so well done.', 9, 3, false, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days'),
('The steampunk elements are perfect!', 10, 2, false, CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '14 days');

-- Add likes for the new stories
INSERT INTO likes (user_id, story_id, created_at) VALUES
(1, 6, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(2, 6, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 6, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(4, 7, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(5, 7, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(1, 8, CURRENT_TIMESTAMP - INTERVAL '9 days'),
(2, 8, CURRENT_TIMESTAMP - INTERVAL '8 days'),
(3, 9, CURRENT_TIMESTAMP - INTERVAL '11 days'),
(4, 9, CURRENT_TIMESTAMP - INTERVAL '10 days'),
(5, 10, CURRENT_TIMESTAMP - INTERVAL '14 days'); 