"use client";

import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [stories, setStories] = useState<Story[]>([]);
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

  useEffect(() => {
    const tag = searchParams?.get("tag");
    if (tag) {
      setFilterTag(tag);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchStories();
  }, [sortBy, filterTag, page]);

  useEffect(() => {
    if (!stories) return;

    const filtered = stories.filter((story) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        story.title.toLowerCase().includes(searchLower) ||
        story.description.toLowerCase().includes(searchLower) ||
        story.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });
    setFilteredStories(filtered);
  }, [stories, searchQuery]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError("");

      let url = `/api/stories?page=${page}&size=10`;

      if (sortBy === "newest") {
        url += "&sort=createdAt,desc";
      } else if (sortBy === "oldest") {
        url += "&sort=createdAt,asc";
      } else if (sortBy === "rating") {
        url += "&sort=rating,desc";
      } else if (sortBy === "views") {
        url += "&sort=views,desc";
      }

      if (filterTag) {
        url += `&tag=${encodeURIComponent(filterTag)}`;
      }

      const response = await api.get<PageResponse>(url);
      setStories(response.data.content);
      setTotalPages(response.data.totalPages);
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
    setFilterTag(tag === filterTag ? "" : tag);
    setPage(0);
    router.push(tag === filterTag ? "/stories" : `/stories?tag=${tag}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
    fetchStories();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(0);
    fetchStories();
  };

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
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Stories</h1>
        {user && (
          <Link
            href="/stories/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create Story
          </Link>
        )}
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <div className="flex items-center">
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
                placeholder="Search stories by title or description..."
                className="w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 pr-4 py-2 text-base"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
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
              className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
          {searchQuery && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700">
                  Searching for: "{searchQuery}"
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="appearance-none rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-10 py-2 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
              <option value="views">Most Viewed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTagFilter("fantasy")}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                filterTag === "fantasy"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              #fantasy
            </button>
            <button
              onClick={() => handleTagFilter("adventure")}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                filterTag === "adventure"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              #adventure
            </button>
            <button
              onClick={() => handleTagFilter("mystery")}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                filterTag === "mystery"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              #mystery
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStories.map((story) => (
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
                      fill="none"
                      stroke="currentColor"
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
        <div className="text-center py-12">
          <p className="text-gray-500">No stories found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`px-4 py-2 rounded-md ${
              page === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className={`px-4 py-2 rounded-md ${
              page === totalPages - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
