"use client";

import { useAuth } from "@/components/auth-provider";
import { BranchList } from "@/components/branch-list";
import { RequireAuth } from "@/components/require-auth";
import { StoryCard } from "@/components/story-card";
import { api, errorMessage, refreshPages } from "@/lib/api";
import type { BranchActivity, Me, StorySummary } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

function ProfileForm({ user }: { user: Me }) {
  const { setUser, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio ?? "");
  const [state, setState] = useState<{ busy: boolean; message: string | null; error: string | null }>({
    busy: false,
    message: null,
    error: null,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState({ busy: true, message: null, error: null });
    try {
      setUser(await api<Me>("/me", { method: "PUT", body: { displayName, bio } }));
      await refreshPages(`/writers/${user.username}`);
      setState({ busy: false, message: "Saved.", error: null });
    } catch (err) {
      setState({ busy: false, message: null, error: errorMessage(err) });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="displayName" className="field-label">
          Name on your work
        </label>
        <input
          id="displayName"
          required
          maxLength={60}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="field"
        />
      </div>
      <div>
        <label htmlFor="bio" className="field-label">
          A line about you
        </label>
        <textarea
          id="bio"
          rows={3}
          maxLength={500}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="field field-serif"
        />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={state.busy} className="btn btn-outline">
          {state.busy ? "Saving…" : "Save"}
        </button>
        {state.message && <span className="meta">{state.message}</span>}
      </div>
      {state.error && <p className="notice">{state.error}</p>}
      <p className="meta text-xs">
        Signed in as @{user.username} ({user.email}).{" "}
        <Link href={`/writers/${user.username}`} className="link">
          See your public page
        </Link>
        <span className="sm:hidden">
          {" · "}
          <button type="button" onClick={logout} className="link">
            Sign out
          </button>
        </span>
      </p>
    </form>
  );
}

function Desk() {
  const { user } = useAuth();
  const [stories, setStories] = useState<StorySummary[] | null>(null);
  const [branches, setBranches] = useState<BranchActivity[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api<StorySummary[]>("/me/stories"), api<BranchActivity[]>("/me/branches")])
      .then(([s, b]) => {
        setStories(s);
        setBranches(b);
      })
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (!user) return null;
  const drafts = stories?.filter((s) => !s.published).length ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-6">
        <div>
          <p className="smallcaps text-accent">Your desk</p>
          <h1 className="mt-2 font-display text-6xl tracking-tight">{user.displayName}</h1>
        </div>
        <Link href="/write" className="btn btn-ink">
          Begin a new story
        </Link>
      </header>

      {error && <p className="notice mt-6">{error}</p>}

      <div className="grid gap-12 pt-8 md:grid-cols-[1.6fr_1fr]">
        <section>
          <h2 className="font-display text-3xl">
            Your stories
            {stories && stories.length > 0 && (
              <span className="meta ml-3 align-middle">
                {stories.length} total{drafts > 0 && `, ${drafts} in draft`}
              </span>
            )}
          </h2>
          {stories === null ? (
            <p className="meta mt-4">Loading…</p>
          ) : stories.length === 0 ? (
            <p className="mt-4 italic text-muted">
              Nothing yet. Every story on TaleForge started as a blank page like this one.
            </p>
          ) : (
            <div className="divide-y rule">
              {stories.map((s) => (
                <StoryCard key={s.id} story={s} showStatus />
              ))}
            </div>
          )}

          <h2 className="mt-14 font-display text-3xl">Chapters you&rsquo;ve added</h2>
          <p className="meta mt-1">Branches and continuations, in your stories and other people&rsquo;s.</p>
          {branches === null ? (
            <p className="meta mt-4">Loading…</p>
          ) : branches.length === 0 ? (
            <p className="mt-4 italic text-muted">
              When a chapter ends somewhere you&rsquo;d have taken differently, write the other way.{" "}
              <Link href="/stories?sort=branching" className="link not-italic text-ink">
                Find a story to branch
              </Link>
            </p>
          ) : (
            <BranchList branches={branches} />
          )}
        </section>

        <aside className="md:border-l md:rule md:pl-10">
          <h2 className="smallcaps text-ink">Profile</h2>
          <div className="mt-4">
            <ProfileForm user={user} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function DeskPage() {
  return (
    <RequireAuth>
      <Desk />
    </RequireAuth>
  );
}
