"use client";

import api from "@/config/api";
import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function StoryDetailPage() {
  const params = useParams() || {};
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/api/stories/${id}`);
        setStory(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch story"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStory();
  }, [id]);

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

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Story not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link
        href="/stories"
        className="text-indigo-600 hover:underline mb-4 block"
      >
        ← Back to Stories
      </Link>
      <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
      <div className="text-gray-500 mb-4">
        By {story.author.displayName || story.author.username} •{" "}
        {new Date(story.createdAt).toLocaleDateString()}
      </div>
      <div className="mb-4">
        {story.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mr-2"
          >
            #{tag}
          </span>
        ))}
      </div>
      <p className="text-lg mb-6">{story.description}</p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: story.content }}
      />
      <div className="mt-8 text-gray-500">
        {story.views} views • ★ {story.rating.toFixed(1)}
      </div>
    </div>
  );
}
