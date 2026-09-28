"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-display text-5xl tracking-tight">Something went wrong</h1>
      <p className="mt-4 text-lg text-ink-soft">
        The page didn&rsquo;t load properly. It&rsquo;s probably temporary.
      </p>
      <button onClick={reset} className="btn btn-ink mt-8">
        Try again
      </button>
    </div>
  );
}
