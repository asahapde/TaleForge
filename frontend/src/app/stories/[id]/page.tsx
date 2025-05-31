"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Story {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function StoryView() {
  const params = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        // TODO: Replace with actual API call when implemented
        // For now, we'll fetch from our in-memory API
        const response = await fetch("/api/stories");
        if (!response.ok) {
          throw new Error("Failed to fetch story");
        }
        const stories = await response.json();
        const foundStory = stories.find((s: Story) => s.id === params.id);
        if (!foundStory) {
          throw new Error("Story not found");
        }
        setStory(foundStory);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load story");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error || "Story not found"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {story.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {story.description}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Created on {new Date(story.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
