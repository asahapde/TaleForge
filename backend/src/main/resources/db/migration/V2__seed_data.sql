-- Demo content. Every demo account signs in with the password "password123".

INSERT INTO users (id, username, email, password_hash, display_name, bio, created_at) VALUES
(1, 'johndoe',    'john@example.com',  '$2a$10$QvC4kktFk5EPb96TvgbgGuGRYrXTrbCGjcm8HPewGbazvcQ49w.5G', 'John Doe',    'Writes fantasy on the train. Reads it everywhere else.', CURRENT_TIMESTAMP - INTERVAL '60' DAY),
(2, 'janedoe',    'jane@example.com',  '$2a$10$QvC4kktFk5EPb96TvgbgGuGRYrXTrbCGjcm8HPewGbazvcQ49w.5G', 'Jane Doe',    'Science fiction, mostly. Occasionally a ghost story when the nights get long.', CURRENT_TIMESTAMP - INTERVAL '55' DAY),
(3, 'alexsmith',  'alex@example.com',  '$2a$10$QvC4kktFk5EPb96TvgbgGuGRYrXTrbCGjcm8HPewGbazvcQ49w.5G', 'Alex Smith',  'Horror and slow-burn mystery. I grew up in a town with a lighthouse.', CURRENT_TIMESTAMP - INTERVAL '50' DAY),
(4, 'sarahjones', 'sarah@example.com', '$2a$10$QvC4kktFk5EPb96TvgbgGuGRYrXTrbCGjcm8HPewGbazvcQ49w.5G', 'Sarah Jones', 'Short fiction and the occasional poem that refuses to stay short.', CURRENT_TIMESTAMP - INTERVAL '45' DAY),
(5, 'mikebrown',  'mike@example.com',  '$2a$10$QvC4kktFk5EPb96TvgbgGuGRYrXTrbCGjcm8HPewGbazvcQ49w.5G', 'Mike Brown',  'Adventure stories with maps in the margins.', CURRENT_TIMESTAMP - INTERVAL '40' DAY);

INSERT INTO stories (id, title, description, author_id, published, open_to_branches, views, created_at, updated_at) VALUES
(1,  'Whispers in the Dark', 'A detective investigates a series of disappearances in a small coastal town, and finds the old lighthouse keeper''s journal.', 3, TRUE, TRUE, 750,  CURRENT_TIMESTAMP - INTERVAL '30' DAY, CURRENT_TIMESTAMP - INTERVAL '2' DAY),
(2,  'The Last Spellweaver', 'In a town where magic has gone quiet, a girl finds her grandmother''s spellbook, and the Council that banned magic finds out.', 1, TRUE, TRUE, 1250, CURRENT_TIMESTAMP - INTERVAL '28' DAY, CURRENT_TIMESTAMP - INTERVAL '3' DAY),
(3,  'Stars Beyond the Veil', 'Alone on the night shift of a deep-space research vessel, a crew member picks up a signal that is not a greeting.', 2, TRUE, TRUE, 980,  CURRENT_TIMESTAMP - INTERVAL '25' DAY, CURRENT_TIMESTAMP - INTERVAL '5' DAY),
(4,  'The Infinite Library', 'A librarian finds a book that contains every story ever written, and some that are still being written.', 2, TRUE, TRUE, 3600, CURRENT_TIMESTAMP - INTERVAL '22' DAY, CURRENT_TIMESTAMP - INTERVAL '6' DAY),
(5,  'The Garden of Memories', 'She can walk through other people''s memories in their dreams. Each visit, she brings something back.', 4, TRUE, TRUE, 520,  CURRENT_TIMESTAMP - INTERVAL '20' DAY, CURRENT_TIMESTAMP - INTERVAL '20' DAY),
(6,  'The Clockwork Heart', 'A young inventor builds a mechanical heart that saves lives. Then the recipients start hearing whispers.', 5, TRUE, TRUE, 380,  CURRENT_TIMESTAMP - INTERVAL '18' DAY, CURRENT_TIMESTAMP - INTERVAL '18' DAY),
(7,  'The Quantum Thief', 'A master thief in a world where memories are traded must steal back his own.', 1, TRUE, TRUE, 2500, CURRENT_TIMESTAMP - INTERVAL '15' DAY, CURRENT_TIMESTAMP - INTERVAL '15' DAY),
(8,  'Echoes of the Forgotten', 'An archaeologist uncovers a city in the Amazon that should not exist.', 2, TRUE, TRUE, 3200, CURRENT_TIMESTAMP - INTERVAL '12' DAY, CURRENT_TIMESTAMP - INTERVAL '12' DAY),
(9,  'The Last Dragon''s Song', 'In a world where dragons are extinct, a young scholar finds the last egg.', 3, TRUE, TRUE, 4100, CURRENT_TIMESTAMP - INTERVAL '9' DAY, CURRENT_TIMESTAMP - INTERVAL '9' DAY),
(10, 'The Time Traveler''s Daughter', 'Her father has been jumping through time to protect her future. Now she has his journal.', 4, TRUE, TRUE, 4200, CURRENT_TIMESTAMP - INTERVAL '6' DAY, CURRENT_TIMESTAMP - INTERVAL '6' DAY);

