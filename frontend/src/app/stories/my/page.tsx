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
      const response = await api.get(`/api/stories/author/${user?.id}`);
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
      await api.post(`/api/stories/${storyId}/publish`);
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
      await api.post(`/api/stories/${storyId}/unpublish`);
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
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {story.title}
                      </h3>
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
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                      {story.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {story.views} views
                        </span>
                        <span className="text-sm text-gray-500">
                          ★ {story.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/stories/${story.id}`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() =>
                            story.published
                              ? handleUnpublish(story.id)
                              : handlePublish(story.id)
                          }
                          className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                            story.published
                              ? "text-red-700 bg-red-100 hover:bg-red-200"
                              : "text-green-700 bg-green-100 hover:bg-green-200"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            story.published
                              ? "focus:ring-red-500"
                              : "focus:ring-green-500"
                          }`}
                        >
                          {story.published ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {story.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
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
