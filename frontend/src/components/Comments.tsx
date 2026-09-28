"use client";

import { useAuth } from "@/components/auth-provider";
import { api, errorMessage } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import type { CommentItem } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

function CommentRow({
  comment,
  canEdit,
  canDelete,
  onChange,
  onDelete,
}: {
  comment: CommentItem;
  canEdit: boolean;
  canDelete: boolean;
  onChange: (c: CommentItem) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      onChange(await api<CommentItem>(`/comments/${comment.id}`, { method: "PUT", body: { content: draft } }));
      setEditing(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this comment?")) return;
    setBusy(true);
    try {
      await api(`/comments/${comment.id}`, { method: "DELETE" });
      onDelete(comment.id);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <li className="border-b rule py-5 last:border-b-0">
      <p className="meta">
        <Link href={`/writers/${comment.author.username}`} className="font-medium text-ink hover:text-accent">
          {comment.author.displayName}
        </Link>
        <span className="mx-2" aria-hidden>
          ·
        </span>
        {timeAgo(comment.createdAt)}
        {comment.edited && <span className="ml-2 italic">edited</span>}
      </p>
      {editing ? (
        <div className="mt-3 space-y-3">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} className="field field-serif" />
          <div className="flex gap-2">
            <button onClick={save} disabled={busy || !draft.trim()} className="btn btn-ink">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="btn btn-quiet">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-soft">{comment.content}</p>
      )}
      {!editing && (canEdit || canDelete) && (
        <div className="meta mt-2 flex gap-4 text-xs">
          {canEdit && (
            <button onClick={() => setEditing(true)} className="hover:text-ink">
              Edit
            </button>
          )}
          {canDelete && (
            <button onClick={remove} disabled={busy} className="hover:text-accent">
              Delete
            </button>
          )}
        </div>
      )}
      {error && <p className="notice mt-3">{error}</p>}
    </li>
  );
}

export function Comments({ storyId, storyAuthorId }: { storyId: number; storyAuthorId: number }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<CommentItem[]>(`/stories/${storyId}/comments`)
      .then(setComments)
      .catch((err) => {
        setComments([]);
        setError(errorMessage(err));
      });
  }, [storyId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const created = await api<CommentItem>(`/stories/${storyId}/comments`, {
        method: "POST",
        body: { content: draft },
      });
      setComments((list) => [created, ...(list ?? [])]);
      setDraft("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="font-display text-3xl">
        Margin notes
        {comments && comments.length > 0 && <span className="ml-3 text-xl text-faint">{comments.length}</span>}
      </h2>

      {user ? (
        <form onSubmit={submit} className="mt-5 space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            maxLength={4000}
            placeholder="Leave a note for the writers…"
            className="field field-serif"
          />
          <button type="submit" disabled={busy || !draft.trim()} className="btn btn-ink">
            {busy ? "Posting…" : "Post note"}
          </button>
        </form>
      ) : (
        <p className="meta mt-4">
          <Link href={`/auth/login?next=/stories/${storyId}`} className="link text-ink">
            Sign in
          </Link>{" "}
          to leave a note.
        </p>
      )}

      {error && <p className="notice mt-4">{error}</p>}

      {comments === null ? (
        <p className="meta mt-6">Loading notes…</p>
      ) : comments.length === 0 ? (
        <p className="mt-6 italic text-muted">No notes yet. Be the first to say what you thought.</p>
      ) : (
        <ul className="mt-4">
          {comments.map((c) => (
            <CommentRow
              key={c.id}
              comment={c}
              canEdit={user?.id === c.author.id}
              canDelete={user?.id === c.author.id || user?.id === storyAuthorId}
              onChange={(updated) => setComments((list) => list!.map((x) => (x.id === updated.id ? updated : x)))}
              onDelete={(id) => setComments((list) => list!.filter((x) => x.id !== id))}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
