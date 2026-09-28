import { ChapterOwnerTools } from "@/components/owner-tools";
import { Prose } from "@/components/prose";
import { ReaderShell } from "@/components/reader-shell";
import { ViewTracker } from "@/components/view-tracker";
import { WriteBranchPrompt } from "@/components/write-branch-prompt";
import { compact, longDate, readingMinutes, roman } from "@/lib/format";
import type { ChapterDetail } from "@/lib/types";
import Link from "next/link";

export function ChapterView({ chapter }: { chapter: ChapterDetail }) {
  const base = `/stories/${chapter.storyId}`;
  const number = chapter.depth + 1;

  return (
    <ReaderShell storyId={chapter.storyId} storyTitle={chapter.storyTitle}>
      {chapter.storyPublished && <ViewTracker path={`/chapters/${chapter.id}/view`} />}
      <article className="mx-auto max-w-[40rem] px-5 pb-20 pt-12">
        {chapter.path.length > 0 && (
          <nav aria-label="Your path so far" className="mb-12 font-sans text-[0.8125rem]">
            <p className="smallcaps" style={{ color: "var(--reader-muted)" }}>
              The path so far
            </p>
            <ol className="mt-3 space-y-1.5 border-l pl-4" style={{ borderColor: "var(--reader-rule)" }}>
              {chapter.path.map((step, i) => (
                <li key={step.id} className="flex gap-3">
                  <span className="w-6 shrink-0 text-right" style={{ color: "var(--reader-muted)" }}>
                    {roman(i + 1)}
                  </span>
                  <Link href={`${base}/chapters/${step.id}`} className="hover:underline">
                    {step.choiceLabel && (
                      <span className="mr-1.5 italic" style={{ color: "var(--reader-muted)" }}>
                        {step.choiceLabel} →
                      </span>
                    )}
                    {step.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <header className="text-center">
          <p className="smallcaps" style={{ color: "var(--reader-accent)" }}>
            Chapter {roman(number)}
          </p>
          {chapter.choiceLabel && (
            <p className="mt-5 font-serif text-lg italic" style={{ color: "var(--reader-muted)" }}>
              &ldquo;{chapter.choiceLabel}&rdquo;
            </p>
          )}
          <h1 className="mt-3 font-display text-5xl leading-[1.05] tracking-tight sm:text-[3.5rem]">
            {chapter.title}
          </h1>
          <p className="mt-5 font-sans text-[0.8125rem]" style={{ color: "var(--reader-muted)" }}>
            by{" "}
            <Link href={`/writers/${chapter.author.username}`} className="underline underline-offset-2">
              {chapter.author.displayName}
            </Link>
            {chapter.byStoryAuthor ? (
              chapter.depth > 0 && <> · the author&rsquo;s path</>
            ) : (
              <> · a branch of {chapter.storyTitle}</>
            )}
            <span className="mx-2">·</span>
            {readingMinutes(chapter.content)} min read
          </p>
          <div className="mx-auto mt-8 w-12 border-t" style={{ borderColor: "var(--reader-rule)" }} />
        </header>

        <div className="mt-10">
          <Prose content={chapter.content} dropcap />
        </div>

        <p className="mt-12 text-center font-display text-2xl" style={{ color: "var(--reader-muted)" }} aria-hidden>
          ❦
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 font-sans text-xs" style={{ color: "var(--reader-muted)" }}>
          <span>
            {compact(chapter.views)} reads · written {longDate(chapter.createdAt)}
          </span>
          <ChapterOwnerTools
            storyId={chapter.storyId}
            chapterId={chapter.id}
            parentId={chapter.parentId}
            chapterAuthorId={chapter.author.id}
            storyAuthorId={chapter.storyAuthor.id}
            hasChoices={chapter.choices.length > 0}
          />
        </div>

        <section aria-labelledby="next-heading" className="mt-14 border-t pt-10" style={{ borderColor: "var(--reader-ink)" }}>
          <h2 id="next-heading" className="font-display text-4xl">
            {chapter.choices.length > 0 ? "What happens next?" : "The path ends here, for now."}
          </h2>

          {chapter.choices.length > 0 ? (
            <ol className="mt-6">
              {chapter.choices.map((choice, i) => (
                <li key={choice.id} className="border-b" style={{ borderColor: "var(--reader-rule)" }}>
                  <Link href={`${base}/chapters/${choice.id}`} className="group flex gap-4 py-5">
                    <span className="smallcaps w-5 shrink-0 pt-2" style={{ color: "var(--reader-muted)" }}>
                      {String.fromCharCode(97 + i)}.
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[1.7rem] italic leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                        {choice.choiceLabel}
                      </span>
                      <span className="mt-1.5 block font-sans text-[0.8125rem]" style={{ color: "var(--reader-muted)" }}>
                        Chapter {roman(number + 1)}: {choice.title}
                        <span className="mx-2">·</span>
                        {choice.byStoryAuthor ? (
                          <span style={{ color: "var(--color-moss)" }} className="font-medium">
                            the author&rsquo;s path
                          </span>
                        ) : (
                          <>by {choice.author.displayName}</>
                        )}
                        <span className="mx-2">·</span>
                        {compact(choice.views)} reads
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 font-serif text-lg" style={{ color: "var(--reader-muted)" }}>
              Nobody has written past this point yet.
            </p>
          )}

          <WriteBranchPrompt
            storyId={chapter.storyId}
            chapterId={chapter.id}
            storyAuthorId={chapter.storyAuthor.id}
            open={chapter.storyOpenToBranches}
            hasChoices={chapter.choices.length > 0}
          />

          <p className="mt-10 font-sans text-[0.8125rem]">
            <Link href={`${base}#map`} className="underline underline-offset-2" style={{ color: "var(--reader-muted)" }}>
              See every path on the story map
            </Link>
          </p>
        </section>
      </article>
    </ReaderShell>
  );
}
