"use client";

import Comments from "@/components/Comments";
import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const viewCounted = useRef(false);

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

        // Check if user has liked the story
        if (user) {
          const likeStatusResponse = await api.get(
            `/likes/stories/${id}/status`
          );
          setHasLiked(likeStatusResponse.data);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch story"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStory();
  }, [id, user]);

  useEffect(() => {
    let isMounted = true;

    const incrementView = async () => {
      if (!id || !story) return;

      try {
        const viewResponse = await api.post(`/stories/${id}/view`);
        if (isMounted) {
          setStory((prev) =>
            prev ? { ...prev, views: viewResponse.data.views } : null
          );
        }
      } catch (viewErr) {
        console.error("Failed to increment view count:", viewErr);
      }
    };

    incrementView();

    return () => {
      isMounted = false;
    };
  }, [id, story?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    // Validate input lengths
    if (title.length < 3) {
      setError("Title must be at least 3 characters long");
      setSaving(false);
      return;
    }

    if (description.length < 10) {
      setError("Description must be at least 10 characters long");
      setSaving(false);
      return;
    }

    if (content.length < 50) {
      setError("Content must be at least 50 characters long");
      setSaving(false);
      return;
    }

    try {
      const requestBody = {
        title,
        description,
        content,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      const response = await api.put(`/stories/${id}`, requestBody);
      setStory(response.data);
      setSuccess("Story updated successfully!");
      setIsEditing(false);
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }).format(date);
    } catch (err) {
      return "Invalid date";
    }
  };

  const handleLike = async () => {
    if (!user) {
      setError("Please log in to like stories");
      return;
    }

    if (user.id === story?.author.id) {
      setError("Cannot like your own story");
      return;
    }

    try {
      setIsLiking(true);
      if (hasLiked) {
        await api.delete(`/stories/${id}/like`);
        setHasLiked(false);
        setStory((prev) =>
          prev
            ? {
                ...prev,
                likes: prev.likes - 1,
              }
            : null
        );
      } else {
        const response = await api.post(`/stories/${id}/like`);
        setHasLiked(true);
        setStory((prev) =>
          prev
            ? {
                ...prev,
                likes: response.data.likes,
              }
            : null
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update like status");
    } finally {
      setIsLiking(false);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      setError("Please log in to publish stories");
      return;
    }

    if (!story) {
      setError("Story not found");
      return;
    }

    try {
      setIsUnpublishing(true);
      const response = await api.post(
        `/stories/${id}/${story.published ? "unpublish" : "publish"}`
      );
      setStory(response.data);
      setSuccess(
        `Story ${
          response.data.published ? "published" : "unpublished"
        } successfully!`
      );
    } catch (err: any) {
      console.error("Error publishing story:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to publish story. Please try again.");
      }
    } finally {
      setIsUnpublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      setError("Please log in to delete stories");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/stories/${id}`);
      setSuccess("Story deleted successfully!");
      router.push("/stories");
    } catch (err: any) {
      console.error("Error deleting story:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to delete story. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || authLoading) {
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

  const isAuthor = user?.id === story.author.id;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/stories" className="text-indigo-600 hover:underline">
          ← Back to Stories
        </Link>
      </div>

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

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title (min. 3 characters)
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                required
                minLength={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (min. 10 characters)
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                minLength={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content (min. 50 characters)
            </label>
            <div className="mt-1">
              <textarea
                id="content"
                name="content"
                rows={10}
                required
                minLength={50}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags (comma-separated)
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="tags"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="fantasy, adventure, mystery"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                saving
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0 pr-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {story.title}
              </h1>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {user && user.id === story.author.id && (
                <>
                  <Link
                    href={`/stories/${story.id}/edit`}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handlePublish}
                    disabled={isUnpublishing}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                  >
                    {story.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={handleLike}
                disabled={!user || user.id === story.author.id || isLiking}
                className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                  hasLiked
                    ? "text-red-700 bg-red-100 hover:bg-red-200"
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
                title={
                  !user
                    ? "Please log in to like stories"
                    : user.id === story.author.id
                    ? "Cannot like your own story"
                    : ""
                }
              >
                <svg
                  className={`h-4 w-4 mr-1.5 ${
                    hasLiked ? "fill-current" : "fill-none"
                  }`}
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
              </button>
            </div>
          </div>

          <p className="text-base sm:text-lg mt-4 mb-6 text-gray-700">
            {story.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div
            className="prose prose-sm sm:prose-base max-w-none break-words mb-8"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 pt-4 border-t border-gray-100">
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

          <Comments storyId={story.id} />
        </>
      )}
    </div>
  );
}
