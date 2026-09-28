"use client";

import { ChapterFieldset, useChapterFields } from "@/components/chapter-form";
import { RequireAuth } from "@/components/require-auth";
import { parseTags, StoryFieldset, type StoryFields } from "@/components/story-fields";
import { api, errorMessage, refreshPages } from "@/lib/api";
import type { StoryDetail } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

function NewStory() {
  const router = useRouter();
  const [story, setStory] = useState<StoryFields>({ title: "", description: "", tags: "", openToBranches: true });
  const [chapter, setChapter] = useChapterFields();
  const [busy, setBusy] = useState<"publish" | "draft" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(publish: boolean) {
    setBusy(publish ? "publish" : "draft");
    setError(null);
    try {
      const created = await api<StoryDetail>("/stories", {
        method: "POST",
        body: {
          title: story.title,
          description: story.description,
          tags: parseTags(story.tags),
          openToBranches: story.openToBranches,
          published: publish,
          firstChapter: { title: chapter.title, content: chapter.content },
        },
      });
      if (publish) await refreshPages(`/writers/${created.author.username}`);
      router.push(`/stories/${created.id}`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="smallcaps text-accent">A new story</p>
      <h1 className="mt-2 font-display text-6xl tracking-tight">Begin something</h1>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">
        Write the opening chapter. After that, you can keep going yourself, and other writers can take it
        somewhere else.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save(true);
        }}
        className="mt-10 space-y-12"
      >
        <fieldset className="space-y-6">
          <legend className="smallcaps mb-4 border-b border-ink pb-2 text-ink">The story</legend>
          <StoryFieldset value={story} onChange={setStory} />
        </fieldset>

        <fieldset>
          <legend className="smallcaps mb-4 w-full border-b border-ink pb-2 text-ink">Chapter I</legend>
          <ChapterFieldset value={chapter} onChange={setChapter} withChoice={false} />
        </fieldset>

        {error && <p className="notice">{error}</p>}

        <div className="flex flex-wrap items-center gap-3 border-t border-ink pt-6">
          <button type="submit" disabled={busy !== null} className="btn btn-ink">
            {busy === "publish" ? "Publishing…" : "Publish"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={(e) => {
              const form = e.currentTarget.form;
              if (form?.reportValidity()) save(false);
            }}
            className="btn btn-outline"
          >
            {busy === "draft" ? "Saving…" : "Save as draft"}
          </button>
          <span className="meta">Drafts are only visible to you.</span>
        </div>
      </form>
    </div>
  );
}

export default function WritePage() {
  return (
    <RequireAuth>
      <NewStory />
    </RequireAuth>
  );
}
