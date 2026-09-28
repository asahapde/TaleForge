import { StoryCard, StoryMeta } from "@/components/story-card";
import { StoryCover } from "@/components/story-cover";
import { roman, timeAgo } from "@/lib/format";
import { fetchPublic } from "@/lib/server-api";
import type { BranchActivity, ChapterNode, Page, StorySummary, TagCount } from "@/lib/types";
import Link from "next/link";

export const revalidate = 60;

function ForkPreview({ story, tree }: { story: StorySummary; tree: ChapterNode[] }) {
  const root = tree.find((n) => n.parentId === null);
  const choices = tree.filter((n) => n.parentId === root?.id).slice(0, 3);
  if (!root || choices.length === 0) return null;
  return (
    <aside className="relative border border-ink bg-card p-6 shadow-[6px_6px_0_var(--color-paper-deep)]">
      <p className="smallcaps text-muted">
        From <em className="font-serif normal-case tracking-normal">{story.title}</em>
      </p>
      <p className="mt-3 font-display text-2xl leading-tight">
        Chapter {roman(1)} ends.
        <br />
        <span className="italic text-accent">Which way?</span>
      </p>
      <ol className="mt-5 space-y-3">
        {choices.map((choice, i) => (
          <li key={choice.id}>
            <Link
              href={`/stories/${story.id}/chapters/${choice.id}`}
              className="group flex gap-3 border-t rule pt-3 hover:text-accent"
            >
              <span className="smallcaps pt-1 text-faint">{String.fromCharCode(97 + i)}.</span>
              <span>
                <span className="italic">{choice.choiceLabel}</span>
                <span className="meta block text-xs group-hover:text-accent">
                  {choice.byStoryAuthor ? "the author’s path" : `a branch by ${choice.author.displayName}`}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <Link href={`/stories/${story.id}`} className="meta mt-5 inline-block link">
        See the whole map →
      </Link>
    </aside>
  );
}

export default async function HomePage() {
  const [branching, latest, recent, tags] = await Promise.all([
    fetchPublic<Page<StorySummary>>("/stories?sort=branching&size=3"),
    fetchPublic<Page<StorySummary>>("/stories?sort=new&size=5"),
    fetchPublic<BranchActivity[]>("/chapters/recent?limit=5"),
    fetchPublic<TagCount[]>("/tags?limit=16"),
  ]);
  const lead = branching?.items[0];
  const leadTree = lead ? await fetchPublic<ChapterNode[]>(`/stories/${lead.id}/tree`) : null;

  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="grid gap-12 py-14 md:grid-cols-[1.35fr_1fr] md:items-center md:py-20">
        <div>
          <p className="smallcaps text-accent">A library of branching fiction</p>
          <h1 className="mt-4 font-display text-[3.4rem] leading-[0.95] tracking-tight sm:text-[4.6rem]">
            Every story here
            <br />
            <span className="italic">can fork.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Read a chapter, then choose which way it goes. If none of the paths is the one you&rsquo;d take, write
            your own and it joins the story for the next reader.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/stories" className="btn btn-ink">
              Browse the library
            </Link>
            <Link href="/write" className="btn btn-outline">
              Begin a story
            </Link>
          </div>
        </div>
        {lead && leadTree && <ForkPreview story={lead} tree={leadTree} />}
      </section>

      <div className="double-rule" />

      {!branching && !latest && (
        <p className="notice mt-10">
          The library is taking a moment to open. Refresh in a few seconds and the shelves should be stocked.
        </p>
      )}

      {branching && branching.items.length > 0 && (
        <section className="py-12">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-4xl">Where the paths split most</h2>
            <Link href="/stories?sort=branching" className="meta link">
              More
            </Link>
          </div>
          <div className="mt-8 grid gap-10 sm:grid-cols-3">
            {branching.items.map((story) => (
              <article key={story.id} className="flex flex-col items-start gap-4">
                <Link href={`/stories/${story.id}`} className="transition-transform hover:-translate-y-1">
                  <StoryCover id={story.id} title={story.title} author={story.author.displayName} size="md" />
                </Link>
                <div className="space-y-1.5">
                  <h3 className="font-display text-2xl leading-tight">
                    <Link href={`/stories/${story.id}`} className="hover:text-accent">
                      {story.title}
                    </Link>
                  </h3>
                  <p className="text-[0.95rem] leading-relaxed text-ink-soft line-clamp-3">{story.description}</p>
                  <StoryMeta story={story} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-12 border-t border-ink pt-10 md:grid-cols-[1.7fr_1fr]">
        <section>
          <h2 className="font-display text-4xl">New on the shelves</h2>
          <div className="mt-2 divide-y rule">
            {latest?.items.map((story) => <StoryCard key={story.id} story={story} />)}
          </div>
          <Link href="/stories" className="btn btn-outline mt-4">
            The whole library
          </Link>
        </section>

        <aside className="space-y-12 md:border-l md:rule md:pl-10">
          {recent && recent.length > 0 && (
            <section>
              <h2 className="smallcaps text-ink">Fresh branches</h2>
              <ul className="mt-4 space-y-5">
                {recent.map((b) => (
                  <li key={b.id}>
                    <Link href={`/stories/${b.storyId}/chapters/${b.id}`} className="group block">
                      <span className="block italic text-muted group-hover:text-ink-soft">
                        &ldquo;{b.choiceLabel}&rdquo;
                      </span>
                      <span className="font-display text-xl leading-tight group-hover:text-accent">{b.title}</span>
                    </Link>
                    <p className="meta mt-1 text-xs">
                      {b.author.displayName} in <em>{b.storyTitle}</em> · {timeAgo(b.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tags && tags.length > 0 && (
            <section>
              <h2 className="smallcaps text-ink">Browse by subject</h2>
              <p className="mt-4 leading-loose">
                {tags.map((t, i) => (
                  <span key={t.tag}>
                    <Link href={`/stories?tag=${encodeURIComponent(t.tag)}`} className="hover:text-accent">
                      {t.tag}
                    </Link>
                    <sup className="meta ml-0.5 text-[0.65rem]">{t.count}</sup>
                    {i < tags.length - 1 && <span className="mx-2 text-faint">/</span>}
                  </span>
                ))}
              </p>
            </section>
          )}

          <section>
            <h2 className="smallcaps text-ink">How it works</h2>
            <ol className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-ink-soft">
              <li>
                <span className="font-display text-lg text-ink">I.</span> Start any story at its first chapter, or
                jump in anywhere on its map.
              </li>
              <li>
                <span className="font-display text-lg text-ink">II.</span> When a chapter ends, pick what happens
                next. The author&rsquo;s own path is always marked.
              </li>
              <li>
                <span className="font-display text-lg text-ink">III.</span> Want a different turn? Write it. Your
                chapter becomes a new choice for everyone after you.
              </li>
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
