"use client";

import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateStoryPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

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
      setLoading(true);
      const response = await api.post("/stories", {
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
      console.error("Error creating story:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to create story. Please try again.");
      }
    } finally {
      setLoading(false);
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
            Please log in to create a story
          </h1>
          <a
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create a New Story
          </h1>
          <p className="text-gray-500 text-base">
            Share your imagination with the world.
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 min-h-[60px]"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-mono focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 min-h-[180px]"
              rows={10}
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50"
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
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-sm hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 text-sm"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
