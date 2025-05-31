"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Story {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
  views: number;
  rating: number;
  published: boolean;
  tags: string[];
  cover: string;
  reads: string;
  votes: string;
  parts: number;
  status: string;
  chapters: {
    id: number;
    title: string;
    content: string;
    date: string;
    reads: string;
    votes: string;
  }[];
}

interface StoryPageProps {
  params: {
    id: string;
  };
}

export default function StoryPage({ params }: StoryPageProps) {
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isVoted, setIsVoted] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch story");
        }
        const data = await response.json();
        setStory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load story");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this story?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/stories/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete story");
      }

      router.push("/stories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete story");
      setIsDeleting(false);
    }
  };

  const handlePublish = async () => {
    try {
      const response = await fetch(`/api/stories/${params.id}/publish`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to publish story");
      }

      const data = await response.json();
      setStory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish story");
    }
  };

  const handleUnpublish = async () => {
    try {
      const response = await fetch(`/api/stories/${params.id}/unpublish`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to unpublish story");
      }

      const data = await response.json();
      setStory(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to unpublish story"
      );
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Story Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={story.cover}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Story Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {story.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                by {story.author.username}
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-700 mb-6">{story.description}</p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
                <div>
                  <span className="font-medium">Status:</span> {story.status}
                </div>
                <div>
                  <span className="font-medium">Parts:</span> {story.parts}
                </div>
                <div>
                  <span className="font-medium">Reads:</span> {story.reads}
                </div>
                <div>
                  <span className="font-medium">Votes:</span> {story.votes}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 py-2 rounded-md ${
                    isFollowing
                      ? "bg-gray-200 text-gray-700"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  onClick={() => setIsVoted(!isVoted)}
                  className={`px-4 py-2 rounded-md ${
                    isVoted
                      ? "bg-gray-200 text-gray-700"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {isVoted ? "Voted" : "Vote"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2>
        <div className="space-y-4">
          {story.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/stories/${story.id}/chapters/${chapter.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-gray-500">{chapter.date}</p>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>👁️ {chapter.reads}</span>
                  <span>⭐ {chapter.votes}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Author Section */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About the Author
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-300"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {story.author.username}
                </h3>
                <p className="text-gray-600">Author of {story.parts} stories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
