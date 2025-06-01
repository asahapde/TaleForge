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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching comments for story:", storyId);
      const response = await api.get(`/comments/story/${storyId}`);
      console.log("Comments fetched:", response.data);
      setComments(response.data);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
      setError(err.response?.data?.message || "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCommentId) {
      await handleEdit(editingCommentId);
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      setError("");
      console.log("Submitting new comment:", { storyId, content: newComment });
      const response = await api.post(`/comments/story/${storyId}`, {
        content: newComment,
      });
      console.log("Comment submitted successfully:", response.data);
      const newCommentData = {
        ...response.data,
        author: {
          id: response.data.author.id,
          username: response.data.author.username,
          displayName:
            response.data.author.displayName || response.data.author.username,
        },
      };
      setComments([newCommentData, ...comments]);
      setNewComment("");
    } catch (err: any) {
      console.error("Error submitting comment:", err);
      setError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      setIsSubmitting(true);
      setError("");
      console.log("Editing comment:", { commentId, content: editContent });
      const response = await api.put(`/comments/${commentId}`, {
        content: editContent,
      });
      console.log("Comment edited successfully:", response.data);
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setEditingCommentId(null);
      setEditContent("");
    } catch (err: any) {
      console.error("Error editing comment:", err);
      setError(err.response?.data?.message || "Failed to edit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      setError("");
      console.log("Deleting comment:", commentId);
      await api.delete(`/comments/${commentId}`);
      console.log("Comment deleted successfully");
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err: any) {
      console.error("Error deleting comment:", err);
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
      console.log("Liking comment:", commentId);
      if (comment.liked) {
        await api.delete(`/comments/${commentId}/like`);
        console.log("Comment unliked successfully");
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
        console.log("Comment liked successfully:", response.data);
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
      console.error("Error liking/unliking comment:", err);
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
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-mono focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 min-h-[60px]"
              rows={3}
              required
            />
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-sm hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 text-sm cursor-pointer"
                disabled={isSubmitting}
                aria-label={isSubmitting ? "Posting..." : "Post Comment"}
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
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
            className="bg-white p-4 border border-gray-200 rounded-xl"
          >
            {editingCommentId === comment.id ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-2 text-center">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Edit Comment
                  </h3>
                </div>
                <textarea
                  id="content"
                  name="content"
                  rows={3}
                  required
                  minLength={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-mono focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 min-h-[60px]"
                  placeholder="Write your comment here..."
                />
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditContent("");
                    }}
                    className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition text-sm cursor-pointer"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-sm hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 text-sm cursor-pointer"
                    aria-label={isSubmitting ? "Saving..." : "Save Changes"}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {comment.author.displayName || comment.author.username}
                    </p>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {user && user.id === comment.author.id && (
                      <>
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                          aria-label="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
                          aria-label="Delete"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleLike(comment.id)}
                      disabled={
                        !user ||
                        user.id === comment.author.id ||
                        isLiking === comment.id
                      }
                      className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                        comment.liked
                          ? "text-red-700 bg-red-100 hover:bg-red-200"
                          : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 relative group`}
                      title={
                        !user
                          ? "Please log in to like comments"
                          : user.id === comment.author.id
                          ? "Cannot like your own comment"
                          : ""
                      }
                      aria-label={
                        !user
                          ? "Please log in to like comments"
                          : user.id === comment.author.id
                          ? "Cannot like your own comment"
                          : ""
                      }
                    >
                      {!user && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          Please log in to like comments
                        </div>
                      )}
                      <svg
                        className={`h-4 w-4 mr-1.5 ${
                          comment.liked ? "fill-current" : "fill-none"
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
                      {comment.likes}
                    </button>
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
