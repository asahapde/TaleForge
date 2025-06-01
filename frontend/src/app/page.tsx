"use client";

import api from "@/config/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  { name: "Fantasy", icon: "✨" },
  { name: "Romance", icon: "❤️" },
  { name: "Mystery", icon: "🔍" },
  { name: "Sci-Fi", icon: "🚀" },
  { name: "Horror", icon: "👻" },
  { name: "Adventure", icon: "🗺️" },
];

const featuredStories = [
  {
    id: 1,
    title: "The Last Spellweaver",
    author: "Sarah Blackwood",
    cover: "/covers/story1.jpg",
    description:
      "In a world where magic is fading, one young woman discovers she holds the key to restoring it.",
    reads: "1.2M",
    votes: "45K",
  },
  // Add more stories here
];

interface Story {
  id: number;
  title: string;
  description: string;
  author: {
    id: number;
    username: string;
    displayName: string;
  };
  tags: string[];
  views: number;
  published: boolean;
}

interface TagCount {
  tag: string;
  count: number;
}

export default function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [tags, setTags] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchStoriesAndTags();
  }, []);

  const fetchStoriesAndTags = async () => {
    try {
      setLoading(true);
      setError("");
      const storiesRes = await api.get("/stories?size=100"); // Get more stories to filter
      // Filter published stories and sort by views
      const publishedStories = storiesRes.data.content
        .filter((story: Story) => story.published)
        .sort((a: Story, b: Story) => b.views - a.views)
        .slice(0, 6); // Take top 6 most viewed stories
      setStories(publishedStories);

      // Collect tags from filtered stories
      const tagCounts: Record<string, number> = {};
      publishedStories.forEach((story: Story) => {
        story.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      const sortedTags: TagCount[] = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
      setTags(sortedTags);
    } catch (err) {
      setError("Failed to load stories or tags");
    } finally {
      setLoading(false);
    }
  };

  // Remove categories and trending now sections
  // Add animated tags row
  const fakeTags = [
    { tag: "epic", count: 12 },
    { tag: "mystical", count: 8 },
    { tag: "space", count: 15 },
    { tag: "romance", count: 20 },
    { tag: "horror", count: 7 },
    { tag: "adventure", count: 18 },
    { tag: "legend", count: 10 },
    { tag: "future", count: 5 },
  ];
  const animatedTags = [...tags, ...fakeTags];

  // Split stories into two rows
  const row1 = stories.filter((_, i) => i % 2 === 0);
  const row2 = stories.filter((_, i) => i % 2 !== 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Discover Stories That Matter
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Join millions of readers and writers on TaleForge, where stories
              come to life.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/stories"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 hover:shadow-lg hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10"
                >
                  Start Reading
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/stories/create"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Start Writing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Tags Marquee */}
      <div
        className="w-full overflow-hidden py-6 bg-gradient-to-r from-indigo-50 to-pink-50"
        onMouseEnter={() => {
          const marquee = document.querySelector(".animate-marquee");
          if (marquee) marquee.classList.add("paused");
        }}
        onMouseLeave={() => {
          const marquee = document.querySelector(".animate-marquee");
          if (marquee) marquee.classList.remove("paused");
        }}
      >
        <div className="relative w-full">
          <div className="whitespace-nowrap animate-marquee flex gap-4 w-max">
            {Array(6)
              .fill(animatedTags)
              .flat()
              .map(({ tag, count }, i) => (
                <span
                  key={tag + i}
                  className="inline-block px-5 py-2 rounded-full text-sm font-semibold bg-white border border-indigo-50 text-indigo-700 shadow select-none"
                >
                  #{tag}{" "}
                  <span className="ml-1 text-xs text-gray-400">({count})</span>
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Featured Stories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Stories
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="masonry-grid">
            {stories.slice(0, 6).map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                      <Link
                        href={`/stories/${story.id}`}
                        className="text-gray-900 hover:text-indigo-600"
                      >
                        {story.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">
                      {story.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/stories?tag=${tag}`}
                        className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded hover:bg-indigo-200"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/profile/${story.author.username}`}
                        className="truncate block hover:text-indigo-600"
                      >
                        By {story.author.displayName || story.author.username}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap ml-4">
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {story.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start your story?</span>
            <span className="block text-indigo-200">Join TaleForge today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
