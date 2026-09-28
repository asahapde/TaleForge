import { roman } from "@/lib/format";
import type { ChapterNode } from "@/lib/types";
import Link from "next/link";

function childrenOf(nodes: ChapterNode[]) {
  const map = new Map<number | null, ChapterNode[]>();
  for (const node of nodes) {
    const list = map.get(node.parentId) ?? [];
    list.push(node);
    map.set(node.parentId, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => Number(b.byStoryAuthor) - Number(a.byStoryAuthor) || b.views - a.views);
  }
  return map;
}

function Branch({
  node,
  kids,
  storyId,
  activeId,
  trail,
}: {
  node: ChapterNode;
  kids: Map<number | null, ChapterNode[]>;
  storyId: number;
  activeId?: number;
  trail: Set<number>;
}) {
  const children = kids.get(node.id) ?? [];
  const active = node.id === activeId;
  const onTrail = trail.has(node.id);
  return (
    <li>
      <Link
        href={`/stories/${storyId}/chapters/${node.id}`}
        className={`group -mx-2 flex items-baseline gap-3 rounded-[2px] px-2 py-1.5 ${active ? "bg-paper-deep" : "hover:bg-paper-deep/60"}`}
      >
        <span
          className={`smallcaps w-7 shrink-0 text-right ${active ? "text-accent" : onTrail ? "text-ink" : "text-faint"}`}
        >
          {roman(node.depth + 1)}
        </span>
        <span className="min-w-0">
          {node.choiceLabel && (
            <span className="mr-2 italic text-muted group-hover:text-ink-soft">{node.choiceLabel} →</span>
          )}
          <span className={`${active ? "text-accent" : "text-ink"} group-hover:text-accent`}>{node.title}</span>
          <span className="meta ml-2 whitespace-nowrap text-xs">
            {node.byStoryAuthor ? (
              <span className="text-moss">author&rsquo;s path</span>
            ) : (
              <>branch by {node.author.displayName}</>
            )}
            {active && <span className="ml-2 text-accent">· you are here</span>}
          </span>
        </span>
      </Link>
      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <Branch key={child.id} node={child} kids={kids} storyId={storyId} activeId={activeId} trail={trail} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** The story's chapters drawn as a family tree: every fork is a choice a reader can make. */
export function BranchMap({
  nodes,
  storyId,
  activeId,
  trail = [],
}: {
  nodes: ChapterNode[];
  storyId: number;
  activeId?: number;
  trail?: number[];
}) {
  const kids = childrenOf(nodes);
  const roots = kids.get(null) ?? [];
  const trailSet = new Set(trail);
  return (
    <ul className="branch-tree text-[0.98rem] leading-snug">
      {roots.map((root) => (
        <Branch key={root.id} node={root} kids={kids} storyId={storyId} activeId={activeId} trail={trailSet} />
      ))}
    </ul>
  );
}
