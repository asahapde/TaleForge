"use client";

import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  likes: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function MyStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingStoryId, setDeletingStoryId] = useState<number | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      fetchMyStories();
    }
  }, [user, authLoading]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openDropdown !== null &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const fetchMyStories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/stories/me`);
      setStories(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch stories"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (storyId: number) => {
    try {
      setError("");
      setSuccess("");
      await api.post(`/stories/${storyId}/publish`);
      setSuccess("Story published successfully!");
      fetchMyStories(); // Refresh the list
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to publish story"
      );
    }
  };

  const handleUnpublish = async (storyId: number) => {
    try {
      setError("");
      setSuccess("");
      await api.post(`/stories/${storyId}/unpublish`);
      setSuccess("Story unpublished successfully!");
      fetchMyStories(); // Refresh the list
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to unpublish story"
      );
    }
  };

  const handleDelete = async (storyId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setDeletingStoryId(storyId);
      await api.delete(`/stories/${storyId}`);
      setSuccess("Story deleted successfully!");
      fetchMyStories(); // Refresh the list
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to delete story"
      );
    } finally {
      setDeletingStoryId(null);
    }
  };

  const handleSearch = () => {
    // Implement search functionality
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-semibold text-gray-900">My Stories</h1>
        </div>

        {/* Search and filter bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Search by title, description, or tags..."
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
          <div className="relative">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="appearance-none rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-3 pr-8 py-2 bg-white text-sm cursor-pointer"
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
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium shadow-sm hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 ml-2 cursor-pointer"
            aria-label="Search"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded relative mb-3">
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

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded relative mb-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              You haven't created any stories yet.
            </p>
            <Link
              href="/stories/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create your first story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold line-clamp-1">
                        <Link
                          href={`/stories/${story.id}`}
                          className="text-gray-900 hover:text-indigo-600"
                        >
                          {story.title}
                        </Link>
                      </h2>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-md ${
                            story.published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {story.published ? "Published" : "Draft"}
                        </span>
                        <div className="relative">
                          <button
                            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
                            aria-label="Open actions menu"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (openDropdown === story.id) {
                                setOpenDropdown(null);
                              } else {
                                setOpenDropdown(story.id);
                              }
                            }}
                            aria-expanded={openDropdown === story.id}
                          >
                            <svg
                              className="h-5 w-5 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="6" r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="12" cy="18" r="1.5" />
                            </svg>
                          </button>
                          {openDropdown === story.id && (
                            <div
                              ref={(el) => {
                                dropdownRefs.current[story.id] = el;
                                return undefined;
                              }}
                              className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow z-10 py-1 flex flex-col gap-1"
                              role="menu"
                              aria-label="Story actions"
                            >
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                  router.push(`/stories/edit/${story.id}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition-all duration-150 cursor-pointer"
                                role="menuitem"
                                aria-label="Edit"
                              >
                                Edit
                              </button>
                              {story.published ? (
                                <button
                                  onClick={() => {
                                    handleUnpublish(story.id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-sm font-semibold text-yellow-700 hover:bg-yellow-50 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 transition-all duration-150 cursor-pointer"
                                  role="menuitem"
                                  aria-label="Unpublish"
                                >
                                  Unpublish
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    handlePublish(story.id);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-50 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 transition-all duration-150 cursor-pointer"
                                  role="menuitem"
                                  aria-label="Publish"
                                >
                                  Publish
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleDelete(story.id);
                                  setOpenDropdown(null);
                                }}
                                disabled={deletingStoryId === story.id}
                                className="w-full text-left px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 transition-all duration-150 cursor-pointer disabled:opacity-50"
                                role="menuitem"
                                aria-label={
                                  deletingStoryId === story.id
                                    ? "Deleting"
                                    : "Delete"
                                }
                              >
                                {deletingStoryId === story.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">
                      {story.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                    <div className="flex items-center gap-2 whitespace-nowrap">
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
        )}
      </div>
    </div>
  );
}
