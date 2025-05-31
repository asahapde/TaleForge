"use client";

import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Story {
  id: number;
  title: string;
  description: string;
  content: string;
  author: {
    id: number;
    username: string;
    displayName: string;
  };
  published: boolean;
  views: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface PageResponse {
  content: Story[];
  totalElements: number;
  totalPages: number;
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
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      fetchStories();
    }
  }, [sortBy, filterTag, page, authLoading]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get<PageResponse>("/api/stories", {
        params: {
          sort: sortBy,
          tag: filterTag || undefined,
          page,
          size: 9,
        },
      });
      setStories(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      console.error("Error fetching stories:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch stories"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Stories</h1>
            {user && (
              <Link
                href="/stories/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Story
              </Link>
            )}
          </div>

          <div className="flex space-x-4 mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>

            <input
              type="text"
              placeholder="Filter by tag..."
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No stories found.</p>
              {user && (
                <Link
                  href="/stories/create"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create your first story
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {story.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                        {story.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">
                            By{" "}
                            {story.author.displayName || story.author.username}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {story.views} views
                          </span>
                          <span className="text-sm text-gray-500">
                            ★ {story.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {story.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 0}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          page === i
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages - 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
