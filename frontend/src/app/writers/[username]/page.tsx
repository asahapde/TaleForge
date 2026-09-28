import { BranchList } from "@/components/branch-list";
import { StoryCard } from "@/components/story-card";
import { longDate, plural } from "@/lib/format";
import { fetchPublic } from "@/lib/server-api";
import type { BranchActivity, Profile, StorySummary } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchPublic<Profile>(`/users/${username}`);
  return { title: profile?.displayName ?? "Writer" };
}

export default async function WriterPage({ params }: Props) {
  const { username } = await params;
  const [profile, stories, branches] = await Promise.all([
    fetchPublic<Profile>(`/users/${username}`),
    fetchPublic<StorySummary[]>(`/users/${username}/stories`),
    fetchPublic<BranchActivity[]>(`/users/${username}/branches`),
  ]);
  if (!profile) notFound();

  const othersBranches = (branches ?? []).filter((b) => !stories?.some((s) => s.id === b.storyId));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <header className="border-b border-ink pb-8">
        <p className="smallcaps text-accent">Writer</p>
        <h1 className="mt-2 font-display text-6xl tracking-tight">{profile.displayName}</h1>
        {profile.bio && <p className="mt-4 max-w-2xl text-xl italic leading-relaxed text-ink-soft">{profile.bio}</p>}
        <p className="meta mt-4">
          @{profile.username} · {plural(profile.storyCount, "story", "stories")} · {plural(profile.branchCount, "branch", "branches")} ·
          writing since {longDate(profile.createdAt)}
        </p>
      </header>

      <div className="grid gap-12 pt-8 md:grid-cols-[1.6fr_1fr]">
        <section>
          <h2 className="font-display text-3xl">Stories</h2>
          {stories && stories.length > 0 ? (
            <div className="divide-y rule">
              {stories.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          ) : (
            <p className="mt-4 italic text-muted">No published stories yet.</p>
          )}
        </section>
        <aside className="md:border-l md:rule md:pl-10">
          <h2 className="font-display text-3xl">Branches in other stories</h2>
          {othersBranches.length > 0 ? (
            <BranchList branches={othersBranches} />
          ) : (
            <p className="mt-4 italic text-muted">None yet.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
