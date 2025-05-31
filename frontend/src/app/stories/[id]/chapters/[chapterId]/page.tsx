"use client";

import Link from "next/link";
import { useState } from "react";

interface ChapterPageProps {
  params: {
    id: string;
    chapterId: string;
  };
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<"light" | "dark" | "sepia">("light");

  // Mock chapter data - replace with actual API call
  const chapter = {
    id: params.chapterId,
    title: "Chapter 1: The Discovery",
    content: `The ancient tome lay forgotten in the dusty corner of the library. Its leather binding was worn and cracked, the gold leaf of its title long since faded. Yet something about it called to me, drawing me closer with each step.

I reached out, my fingers trembling as they brushed against the spine. A spark of energy crackled between my skin and the book, sending a shiver down my spine. This was no ordinary book - this was something special.

Carefully, I pulled it from the shelf, the weight of centuries settling into my palms. The moment I opened it, a soft blue light emanated from its pages, illuminating the dark corner of the library.

"Impossible," I whispered, my voice barely audible over the pounding of my heart.

The pages were filled with strange symbols that seemed to shift and change as I watched. They weren't just words - they were spells. Ancient, powerful magic that had been lost to time.

I had found it. The legendary Book of Spells, said to contain the knowledge of the last great spellweavers. The ones who had maintained the balance of magic in our world before the Great Fade.

But why had it chosen me? I was just a simple librarian's assistant, with no magical ability to speak of. Or so I had thought.

As I continued to read, the symbols began to make sense. They weren't just spells - they were instructions. A guide to awakening the dormant magic within those who had the potential to wield it.

And somehow, I knew that I was one of them.

The realization hit me like a physical blow. My life was about to change forever. I had discovered something that could change the fate of our world, and I was the only one who knew about it.

But with great power comes great responsibility, and I wasn't sure if I was ready for what lay ahead. The last spellweavers had disappeared for a reason, and whatever had caused them to vanish might still be out there, waiting.

I closed the book, the blue light fading back into its pages. I needed time to think, to plan my next move. But one thing was certain - I couldn't let this discovery fall into the wrong hands.

The Book of Spells had chosen me for a reason, and I would do whatever it took to protect its secrets and learn its magic. Even if it meant facing dangers I couldn't yet imagine.

The journey of the last spellweaver was about to begin.`,
    date: "2024-03-15",
    reads: "500K",
    votes: "25K",
    nextChapter: 2,
    prevChapter: null,
  };

  const themeClasses = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-900 text-gray-100",
    sepia: "bg-amber-50 text-gray-900",
  };

  return (
    <div className={`min-h-screen ${themeClasses[theme]}`}>
      {/* Reading Controls */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href={`/stories/${params.id}`}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              ← Back to Story
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                A+
              </button>
              <select
                value={theme}
                onChange={(e) =>
                  setTheme(e.target.value as "light" | "dark" | "sepia")
                }
                className="p-2 bg-transparent border rounded"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <h1 className="text-3xl font-bold mb-8">{chapter.title}</h1>
        <div
          className="prose dark:prose-invert max-w-none"
          style={{ fontSize: `${fontSize}px` }}
        >
          {chapter.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Chapter Navigation */}
        <div className="flex justify-between mt-12 pt-6 border-t">
          {chapter.prevChapter ? (
            <Link
              href={`/stories/${params.id}/chapters/${chapter.prevChapter}`}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              ← Previous Chapter
            </Link>
          ) : (
            <div></div>
          )}
          {chapter.nextChapter ? (
            <Link
              href={`/stories/${params.id}/chapters/${chapter.nextChapter}`}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              Next Chapter →
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Chapter Stats */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-500">
          <div>👁️ {chapter.reads} reads</div>
          <div>⭐ {chapter.votes} votes</div>
          <div>📅 {chapter.date}</div>
        </div>
      </div>
    </div>
  );
}
