import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="smallcaps text-accent">404</p>
      <h1 className="mt-3 font-display text-6xl tracking-tight">A page torn out</h1>
      <p className="mt-4 text-lg text-ink-soft">Whatever was here isn&rsquo;t anymore, or never was.</p>
      <Link href="/stories" className="btn btn-ink mt-8">
        Back to the library
      </Link>
    </div>
  );
}
