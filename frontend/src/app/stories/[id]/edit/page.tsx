"use client";

import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
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
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function EditStoryPage() {
  const params = useParams() || {};
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const [story, setStory] = useState<Story | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/stories/${id}`);
        const storyData = response.data;
        setStory(storyData);
        setTitle(storyData.title);
        setDescription(storyData.description);
        setContent(storyData.content);
        setTags(storyData.tags.join(", "));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate input lengths
    if (title.length < 3) {
      setError("Title must be at least 3 characters long");
      return;
    }

    if (description.length < 10) {
      setError("Description must be at least 10 characters long");
      return;
    }

    if (content.length < 50) {
      setError("Content must be at least 50 characters long");
      return;
    }

    try {
      setSaving(true);
      const response = await api.put(`/stories/${id}`, {
        title,
        description,
        content,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });
      router.push(`/stories/${response.data.id}`);
    } catch (err: any) {
      console.error("Error updating story:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to update story. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to edit stories
          </h1>
          <a
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            aria-label="Log in"
          >
            Log in
          </a>
        </div>
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

  if (user.id !== story.author.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            You don't have permission to edit this story
          </h1>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            aria-label="Go Back"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Story</h1>
          <p className="text-gray-500 text-base">
            Update your story details below.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story title..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 cursor-pointer"
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short summary of your story..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 min-h-[48px] cursor-pointer"
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base font-mono focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 min-h-[140px] cursor-pointer"
              rows={8}
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. fantasy, adventure, magic"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate tags with commas.
            </p>
          </div>
          {error && (
            <div className="text-red-600 text-center font-medium py-2 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition text-sm cursor-pointer"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-sm hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 text-sm cursor-pointer"
              disabled={loading}
              aria-label={loading ? "Saving..." : "Save Changes"}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