INSERT INTO story_tags (story_id, tag) VALUES
(1, 'horror'), (1, 'mystery'), (1, 'thriller'),
(2, 'fantasy'), (2, 'magic'), (2, 'coming-of-age'),
(3, 'sci-fi'), (3, 'space'), (3, 'first-contact'),
(4, 'fantasy'), (4, 'magical-realism'), (4, 'books'),
(5, 'fantasy'), (5, 'drama'), (5, 'memory'),
(6, 'steampunk'), (6, 'sci-fi'), (6, 'mystery'),
(7, 'sci-fi'), (7, 'heist'), (7, 'memory'),
(8, 'adventure'), (8, 'mystery'), (8, 'lost-worlds'),
(9, 'fantasy'), (9, 'adventure'), (9, 'dragons'),
(10, 'sci-fi'), (10, 'time-travel'), (10, 'family');

-- Whispers in the Dark: three paths from the journal, two more from the lamp room.
INSERT INTO chapters (id, story_id, parent_id, author_id, title, choice_label, depth, views, created_at, updated_at, content) VALUES
(1, 1, NULL, 3, 'The Keeper''s Journal', NULL, 0, 690, CURRENT_TIMESTAMP - INTERVAL '30' DAY, CURRENT_TIMESTAMP - INTERVAL '30' DAY,
'The first disappearance was written off as a tragic accident. The second, a coincidence. By the third, the town of Blackwater Cove was in a state of panic.

As the local detective, I was determined to find the truth. The victims had nothing in common: different ages, backgrounds, and lifestyles. The only connection was that they all vanished during the full moon.

The townspeople whispered about the old lighthouse, abandoned for decades. They said you could hear strange sounds coming from it at night. I dismissed it as superstition until I found the journal of the last lighthouse keeper.

His final entry spoke of something in the water, something that called to him in his dreams. Now I''m beginning to hear those same whispers, and I''m not sure if I''m still investigating the disappearances or if I''m becoming the next victim.'),

(2, 1, 1, 3, 'The Lamp Room', 'Go to the lighthouse on the next full moon', 1, 340, CURRENT_TIMESTAMP - INTERVAL '27' DAY, CURRENT_TIMESTAMP - INTERVAL '27' DAY,
'I waited eleven days. I told myself it was procedure, that I needed the tide tables and a second flashlight and someone at the station who knew where I''d gone. The truth is I was afraid, and fear is patient when it has a date to look forward to.

The moon came up fat and orange over the breakwater. I took the causeway on foot because the car would have been heard. Halfway across, the wind dropped completely, the way it does in the minute before a storm, except there was no storm. There was only the lighthouse, white as a bone, and the sound.

It isn''t a voice. I want to be precise about that, for whoever reads this. It is closer to the noise a wet finger makes around the rim of a glass. It rose and fell with the swell, and it came from above me.

The door at the base had been padlocked by the county in 1987. The padlock was on the ground, unbroken, still locked.

I climbed. One hundred and twelve steps; the journal said so and the journal was right. At the top, the lamp room glass was fogged from the inside, and someone had written in the fog with a fingertip, in a hand I recognized from the journal''s last page:

YOU CAME BACK.

I had never been there before in my life.'),

(3, 1, 1, 4, 'Ash', 'Burn the journal and leave the lighthouse alone', 1, 150, CURRENT_TIMESTAMP - INTERVAL '21' DAY, CURRENT_TIMESTAMP - INTERVAL '21' DAY,
'I burned it in the station''s parking lot, in a coffee can, at two in the morning. The pages went up faster than paper should, curling into black petals that drifted toward the sea even though the wind was blowing inland.

I slept for the first time in a week.

For nine days, nothing happened. Nobody vanished. The whispers stopped, or I stopped hearing them. I wrote up the three disappearances as unresolved and felt the particular shame of a detective who has chosen not to know.

On the tenth day my daughter came home from school with a drawing. Crayon on construction paper: a white tower, a yellow moon, and a man standing at the top with his arms out.

"Who''s that?" I asked.

"The keeper," she said, as if everyone knew. "He says you have something of his."

I told her I didn''t. She shook her head, patient with me the way children are with adults who are being slow.

"Not the book," she said. "He says the book was just a copy. He means what you read."

Some things, it turns out, don''t burn. They were never on the paper to begin with.'),

(4, 1, 1, 5, 'Marguerite', 'Find the keeper''s daughter', 1, 120, CURRENT_TIMESTAMP - INTERVAL '16' DAY, CURRENT_TIMESTAMP - INTERVAL '16' DAY,
'The keeper''s name was Elias Voss, and the parish register said he had a daughter, Marguerite, born 1961. No death record. No marriage. She simply stops appearing in the town''s paperwork in the spring of 1979.

It took me four days and one favor I will be paying back for years to find her. She lives in a care home two hours inland, in a room that faces away from the coast. The nurse told me she had asked for that specifically.

She was sharper than I expected. She looked at the photocopy of her father''s last entry for a long time, and then she folded it in half and handed it back without reading it twice.

"He wasn''t mad," she said. "Everyone decided he was mad because it was easier. He was tired. You can only keep a thing out for so long before it learns your name."

"What is it?"

She laughed at that, not unkindly. "Detective. You''re asking the wrong question. Everyone always asks what. Ask what it wants."

"What does it want?"

"The same thing it wanted from my father," Marguerite said. "A keeper."

Then she asked me, very politely, to leave, and to please not come back during a full moon.'),

(5, 1, 2, 2, 'What the Water Wants', 'Follow the sound down the stairs', 2, 95, CURRENT_TIMESTAMP - INTERVAL '12' DAY, CURRENT_TIMESTAMP - INTERVAL '12' DAY,
'The stairs kept going. I know how that sounds.

Below the base of the tower, where there should have been rock and nothing else, the spiral carried on down, iron treads slick with something that wasn''t seawater. It was warmer than seawater. My flashlight turned it the color of weak tea.

I counted the steps because counting was the only thing I still trusted. At two hundred I stopped, because the number had started to feel like it belonged to someone else.

The stairwell opened into a chamber the size of a church. The floor was water, black and perfectly still, and in it I could see the lighthouse reflected, right side up, as if the real one were down there and I was the reflection.

At the edge of the water stood the missing. All three of them. Tom Ashby, still in his fishing jacket. The Keller girl, barefoot. Old Mrs. Duarte with her rosary wrapped twice around her wrist. They faced the water with their backs to me, and they were humming.

When I said Tom''s name, they all turned at once, and every one of them had my face.'),

(6, 1, 2, 3, 'Signal', 'Light the lamp', 2, 130, CURRENT_TIMESTAMP - INTERVAL '8' DAY, CURRENT_TIMESTAMP - INTERVAL '8' DAY,
'The lamp hadn''t burned since the automation contract lapsed, but the mechanism was clean. Oiled, even. Someone had been keeping it ready.

I found the switch by feel. For a long second nothing happened, and I was almost relieved. Then the great lens began to turn, slow as a held breath, and light went out across Blackwater Cove for the first time in thirty-six years.

The humming stopped.

Out on the water, maybe half a mile off the point, something answered. Not a light exactly. A place where the dark was darker, and moving, and moving toward the beam.

The keeper had not been luring anything in, I understood then. He had been keeping it out. The lamp was never a warning to ships. It was a fence.

And the county had switched it off in 1987, the same year the first child went missing. That fact appears in no report I have ever filed, because until tonight I had never thought to put the two dates side by side.

I sat down on the iron floor with my back against the lamp housing, and I kept it turning until dawn.');

-- The Last Spellweaver
INSERT INTO chapters (id, story_id, parent_id, author_id, title, choice_label, depth, views, created_at, updated_at, content) VALUES
(7, 2, NULL, 1, 'The Spellbook', NULL, 0, 1100, CURRENT_TIMESTAMP - INTERVAL '28' DAY, CURRENT_TIMESTAMP - INTERVAL '28' DAY,
'In the quiet town of Eldermere, magic was once as common as the morning dew. Now it was a forgotten art, whispered about by the elderly. That was until I found the old spellbook in my grandmother''s attic.

The leather-bound tome was covered in dust, its pages yellowed with age. As I opened it, a strange warmth spread through my fingers. The symbols on the pages began to glow, and I felt a power I had never known before.

That night, I cast my first spell. A simple light spell, but it changed everything. Some of the townspeople were amazed. Not everyone was pleased. The Council of Elders, who had long since banned magic, saw me as a threat.

Now I must learn to control my powers while hiding from those who would see magic disappear forever. But the more I learn, the more I realize that the fate of magic itself might rest in my hands.'),

(8, 2, 7, 1, 'The Council of Elders', 'Go to the Council before they come for you', 1, 480, CURRENT_TIMESTAMP - INTERVAL '24' DAY, CURRENT_TIMESTAMP - INTERVAL '24' DAY,
'The Council met in the old granary, because nobody had built anything grander in Eldermere since the magic went out of it. Seven chairs. Seven elders. I had known all of them my whole life. Mrs. Pell had taught me my letters.

I brought the book. My grandmother always said the only way to walk into a trap is on purpose.

"You''ve been lighting candles," said Elder Marsh, "without matches."

"Once," I said. "Maybe twice."

Nobody laughed. Mrs. Pell wouldn''t look at me.

Marsh explained, in the patient voice of a man who has rehearsed, that magic had not faded from Eldermere. It had been put away. Deliberately, by the grandparents of everyone in that room, after the Burning Year, when the last spellweavers nearly took the valley apart arguing over who should hold the power.

"We are not your enemies," he said. "We are the people who remember why."

Then he held out his hand for the book, and I realized that every one of the seven was wearing my grandmother''s ring.'),

(9, 2, 7, 2, 'The North Road', 'Run tonight, and take the book', 1, 390, CURRENT_TIMESTAMP - INTERVAL '19' DAY, CURRENT_TIMESTAMP - INTERVAL '19' DAY,
'I packed the way you pack when you''re sixteen and certain: the book, bread, a knife I didn''t know how to use, and my grandmother''s shawl, which smelled of lavender and pipe smoke.

The north road out of Eldermere runs along the river for three miles before it climbs into the pines. I had walked it a hundred times. That night it felt new, as if the road had been waiting for me to take it seriously.

At the first milestone, the book grew warm against my back.

At the second, the trees on either side began to lean in. Not threatening, just attentive, the way a crowd leans toward a stage.

At the third, a woman was sitting on the stone, eating an apple. She was perhaps seventy, with a walking stick across her knees and boots worn through at the toe.

"Took you long enough," she said. "Your grandmother said you''d come on a Tuesday. I had money on Thursday."

She stood, brushed off her skirt, and started walking north without checking whether I followed.'),

(10, 2, 8, 3, 'The Eighth Ring', 'Refuse to hand over the book', 2, 210, CURRENT_TIMESTAMP - INTERVAL '10' DAY, CURRENT_TIMESTAMP - INTERVAL '10' DAY,
'I didn''t decide to do it. My hands decided and told me afterward.

I put the book behind my back, and every lamp in the granary went out at once, and in the dark I could see the rings. Seven small silver lights, pulsing like heartbeats, and one more, very faint, on my own finger, where there had never been a ring before.

"She gave it to you," Mrs. Pell whispered. She sounded frightened for me, not of me. "Oh, child. She gave you the eighth."

Marsh''s voice came out of the dark, and it had lost its patience. "Then she''s bound to the Council whether she likes it or not."

"No," said Mrs. Pell. "The eighth doesn''t bind. The eighth breaks."

I didn''t know what that meant. I don''t think Marsh did either, not really, because he took one step toward me, and seven rings flared, and then there were only six.');

-- Stars Beyond the Veil
INSERT INTO chapters (id, story_id, parent_id, author_id, title, choice_label, depth, views, created_at, updated_at, content) VALUES
(11, 3, NULL, 2, 'Night Shift', NULL, 0, 900, CURRENT_TIMESTAMP - INTERVAL '25' DAY, CURRENT_TIMESTAMP - INTERVAL '25' DAY,
'The signal came in the middle of the night shift. I was alone in the observation deck of the Stellar Horizon, our deep-space research vessel, when the computer flagged an anomaly.

At first I thought it was interference from a nearby pulsar. But the pattern was too regular, too intentional. As I analyzed the data, my heart rate climbed. This wasn''t just a signal. It was a message.

The implications were staggering. If this was a message from an intelligent species, it would be the first confirmed contact with extraterrestrial life. But the deeper I went into the signal''s structure, the clearer it became that it wasn''t a greeting.

It was a warning. And whatever it was warning us about, it was coming fast.'),

(12, 3, 11, 2, 'Captain Oyelaran', 'Wake the captain', 1, 410, CURRENT_TIMESTAMP - INTERVAL '20' DAY, CURRENT_TIMESTAMP - INTERVAL '20' DAY,
'Captain Oyelaran slept in her uniform, which tells you most of what you need to know about her.

She listened to the signal twice through, standing, her coffee going cold in her hand. Then she asked me to play it a third time at half speed, and I watched her face do something I had never seen it do in two years aboard the Horizon. It went still.

"Who else has heard this?"

"No one. It came in forty minutes ago."

"Good." She set the coffee down. "Log it as pulsar interference. Wipe the raw capture."

I thought I had misheard. She repeated it, word for word.

"Captain, it''s a warning. You can hear the structure. It''s counting down."

"I know what it is," she said. "I heard it the first time eleven years ago, on the Meridian, and I watched my commanding officer report it to Earth." She picked the coffee up again and drank it cold. "Earth sent back new orders. The Meridian was one of the ships that didn''t come home."'),

(13, 3, 11, 1, 'Reply', 'Answer the signal yourself', 1, 360, CURRENT_TIMESTAMP - INTERVAL '14' DAY, CURRENT_TIMESTAMP - INTERVAL '14' DAY,
'Protocol says first contact is a decision for governments, committees, people with titles. Protocol was written by people who had never been alone on a night shift with the universe knocking.

I didn''t have anything clever to send. I sent the signal back to them, exactly as I''d received it, the way you repeat someone''s words to show you were listening.

Four hours and six minutes passed. I spent them imagining my court-martial.

The reply, when it came, was short, and it wasn''t in their pattern anymore. It was in ours. Plain binary, clumsy, like someone writing in a language they had only just learned from the back of a cereal box.

It said: YOU ARE AWAKE.

And then, a second later, as if they''d thought better of it and wanted to be kind:

WE ARE SORRY. WE HOPED NO ONE WAS.');

-- The Infinite Library
INSERT INTO chapters (id, story_id, parent_id, author_id, title, choice_label, depth, views, created_at, updated_at, content) VALUES
(14, 4, NULL, 2, 'The Book of Every Story', NULL, 0, 3100, CURRENT_TIMESTAMP - INTERVAL '22' DAY, CURRENT_TIMESTAMP - INTERVAL '22' DAY,
'When James Halloran found the book, it was shelved under the wrong call number, which in thirty years at the Aldgate Public Library had never once happened to him.

It had no title on the spine. Inside, the first page began a story he knew, a fairy tale his mother used to tell. The second page began one he didn''t. By the tenth he understood that the book did not end, that the pages simply kept arriving under his thumb, each one another story, each one complete.

He thought he had found the ultimate literary treasure. He took it home under his coat, which was the first rule he had broken in his life.

But the deeper he read, the more he noticed that some of the stories were not finished. Some of them were still being written. And one of them, he was fairly sure, was about a librarian who had taken a book home under his coat.'),

(15, 4, 14, 4, 'Index', 'Look yourself up in the index', 1, 520, CURRENT_TIMESTAMP - INTERVAL '11' DAY, CURRENT_TIMESTAMP - INTERVAL '11' DAY,
'Every book has an index, and the infinite one was no exception. It took up the final third of the volume and it was, of course, infinite, but it was alphabetical, and James was a librarian.

He found HALLORAN, JAMES between HALLORAN, IRIS (who had drowned in a story he''d never read) and HALLORAN, JAMES (a different one, a sailor, 1812).

There were eleven thousand page references after his name.

He turned to the first. It was his birth, described with an accuracy that made him put the book down and walk twice around the reading room. He turned to the last. The page was blank except for a single line at the top, in a hand that wasn''t printed:

He closes the book here, or he doesn''t.

James looked at that sentence for a long time. Then, carefully, with the pencil he kept behind his ear for marginalia, he wrote underneath it: He doesn''t.

The graphite was already ink by the time he lifted the pencil.');

-- Single-chapter stories, waiting for someone to branch them.
INSERT INTO chapters (id, story_id, parent_id, author_id, title, choice_label, depth, views, created_at, updated_at, content) VALUES
(16, 5, NULL, 4, 'Grandmother''s Garden', NULL, 0, 480, CURRENT_TIMESTAMP - INTERVAL '20' DAY, CURRENT_TIMESTAMP - INTERVAL '20' DAY,
'The first time it happened, I thought it was just a vivid dream. I was in my grandmother''s garden, but it wasn''t the overgrown mess it had become. It was vibrant and alive, exactly as she had described it in her stories.

Then I saw her, younger than I had ever known her, tending to the roses. She looked up and smiled, and I realized this wasn''t my dream at all. I was in her memory.

As I learned to control it, I began helping people face the things they couldn''t look at alone. But each time I entered someone''s memory, I brought a piece of it back with me. Their joys, their sorrows, their fears. They all became part of me.

Now I have to decide whether the good I''m doing is worth what it costs. Because some memories are better left where they are.'),

(17, 6, NULL, 5, 'The First Transplant', NULL, 0, 350, CURRENT_TIMESTAMP - INTERVAL '18' DAY, CURRENT_TIMESTAMP - INTERVAL '18' DAY,
'The first successful transplant was a miracle. My mechanical heart, powered by a new kind of energy crystal, kept beating long after the patient''s own heart had failed.

The medical community was skeptical, but the results were undeniable. My invention could save thousands of lives. Then, as more people received clockwork hearts, strange reports began to surface.

Some recipients said they heard whispers in their dreams. Others developed an uncanny knack for predicting mechanical failures. And then there were the disappearances: patients who vanished without a trace, leaving behind only their still-beating hearts.

Now I have to find out what I have really made, and whether anyone should be paying this price for a longer life.'),

(18, 7, NULL, 1, 'Memory, Stolen', NULL, 0, 2300, CURRENT_TIMESTAMP - INTERVAL '15' DAY, CURRENT_TIMESTAMP - INTERVAL '15' DAY,
'In a city where memories are stored in glass and sold by the gram, the best thief alive woke up in a rented room with no idea who he was.

He knew how to pick a lock. He knew the weight of a memory vial in his palm, and which fence on Carrow Street paid fair. He did not know his own name, and when he looked in the mirror the face there felt like a coat someone had lent him.

On the nightstand was a card with an address and a single line: Your past is in a vault on the ninety-first floor. Steal it back before they sell it.

The handwriting was his. He was almost sure.'),

(19, 8, NULL, 2, 'The Impossible City', NULL, 0, 2950, CURRENT_TIMESTAMP - INTERVAL '12' DAY, CURRENT_TIMESTAMP - INTERVAL '12' DAY,
'Dr. Sarah Chen found the artifact on the fourth day of the survey: a disc of dark stone, no bigger than her palm, carved so finely that the lines only showed when the light moved.

The carbon dating came back at nineteen thousand years. The carving, according to the lab, had been done with a tool that should not have existed for another eighteen thousand.

She followed the river the disc had come from. On the ninth day the canopy opened onto terraces, and walls, and a road wide enough for six people to walk abreast, running straight into the green as if it had somewhere urgent to be.

Nobody had built this. Everything she knew about history said so. And yet here it was, waiting, and someone had swept the road.'),

(20, 9, NULL, 3, 'The Egg in the Temple', NULL, 0, 3800, CURRENT_TIMESTAMP - INTERVAL '9' DAY, CURRENT_TIMESTAMP - INTERVAL '9' DAY,
'The last dragon died four hundred years before Maya was born, and every schoolchild could tell you how: the Long Hunt, the burning of the eyries, the king who wore the final heart on a chain.

So when she brushed the dust from the altar stone in the ruined temple at Ossery and found the egg, she did not believe it. It was the size of a bread loaf and the color of banked coals, and it was warm.

She put her ear to it because she didn''t know what else to do.

Something inside was humming. Not a song, not yet. More like someone learning the first note of one.'),

(21, 10, NULL, 4, 'Father''s Journal', NULL, 0, 3900, CURRENT_TIMESTAMP - INTERVAL '6' DAY, CURRENT_TIMESTAMP - INTERVAL '6' DAY,
'My father kept his journal in a biscuit tin under the stairs, and I only found it because the tin rattled when it shouldn''t have.

The first entry was dated forty years before I was born. The last was dated next Thursday.

In between, in his small square handwriting, were hundreds of trips. Not holidays. Jumps. Each one a date, a place, and a single line about what he''d changed. Moved the car keys. Missed the train on purpose. Told her mother to take the umbrella.

Her mother. My mother. Every entry, I realized, was about me.

The Thursday entry was only three words long, and it was the only one he had crossed out.');

INSERT INTO comments (story_id, author_id, content, created_at, updated_at) VALUES
(1, 2, 'I couldn''t sleep after reading this. The padlock detail in The Lamp Room is going to stay with me.', CURRENT_TIMESTAMP - INTERVAL '9' DAY, CURRENT_TIMESTAMP - INTERVAL '9' DAY),
(1, 4, 'I wrote Ash because I wanted to know what happens if you refuse the call. Turns out it doesn''t take no for an answer.', CURRENT_TIMESTAMP - INTERVAL '8' DAY, CURRENT_TIMESTAMP - INTERVAL '8' DAY),
(1, 5, 'Three branches off one journal and they all feel like the same town. Great work everyone.', CURRENT_TIMESTAMP - INTERVAL '5' DAY, CURRENT_TIMESTAMP - INTERVAL '5' DAY),
(2, 3, 'The magic system is so well thought out. I had to write what happens if she says no to Marsh.', CURRENT_TIMESTAMP - INTERVAL '10' DAY, CURRENT_TIMESTAMP - INTERVAL '10' DAY),
(2, 4, 'The old woman on the milestone is my favorite character on this whole site.', CURRENT_TIMESTAMP - INTERVAL '7' DAY, CURRENT_TIMESTAMP - INTERVAL '7' DAY),
(3, 1, 'This reminds me of classic sci-fi but with a fresh perspective. That last line of Reply got me.', CURRENT_TIMESTAMP - INTERVAL '13' DAY, CURRENT_TIMESTAMP - INTERVAL '13' DAY),
(3, 3, 'Captain Oyelaran drinking the cold coffee. Perfect.', CURRENT_TIMESTAMP - INTERVAL '12' DAY, CURRENT_TIMESTAMP - INTERVAL '12' DAY),
(4, 1, 'The index idea is brilliant. Somebody please branch from there.', CURRENT_TIMESTAMP - INTERVAL '6' DAY, CURRENT_TIMESTAMP - INTERVAL '6' DAY),
(5, 1, 'This concept is so unique. The idea that she keeps pieces of what she sees is heartbreaking.', CURRENT_TIMESTAMP - INTERVAL '4' DAY, CURRENT_TIMESTAMP - INTERVAL '4' DAY),
(9, 2, 'Someone learning the first note of a song. What a way to end an opening.', CURRENT_TIMESTAMP - INTERVAL '3' DAY, CURRENT_TIMESTAMP - INTERVAL '3' DAY),
(10, 3, 'I need to know what the three crossed-out words were.', CURRENT_TIMESTAMP - INTERVAL '2' DAY, CURRENT_TIMESTAMP - INTERVAL '2' DAY);

INSERT INTO likes (user_id, story_id, created_at) VALUES
(1, 1, CURRENT_TIMESTAMP - INTERVAL '9' DAY), (2, 1, CURRENT_TIMESTAMP - INTERVAL '9' DAY), (4, 1, CURRENT_TIMESTAMP - INTERVAL '8' DAY), (5, 1, CURRENT_TIMESTAMP - INTERVAL '5' DAY),
(2, 2, CURRENT_TIMESTAMP - INTERVAL '19' DAY), (3, 2, CURRENT_TIMESTAMP - INTERVAL '10' DAY), (4, 2, CURRENT_TIMESTAMP - INTERVAL '7' DAY),
(1, 3, CURRENT_TIMESTAMP - INTERVAL '13' DAY), (3, 3, CURRENT_TIMESTAMP - INTERVAL '12' DAY), (5, 3, CURRENT_TIMESTAMP - INTERVAL '11' DAY),
(1, 4, CURRENT_TIMESTAMP - INTERVAL '6' DAY), (3, 4, CURRENT_TIMESTAMP - INTERVAL '6' DAY), (4, 4, CURRENT_TIMESTAMP - INTERVAL '6' DAY), (5, 4, CURRENT_TIMESTAMP - INTERVAL '5' DAY),
(1, 5, CURRENT_TIMESTAMP - INTERVAL '4' DAY), (2, 5, CURRENT_TIMESTAMP - INTERVAL '3' DAY),
(2, 6, CURRENT_TIMESTAMP - INTERVAL '2' DAY),
(2, 7, CURRENT_TIMESTAMP - INTERVAL '10' DAY), (3, 7, CURRENT_TIMESTAMP - INTERVAL '9' DAY),
(1, 8, CURRENT_TIMESTAMP - INTERVAL '8' DAY), (4, 8, CURRENT_TIMESTAMP - INTERVAL '6' DAY), (5, 8, CURRENT_TIMESTAMP - INTERVAL '5' DAY),
(1, 9, CURRENT_TIMESTAMP - INTERVAL '4' DAY), (2, 9, CURRENT_TIMESTAMP - INTERVAL '3' DAY), (4, 9, CURRENT_TIMESTAMP - INTERVAL '3' DAY), (5, 9, CURRENT_TIMESTAMP - INTERVAL '2' DAY),
(1, 10, CURRENT_TIMESTAMP - INTERVAL '2' DAY), (2, 10, CURRENT_TIMESTAMP - INTERVAL '2' DAY), (3, 10, CURRENT_TIMESTAMP - INTERVAL '1' DAY), (5, 10, CURRENT_TIMESTAMP - INTERVAL '1' DAY);

-- This file may be checked out with CRLF line endings; stored text always uses \n.
UPDATE chapters SET content = REPLACE(content, CHR(13), '');

UPDATE stories SET
    chapter_count = (SELECT COUNT(*) FROM chapters c WHERE c.story_id = stories.id),
    like_count = (SELECT COUNT(*) FROM likes l WHERE l.story_id = stories.id);

ALTER TABLE users ALTER COLUMN id RESTART WITH 100;
ALTER TABLE stories ALTER COLUMN id RESTART WITH 100;
ALTER TABLE chapters ALTER COLUMN id RESTART WITH 100;
ALTER TABLE comments ALTER COLUMN id RESTART WITH 100;
