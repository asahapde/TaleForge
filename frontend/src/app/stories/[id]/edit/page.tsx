"use client";

import { useAuth } from "@/components/auth-provider";
import { RequireAuth } from "@/components/require-auth";
import { parseTags, StoryFieldset, type StoryFields } from "@/components/story-fields";
import { api, errorMessage, refreshPages } from "@/lib/api";
import type { StoryDetail } from "@/lib/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function EditStory() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [fields, setFields] = useState<StoryFields | null>(null);
  const [published, setPublished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<StoryDetail>(`/stories/${id}`)
      .then((s) => {
        setStory(s);
        setPublished(s.published);
        setFields({
          title: s.title,
          description: s.description,
          tags: s.tags.join(", "),
          openToBranches: s.openToBranches,
        });
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/stories/${id}`, {
        method: "PUT",
        body: { ...fields, tags: parseTags(fields.tags), published },
      });
      await refreshPages(`/stories/${id}`, `/writers/${story!.author.username}`);
      router.push(`/stories/${id}`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  if (!story || !fields) {
    return <div className="mx-auto max-w-3xl px-5 py-16">{error ? <p className="notice">{error}</p> : <p className="meta">Opening the story…</p>}</div>;
  }
  if (story.author.id !== user?.id) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="notice">Only the author can edit this story&rsquo;s details.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="meta">
        <Link href={`/stories/${id}`} className="hover:text-ink">
          ← Back to the story
        </Link>
      </p>
      <h1 className="mt-4 font-display text-5xl tracking-tight">Story details</h1>
      <p className="mt-2 text-muted">
        To change the text, open a chapter and choose &ldquo;Edit chapter&rdquo;.
      </p>
      <form onSubmit={submit} className="mt-10 space-y-8">
        <StoryFieldset value={fields} onChange={setFields} />
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-ink)]"
          />
          <span>
            <span className="field-label mb-0">Published</span>
            <span className="field-hint mt-0 block">Unpublished stories are hidden from everyone but you.</span>
          </span>
        </label>
        {error && <p className="notice">{error}</p>}
        <div className="flex gap-3 border-t border-ink pt-6">
          <button type="submit" disabled={busy} className="btn btn-ink">
            {busy ? "Saving…" : "Save changes"}
          </button>
          <Link href={`/stories/${id}`} className="btn btn-quiet">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function EditStoryPage() {
  return (
    <RequireAuth>
      <EditStory />
    </RequireAuth>
  );
}
