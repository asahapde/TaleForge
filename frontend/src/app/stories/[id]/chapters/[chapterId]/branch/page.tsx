"use client";

import { ChapterFieldset, useChapterFields } from "@/components/chapter-form";
import { RequireAuth } from "@/components/require-auth";
import { api, errorMessage, refreshPages } from "@/lib/api";
import { paragraphs, roman } from "@/lib/format";
import type { ChapterDetail } from "@/lib/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function BranchForm() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const router = useRouter();
  const [parent, setParent] = useState<ChapterDetail | null>(null);
  const [fields, setFields] = useChapterFields();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<ChapterDetail>(`/chapters/${chapterId}`)
      .then(setParent)
      .catch((err) => setError(errorMessage(err)));
  }, [chapterId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const created = await api<ChapterDetail>(`/chapters/${chapterId}/branches`, { method: "POST", body: fields });
      await refreshPages(`/stories/${id}`, `/stories/${id}/chapters/${chapterId}`);
      router.push(`/stories/${id}/chapters/${created.id}`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  if (!parent) {
    return <div className="mx-auto max-w-3xl px-5 py-16">{error ? <p className="notice">{error}</p> : <p className="meta">Opening the chapter…</p>}</div>;
  }

  const tail = paragraphs(parent.content).slice(-2);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="meta">
        <Link href={`/stories/${id}`} className="hover:text-ink">
          {parent.storyTitle}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/stories/${id}/chapters/${chapterId}`} className="hover:text-ink">
          {parent.title}
        </Link>
        <span className="mx-2">/</span>
        New branch
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-tight">Write what happens next</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Your chapter becomes Chapter {roman(parent.depth + 2)}, a new path readers can choose at the end of{" "}
        <em>{parent.title}</em>.
      </p>

      <figure className="mt-8 border-l-2 border-ink bg-card px-6 py-5">
        <figcaption className="smallcaps text-muted">Where it leaves off</figcaption>
        <div className="tale mt-3 text-[1.02rem] text-ink-soft [--reader-size:1.02rem]">
          {tail.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </figure>

      {parent.choices.length > 0 && (
        <div className="meta mt-6">
          <p className="smallcaps text-ink">Paths already taken from here</p>
          <ul className="mt-2 space-y-1">
            {parent.choices.map((c) => (
              <li key={c.id}>
                <span className="italic text-ink-soft">{c.choiceLabel}</span>, by {c.author.displayName}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={submit} className="mt-10 space-y-8 border-t border-ink pt-8">
        <ChapterFieldset value={fields} onChange={setFields} withChoice />
        {error && <p className="notice">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={busy} className="btn btn-ink">
            {busy ? "Adding your branch…" : "Add this branch"}
          </button>
          <Link href={`/stories/${id}/chapters/${chapterId}`} className="btn btn-quiet">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function NewBranchPage() {
  return (
    <RequireAuth>
      <BranchForm />
    </RequireAuth>
  );
}
