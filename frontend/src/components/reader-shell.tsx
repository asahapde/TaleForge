"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Theme = "paper" | "white" | "night";
const SIZES = [1.0625, 1.1875, 1.3125, 1.4375];
const PREFS_KEY = "taleforge.reader";

export function ReaderShell({
  storyId,
  storyTitle,
  children,
}: {
  storyId: number;
  storyTitle: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("paper");
  const [size, setSize] = useState(1);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}");
      if (saved.theme) setTheme(saved.theme);
      if (typeof saved.size === "number") setSize(Math.min(Math.max(saved.size, 0), SIZES.length - 1));
    } catch {
      // Ignore unreadable preferences.
    }
  }, []);

  function update(next: { theme?: Theme; size?: number }) {
    const merged = { theme: next.theme ?? theme, size: next.size ?? size };
    setTheme(merged.theme);
    setSize(merged.size);
    localStorage.setItem(PREFS_KEY, JSON.stringify(merged));
  }

  return (
    <div
      className={`reader-${theme} min-h-screen transition-colors`}
      style={
        {
          backgroundColor: "var(--reader-bg)",
          color: "var(--reader-ink)",
          "--reader-size": `${SIZES[size]}rem`,
          "--tree-bg": "var(--reader-bg)",
        } as React.CSSProperties
      }
    >
      <div
        className="sticky top-0 z-10 border-b backdrop-blur-sm"
        style={{ borderColor: "var(--reader-rule)", backgroundColor: "color-mix(in srgb, var(--reader-bg) 92%, transparent)" }}
      >
        <div className="mx-auto flex h-11 max-w-3xl items-center gap-4 px-5 font-sans text-[0.8125rem]">
          <Link href={`/stories/${storyId}`} className="truncate hover:underline" style={{ color: "var(--reader-muted)" }}>
            ← {storyTitle}
          </Link>
          <div className="ml-auto flex items-center gap-1" role="group" aria-label="Text size">
            <button
              onClick={() => update({ size: Math.max(size - 1, 0) })}
              disabled={size === 0}
              className="rounded-[2px] px-2 py-1 disabled:opacity-30"
              aria-label="Smaller text"
            >
              A<span className="text-[0.65rem]">−</span>
            </button>
            <button
              onClick={() => update({ size: Math.min(size + 1, SIZES.length - 1) })}
              disabled={size === SIZES.length - 1}
              className="rounded-[2px] px-2 py-1 text-base disabled:opacity-30"
              aria-label="Larger text"
            >
              A<span className="text-[0.7rem]">+</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Page color">
            {(["paper", "white", "night"] as Theme[]).map((t) => (
              <button
                key={t}
                role="radio"
                aria-checked={theme === t}
                aria-label={t}
                title={t[0].toUpperCase() + t.slice(1)}
                onClick={() => update({ theme: t })}
                className={`h-5 w-5 rounded-full border ${theme === t ? "ring-1 ring-offset-2" : ""}`}
                style={
                  {
                    backgroundColor: t === "paper" ? "#f5efe3" : t === "white" ? "#fffefb" : "#1b1916",
                    borderColor: "var(--reader-rule)",
                    "--tw-ring-color": "var(--reader-accent)",
                    "--tw-ring-offset-color": "var(--reader-bg)",
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
