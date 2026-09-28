"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

export function WriteBranchPrompt({
  storyId,
  chapterId,
  storyAuthorId,
  open,
  hasChoices,
}: {
  storyId: number;
  chapterId: number;
  storyAuthorId: number;
  open: boolean;
  hasChoices: boolean;
}) {
  const { user } = useAuth();
  const isAuthor = user?.id === storyAuthorId;
  const branchHref = `/stories/${storyId}/chapters/${chapterId}/branch`;

  if (!open && !isAuthor) {
    return (
      <p className="mt-8 font-sans text-[0.8125rem] italic" style={{ color: "var(--reader-muted)" }}>
        The author is writing this story alone, so new branches are closed.
      </p>
    );
  }

  return (
    <div
      className="mt-8 flex flex-col gap-4 border p-5 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor: "var(--reader-rule)" }}
    >
      <p className="font-serif">
        {hasChoices ? "None of these is what you’d do?" : "You could be the one to continue it."}
        <span className="mt-0.5 block font-sans text-[0.8125rem]" style={{ color: "var(--reader-muted)" }}>
          Write the next chapter and it becomes a new choice here.
        </span>
      </p>
      <Link
        href={user ? branchHref : `/auth/login?next=${encodeURIComponent(branchHref)}`}
        className="btn shrink-0"
        style={{ backgroundColor: "var(--reader-ink)", color: "var(--reader-bg)" }}
      >
        {isAuthor ? "Continue the story" : "Write a branch"}
      </Link>
    </div>
  );
}
