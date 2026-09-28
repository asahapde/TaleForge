"use client";

import { useAuth } from "@/components/auth-provider";
import { api, errorMessage, refreshPages } from "@/lib/api";
import type { StoryDetail } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StoryOwnerTools({ story }: { story: StoryDetail }) {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user?.id !== story.author.id) return null;

  async function togglePublished() {
    setBusy(true);
    setError(null);
    try {
      await api(`/stories/${story.id}`, {
        method: "PUT",
        body: {
          title: story.title,
          description: story.description,
          tags: story.tags,
          openToBranches: story.openToBranches,
          published: !story.published,
        },
      });
      await refreshPages(`/stories/${story.id}`, `/writers/${story.author.username}`);
      window.location.reload();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete “${story.title}” and every branch written for it? This can't be undone.`)) return;
    setBusy(true);
    try {
      await api(`/stories/${story.id}`, { method: "DELETE" });
      await refreshPages(`/stories/${story.id}`, `/writers/${story.author.username}`);
      router.push("/desk");
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="border-t rule pt-4">
      <p className="smallcaps mb-3 text-muted">Author&rsquo;s tools</p>
      <div className="flex flex-wrap gap-2">
        <Link href={`/stories/${story.id}/edit`} className="btn btn-outline">
          Edit details
        </Link>
        <button onClick={togglePublished} disabled={busy} className="btn btn-outline">
          {story.published ? "Unpublish" : "Publish"}
        </button>
        <button onClick={remove} disabled={busy} className="btn btn-danger">
          Delete story
        </button>
      </div>
      {error && <p className="notice mt-3">{error}</p>}
    </div>
  );
}

export function ChapterOwnerTools({
  storyId,
  chapterId,
  parentId,
  chapterAuthorId,
  storyAuthorId,
  hasChoices,
}: {
  storyId: number;
  chapterId: number;
  parentId: number | null;
  chapterAuthorId: number;
  storyAuthorId: number;
  hasChoices: boolean;
}) {
  const isRoot = parentId === null;
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isChapterAuthor = user?.id === chapterAuthorId;
  const isStoryAuthor = user?.id === storyAuthorId;
  const canDelete = !isRoot && (isStoryAuthor || (isChapterAuthor && !hasChoices));
  if (!isChapterAuthor && !canDelete) return null;

  async function remove() {
    const warning = hasChoices
      ? "Delete this chapter and every branch that continues from it?"
      : "Delete this chapter?";
    if (!window.confirm(warning)) return;
    setBusy(true);
    try {
      await api(`/chapters/${chapterId}`, { method: "DELETE" });
      await refreshPages(`/stories/${storyId}`, `/stories/${storyId}/chapters/${parentId}`);
      router.push(`/stories/${storyId}/chapters/${parentId}`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="meta flex flex-wrap items-center gap-2">
      {isChapterAuthor && (
        <Link href={`/stories/${storyId}/chapters/${chapterId}/edit`} className="btn btn-quiet">
          Edit chapter
        </Link>
      )}
      {canDelete && (
        <button onClick={remove} disabled={busy} className="btn btn-quiet hover:text-accent">
          Delete
        </button>
      )}
      {error && <span className="text-accent">{error}</span>}
    </div>
  );
}
