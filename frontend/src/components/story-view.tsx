import { BranchMap } from "@/components/branch-map";
import { Comments } from "@/components/comments";
import { LikeButton } from "@/components/like-button";
import { StoryOwnerTools } from "@/components/owner-tools";
import { TagLine } from "@/components/story-card";
import { StoryCover } from "@/components/story-cover";
import { ViewTracker } from "@/components/view-tracker";
import { compact, longDate, plural } from "@/lib/format";
import type { ChapterNode, StoryDetail } from "@/lib/types";
import Link from "next/link";

function countEndings(nodes: ChapterNode[]) {
  const parents = new Set(nodes.map((n) => n.parentId));
  return nodes.filter((n) => !parents.has(n.id)).length;
}

export function StoryView({ story, tree }: { story: StoryDetail; tree: ChapterNode[] }) {
  const endings = countEndings(tree);
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      {story.published && <ViewTracker path={`/stories/${story.id}/view`} />}

      <p className="meta">
        <Link href="/stories" className="hover:text-ink">
          Library
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-soft">{story.title}</span>
      </p>

      <section className="mt-8 grid gap-10 md:grid-cols-[auto_1fr]">
        <StoryCover id={story.id} title={story.title} author={story.author.displayName} size="lg" />
        <div className="max-w-2xl space-y-5">
          {!story.published && (
            <p className="notice">This is a draft. Only you can see it until you publish.</p>
          )}
          <TagLine tags={story.tags} />
          <h1 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">{story.title}</h1>
          <p className="meta">
            Begun by{" "}
            <Link href={`/writers/${story.author.username}`} className="link text-ink">
              {story.author.displayName}
            </Link>{" "}
            on {longDate(story.createdAt)}
          </p>
          <p className="text-xl leading-relaxed text-ink-soft">{story.description}</p>

          <dl className="grid grid-cols-2 gap-y-3 border-y rule py-4 sm:grid-cols-4">
            {[
              [plural(story.chapterCount, "chapter"), "written so far"],
              [plural(endings, "ending"), "to reach"],
              [plural(story.contributorCount, "writer"), "have added to it"],
              [compact(story.views), "reads"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="font-display text-2xl">{value}</span>
                  <span className="meta block text-xs">{label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-start gap-3">
            {story.rootChapterId && (
              <Link href={`/stories/${story.id}/chapters/${story.rootChapterId}`} className="btn btn-ink">
                Begin at chapter I
              </Link>
            )}
            <LikeButton storyId={story.id} initialCount={story.likeCount} />
          </div>

          {!story.openToBranches && (
            <p className="meta italic">The author is writing this one alone, so new branches are closed.</p>
          )}

          <StoryOwnerTools story={story} />
        </div>
      </section>

      <section id="map" className="mt-16 grid gap-10 border-t border-ink pt-10 md:grid-cols-[15rem_1fr]">
        <div>
          <h2 className="font-display text-4xl">The map</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            Each fork is a choice a reader can make. Start anywhere; the numeral is the chapter&rsquo;s depth in
            the story.
          </p>
          <p className="meta mt-4 space-y-1 text-xs">
            <span className="block">
              <span className="text-moss">author&rsquo;s path</span>: written by {story.author.displayName}
            </span>
            <span className="block">branch by …: written by another reader</span>
          </p>
        </div>
        <div className="px-2">
          <BranchMap nodes={tree} storyId={story.id} />
        </div>
      </section>

      <div className="mt-16 max-w-3xl border-t border-ink pt-10">
        <Comments storyId={story.id} storyAuthorId={story.author.id} />
      </div>
    </div>
  );
}
