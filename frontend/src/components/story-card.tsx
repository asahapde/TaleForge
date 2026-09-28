import { StoryCover } from "@/components/story-cover";
import { compact, plural } from "@/lib/format";
import type { StorySummary } from "@/lib/types";
import Link from "next/link";

export function StoryMeta({ story }: { story: StorySummary }) {
  return (
    <p className="meta flex flex-wrap gap-x-3 gap-y-1">
      <span>{plural(story.chapterCount, "chapter")}</span>
      <span aria-hidden>·</span>
      <span>{compact(story.views)} reads</span>
      <span aria-hidden>·</span>
      <span>{plural(story.likeCount, "like")}</span>
    </p>
  );
}

export function TagLine({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <p className="smallcaps flex flex-wrap gap-x-3 text-accent">
      {tags.map((tag) => (
        <Link key={tag} href={`/stories?tag=${encodeURIComponent(tag)}`} className="hover:text-ink">
          {tag}
        </Link>
      ))}
    </p>
  );
}

/** A story as a catalogue entry: small cover, title, byline, blurb. */
export function StoryCard({ story, showStatus = false }: { story: StorySummary; showStatus?: boolean }) {
  return (
    <article className="flex gap-5 py-6">
      <Link href={`/stories/${story.id}`} tabIndex={-1} className="transition-transform hover:-translate-y-0.5">
        <StoryCover id={story.id} title={story.title} size="sm" />
      </Link>
      <div className="min-w-0 flex-1 space-y-2">
        <TagLine tags={story.tags} />
        <h3 className="font-display text-[1.7rem] leading-[1.1]">
          <Link href={`/stories/${story.id}`} className="hover:text-accent">
            {story.title}
          </Link>
          {showStatus && !story.published && (
            <span className="smallcaps ml-3 align-middle text-gold">Draft</span>
          )}
        </h3>
        <p className="meta">
          by{" "}
          <Link href={`/writers/${story.author.username}`} className="link text-ink-soft">
            {story.author.displayName}
          </Link>
        </p>
        <p className="line-clamp-3 max-w-prose text-[0.98rem] leading-relaxed text-ink-soft">{story.description}</p>
        <StoryMeta story={story} />
      </div>
    </article>
  );
}
