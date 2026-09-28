"use client";

import { useAuth } from "@/components/auth-provider";
import { api, errorMessage } from "@/lib/api";
import type { LikeState } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LikeButton({ storyId, initialCount }: { storyId: number; initialCount: number }) {
  const { user } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<LikeState>({ liked: false, likeCount: initialCount });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    api<LikeState>(`/stories/${storyId}/like`)
      .then(setState)
      .catch(() => {});
  }, [storyId, user]);

  async function toggle() {
    if (!user) {
      router.push(`/auth/login?next=/stories/${storyId}`);
      return;
    }
    setBusy(true);
    setError(null);
    const previous = state;
    setState({ liked: !state.liked, likeCount: state.likeCount + (state.liked ? -1 : 1) });
    try {
      setState(await api<LikeState>(`/stories/${storyId}/like`, { method: state.liked ? "DELETE" : "POST" }));
    } catch (err) {
      setState(previous);
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col">
      <button
        onClick={toggle}
        disabled={busy}
        aria-pressed={state.liked}
        className={`btn ${state.liked ? "btn-ink" : "btn-outline"}`}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill={state.liked ? "currentColor" : "none"} stroke="currentColor">
          <path
            strokeWidth="1.5"
            d="M10 16.5s-6-3.6-6-8.1A3.4 3.4 0 0 1 10 6.3a3.4 3.4 0 0 1 6 2.1c0 4.5-6 8.1-6 8.1Z"
          />
        </svg>
        {state.liked ? "Liked" : "Like"}
        <span className="opacity-70">{state.likeCount}</span>
      </button>
      {error && <span className="meta mt-1 text-accent">{error}</span>}
    </span>
  );
}
