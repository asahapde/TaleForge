import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">
            Tale<span className="italic text-accent">forge</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Stories that fork. Start one, or pick up where someone else left off.
          </p>
        </div>
        <div className="meta space-y-1.5">
          <p className="smallcaps mb-3 text-ink">Read</p>
          <p>
            <Link href="/stories" className="hover:text-ink">
              The library
            </Link>
          </p>
          <p>
            <Link href="/stories?sort=branching" className="hover:text-ink">
              Most branched
            </Link>
          </p>
        </div>
        <div className="meta space-y-1.5">
          <p className="smallcaps mb-3 text-ink">Write</p>
          <p>
            <Link href="/write" className="hover:text-ink">
              Begin a story
            </Link>
          </p>
          <p>
            <a href="https://github.com/asahapde/TaleForge" className="hover:text-ink">
              Source on GitHub
            </a>
          </p>
        </div>
      </div>
      <div className="border-t rule">
        <p className="meta mx-auto max-w-6xl px-5 py-4 text-xs">
          Set in Instrument Serif, Literata and IBM Plex Sans.
        </p>
      </div>
    </footer>
  );
}
