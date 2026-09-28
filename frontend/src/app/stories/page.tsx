import { StoryCard } from "@/components/story-card";
import { fetchPublic } from "@/lib/server-api";
import type { Page, StorySummary, TagCount } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "The library" };

const SORTS = [
  { key: "new", label: "Newest" },
  { key: "popular", label: "Most read" },
  { key: "liked", label: "Most liked" },
  { key: "branching", label: "Most branched" },
] as const;

type Params = { q?: string; tag?: string; sort?: string; page?: string };

function href(params: Params, change: Partial<Params>) {
  const merged = { ...params, ...change };
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) if (v && !(k === "page" && v === "0")) qs.set(k, v);
  const s = qs.toString();
  return s ? `/stories?${s}` : "/stories";
}

export default async function LibraryPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const sort = SORTS.some((s) => s.key === params.sort) ? params.sort! : "new";
  const page = Math.max(0, Number.parseInt(params.page ?? "0", 10) || 0);

  const qs = new URLSearchParams({ sort, page: String(page), size: "10" });
  if (params.q) qs.set("q", params.q);
  if (params.tag) qs.set("tag", params.tag);

  const [results, tags] = await Promise.all([
    fetchPublic<Page<StorySummary>>(`/stories?${qs}`, 30),
    fetchPublic<TagCount[]>("/tags?limit=30"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <header className="border-b border-ink pb-8">
        <p className="smallcaps text-accent">Catalogue</p>
        <h1 className="mt-2 font-display text-6xl tracking-tight">The library</h1>
        <form action="/stories" className="mt-8 flex max-w-xl gap-2">
          {params.tag && <input type="hidden" name="tag" value={params.tag} />}
          {sort !== "new" && <input type="hidden" name="sort" value={sort} />}
          <label htmlFor="q" className="sr-only">
            Search titles and descriptions
          </label>
          <input
            id="q"
            name="q"
            defaultValue={params.q}
            placeholder="Search titles and descriptions"
            className="field"
          />
          <button className="btn btn-ink">Search</button>
        </form>
      </header>

      <div className="grid gap-12 pt-6 md:grid-cols-[1fr_15rem]">
        <section>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b rule pb-3" aria-label="Sort">
            {SORTS.map((s) => (
              <Link
                key={s.key}
                href={href(params, { sort: s.key === "new" ? undefined : s.key, page: undefined })}
                className={`smallcaps ${sort === s.key ? "text-ink underline underline-offset-8" : "text-muted hover:text-ink"}`}
              >
                {s.label}
              </Link>
            ))}
          </nav>

          {(params.q || params.tag) && (
            <p className="meta mt-5">
              {results ? `${results.totalItems} ${results.totalItems === 1 ? "story" : "stories"}` : "Stories"}
              {params.q && (
                <>
                  {" "}
                  matching <em className="text-ink">&ldquo;{params.q}&rdquo;</em>
                </>
              )}
              {params.tag && (
                <>
                  {" "}
                  filed under <span className="text-ink">{params.tag}</span>
                </>
              )}
              <Link href="/stories" className="link ml-3">
                Clear
              </Link>
            </p>
          )}

          {!results ? (
            <p className="notice mt-8">
              We couldn&rsquo;t reach the library just now. It may be waking up; try again in a few seconds.
            </p>
          ) : results.items.length === 0 ? (
            <p className="mt-10 italic text-muted">
              Nothing on the shelves matches that.{" "}
              <Link href="/write" className="link not-italic text-ink">
                Maybe it&rsquo;s yours to write.
              </Link>
            </p>
          ) : (
            <div className="divide-y rule">
              {results.items.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          )}

          {results && results.totalPages > 1 && (
            <nav className="meta mt-8 flex items-center justify-between border-t border-ink pt-4" aria-label="Pages">
              {page > 0 ? (
                <Link href={href(params, { page: String(page - 1) })} className="link">
                  ← Earlier
                </Link>
              ) : (
                <span />
              )}
              <span>
                Page {page + 1} of {results.totalPages}
              </span>
              {page + 1 < results.totalPages ? (
                <Link href={href(params, { page: String(page + 1) })} className="link">
                  Later →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </section>

        {tags && tags.length > 0 && (
          <aside>
            <h2 className="smallcaps text-ink">Subjects</h2>
            <ul className="mt-4 space-y-1.5">
              {tags.map((t) => (
                <li key={t.tag} className="flex items-baseline justify-between gap-3">
                  <Link
                    href={href(params, { tag: params.tag === t.tag ? undefined : t.tag, page: undefined })}
                    className={params.tag === t.tag ? "text-accent" : "hover:text-accent"}
                  >
                    {t.tag}
                  </Link>
                  <span className="meta text-xs">{t.count}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
