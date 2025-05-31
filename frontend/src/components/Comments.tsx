import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    displayName: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  liked: boolean;
}

interface CommentsProps {
  storyId: number;
}

export default function Comments({ storyId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isLiking, setIsLiking] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/comments/story/${storyId}`);
      setComments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setError("");
      const response = await api.post(`/comments/story/${storyId}`, {
        content: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post comment");
    }
  };

  const handleEdit = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      setError("");
      const response = await api.put(`/comments/${commentId}`, {
        content: editContent,
      });
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setEditingCommentId(null);
      setEditContent("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to edit comment");
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      setError("");
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleLike = async (commentId: number) => {
    if (!user) {
      setError("Please log in to like comments");
      return;
    }

    const comment = comments.find((c) => c.id === commentId);
    if (!comment || user.id === comment.author.id) return;

    try {
      setIsLiking(commentId);
      setError("");
      if (comment.liked) {
        await api.delete(`/comments/${commentId}/like`);
        setComments(
          comments.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  likes: c.likes - 1,
                  liked: false,
                }
              : c
          )
        );
      } else {
        const response = await api.post(`/comments/${commentId}/like`);
        setComments(
          comments.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  likes: response.data.likes,
                  liked: true,
                }
              : c
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to like comment");
    } finally {
      setIsLiking(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      }).format(date);
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            required
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-600 mb-6">
          Please{" "}
          <a href="/auth/login" className="text-indigo-600 hover:underline">
            log in
          </a>{" "}
          to leave a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            {editingCommentId === comment.id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  required
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditContent("");
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEdit(comment.id)}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {comment.author.displayName || comment.author.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center space-x-1 ${
                        comment.liked
                          ? "text-indigo-600"
                          : "text-gray-500 hover:text-indigo-600"
                      } transition-colors duration-200`}
                      disabled={
                        !user ||
                        user.id === comment.author.id ||
                        isLiking === comment.id
                      }
                      title={
                        !user
                          ? "Please log in to like comments"
                          : user.id === comment.author.id
                          ? "Cannot like your own comment"
                          : ""
                      }
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${
                            isLiking === comment.id ? "animate-pulse" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill={comment.liked ? "currentColor" : "none"}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span className="ml-1.5 text-sm">{comment.likes}</span>
                      </div>
                    </button>
                    {user && user.id === comment.author.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
