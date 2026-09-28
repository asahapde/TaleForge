"use client";

import { useAuth } from "@/components/auth-provider";
import { ChapterFieldset, type ChapterFields } from "@/components/chapter-form";
import { RequireAuth } from "@/components/require-auth";
import { api, errorMessage, refreshPages } from "@/lib/api";
import type { ChapterDetail } from "@/lib/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function EditChapter() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [fields, setFields] = useState<ChapterFields | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<ChapterDetail>(`/chapters/${chapterId}`)
      .then((c) => {
        setChapter(c);
        setFields({ title: c.title, choiceLabel: c.choiceLabel ?? "", content: c.content });
      })
      .catch((err) => setError(errorMessage(err)));
  }, [chapterId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api(`/chapters/${chapterId}`, { method: "PUT", body: fields });
      const paths = [`/stories/${id}`, `/stories/${id}/chapters/${chapterId}`];
      if (chapter?.parentId) paths.push(`/stories/${id}/chapters/${chapter.parentId}`);
      await refreshPages(...paths);
      router.push(`/stories/${id}/chapters/${chapterId}`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  if (!chapter || !fields) {
    return <div className="mx-auto max-w-3xl px-5 py-16">{error ? <p className="notice">{error}</p> : <p className="meta">Opening the chapter…</p>}</div>;
  }
  if (chapter.author.id !== user?.id) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="notice">Only {chapter.author.displayName}, who wrote this chapter, can edit it.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="meta">
        <Link href={`/stories/${id}/chapters/${chapterId}`} className="hover:text-ink">
          ← Back to the chapter
        </Link>
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-tight">Revise &ldquo;{chapter.title}&rdquo;</h1>
      <form onSubmit={submit} className="mt-10 space-y-8">
        <ChapterFieldset value={fields} onChange={setFields} withChoice={chapter.parentId !== null} />
        {error && <p className="notice">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={busy} className="btn btn-ink">
            {busy ? "Saving…" : "Save changes"}
          </button>
          <Link href={`/stories/${id}/chapters/${chapterId}`} className="btn btn-quiet">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function EditChapterPage() {
  return (
    <RequireAuth>
      <EditChapter />
    </RequireAuth>
  );
}
