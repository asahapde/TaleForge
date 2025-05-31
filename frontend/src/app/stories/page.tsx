"use client";

import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Add styles to control body height
const styles = `
  body {
    height: fit-content;
    min-height: auto;
  }
`;

interface Story {
  id: number;
  title: string;
  description: string;
  author: {
    id: number;
    username: string;
    displayName: string;
  };
  published: boolean;
  views: number;
  likes: number;
  tags: string[];
  createdAt: string;
}

interface PageResponse {
  content: Story[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default function StoriesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterTag, setFilterTag] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [topTags, setTopTags] = useState<{ tag: string; count: number }[]>([]);
  const STORIES_PER_PAGE = 9;

  useEffect(() => {
    const tag = searchParams?.get("tag");
    if (tag) {
      setFilterTag(tag);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (!allStories) return;

    // Calculate tag frequencies
    const tagCounts = new Map<string, number>();
    allStories.forEach((story) => {
      story.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    // Convert to array and sort by count
    const sortedTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTopTags(sortedTags);

    let filtered = allStories.filter((story) => story.published);

    // Apply tag filter
    if (filterTag) {
      filtered = filtered.filter((story) =>
        story.tags.some((tag) => tag.toLowerCase() === filterTag.toLowerCase())
      );
    }

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(searchLower) ||
          story.description.toLowerCase().includes(searchLower) ||
          story.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          (story.author.displayName || story.author.username)
            .toLowerCase()
            .includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "likes":
          return b.likes - a.likes;
        case "views":
          return b.views - a.views;
        default:
          return 0;
      }
    });

    setFilteredStories(filtered);
    setTotalPages(Math.ceil(filtered.length / STORIES_PER_PAGE));
  }, [allStories, filterTag, searchQuery, sortBy]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get<PageResponse>(`/stories?size=1000`);
      setAllStories(response.data.content);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch stories"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  const handleTagFilter = (tag: string) => {
    const newTag = tag === filterTag ? "" : tag;
    setFilterTag(newTag);
    setPage(0);
    router.push(newTag ? `/stories?tag=${newTag}` : "/stories");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      // Convert to EST
      const estDate = new Date(
        date.toLocaleString("en-US", {
          timeZone: "America/New_York",
        })
      );

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      }).format(estDate);
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get current page of stories
  const currentPageStories = filteredStories.slice(
    page * STORIES_PER_PAGE,
    (page + 1) * STORIES_PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-semibold text-gray-900">Stories</h1>
          {user && (
            <Link
              href="/stories/create"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 shadow-sm hover:shadow"
            >
              Create Story
            </Link>
          )}
        </div>

        <div className="mb-3 space-y-3">
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <h2 className="text-base font-medium text-gray-900 mb-2">
              Popular Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {topTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    filterTag === tag
                      ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span>#{tag}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      filterTag === tag
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(e);
                    }
                  }}
                  placeholder="Search by title, description, tags, or author..."
                  className="w-full rounded-lg border-gray-200 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2 text-sm transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="h-4 w-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium shadow-sm hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 ml-2"
              >
                Search
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-8 py-2 bg-white text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="likes">Most Liked</option>
                  <option value="views">Most Viewed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 101.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPageStories.map((story) => (
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
                    <button
                      key={tag}
                      onClick={() => handleTagFilter(tag)}
                      className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded hover:bg-indigo-200"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                  <div className="flex-1 min-w-0">
                    <span className="truncate block">
                      By {story.author.displayName || story.author.username}
                    </span>
                    <span className="truncate block">
                      {formatDate(story.createdAt)}
                    </span>
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
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {story.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No stories found.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                page === 0
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow"
              }`}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                    page === i
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                page === totalPages - 1
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow"
              }`}
            >
              Next
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
