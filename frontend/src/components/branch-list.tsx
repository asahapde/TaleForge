import { roman, timeAgo } from "@/lib/format";
import type { BranchActivity } from "@/lib/types";
import Link from "next/link";

export function BranchList({ branches, showWriter = false }: { branches: BranchActivity[]; showWriter?: boolean }) {
  return (
    <ul className="divide-y rule">
      {branches.map((b) => (
        <li key={b.id} className="py-5">
          <p className="meta text-xs">
            Chapter {roman(b.depth + 1)} of{" "}
            <Link href={`/stories/${b.storyId}`} className="link italic text-ink-soft">
              {b.storyTitle}
            </Link>
            {showWriter && <> · {b.author.displayName}</>} · {timeAgo(b.createdAt)}
          </p>
          <Link href={`/stories/${b.storyId}/chapters/${b.id}`} className="group mt-1 block">
            {b.choiceLabel && <span className="block italic text-muted">&ldquo;{b.choiceLabel}&rdquo;</span>}
            <span className="font-display text-2xl leading-tight group-hover:text-accent">{b.title}</span>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-[0.95rem] text-ink-soft">{b.excerpt}</p>
        </li>
      ))}
    </ul>
  );
}
