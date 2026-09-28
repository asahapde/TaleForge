"use client";

import { useAuth } from "@/components/auth-provider";
import { ChapterView } from "@/components/chapter-view";
import { StoryView } from "@/components/story-view";
import { api, ApiError, errorMessage } from "@/lib/api";
import type { ChapterDetail, ChapterNode, StoryDetail } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

type Loaded<T> = { status: "loading" } | { status: "ok"; data: T } | { status: "missing" } | { status: "error"; message: string };

function useLoad<T>(load: () => Promise<T>, deps: unknown[]) {
  const { loading: authLoading } = useAuth();
  const [state, setState] = useState<Loaded<T>>({ status: "loading" });
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    load()
      .then((data) => !cancelled && setState({ status: "ok", data }))
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setState({ status: "missing" });
        else setState({ status: "error", message: errorMessage(err) });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, ...deps]);
  return state;
}

function Placeholder<T>({ state, what }: { state: Loaded<T>; what: string }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      {state.status === "loading" && <p className="meta">Fetching the {what}…</p>}
      {state.status === "missing" && (
        <>
          <h1 className="font-display text-5xl">No such {what}</h1>
          <p className="mt-4 text-muted">
            It may have been deleted, or it&rsquo;s a draft that only its author can see.{" "}
            <Link href="/stories" className="link text-ink">
              Back to the library
            </Link>
          </p>
        </>
      )}
      {state.status === "error" && <p className="notice">{state.message}</p>}
    </div>
  );
}

/** Used when the cached server render had nothing: drafts, or the API was still waking up. */
export function StoryLoader({ id }: { id: string }) {
  const state = useLoad(
    () => Promise.all([api<StoryDetail>(`/stories/${id}`), api<ChapterNode[]>(`/stories/${id}/tree`)]),
    [id],
  );
  if (state.status !== "ok") return <Placeholder state={state} what="story" />;
  return <StoryView story={state.data[0]} tree={state.data[1]} />;
}

export function ChapterLoader({ chapterId }: { chapterId: string }) {
  const state = useLoad(() => api<ChapterDetail>(`/chapters/${chapterId}`), [chapterId]);
  if (state.status !== "ok") return <Placeholder state={state} what="chapter" />;
  return <ChapterView chapter={state.data} />;
}
