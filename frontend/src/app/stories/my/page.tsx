"use client";

import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      fetchMyStories();
    }
  }, [user, authLoading]);

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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Stories</h1>
            <Link
              href="/stories/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Story
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4">
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
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative mb-4">
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
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
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            story.published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {story.published ? "Published" : "Draft"}
                        </span>
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
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="flex space-x-2">
                        <Link
                          href={`/stories/edit/${story.id}`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </Link>
                      </div>
                      <div className="flex space-x-2">
                        {story.published ? (
                          <button
                            onClick={() => handleUnpublish(story.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(story.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(story.id)}
                          disabled={deletingStoryId === story.id}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          {deletingStoryId === story.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
