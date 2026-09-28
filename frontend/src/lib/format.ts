const numberFormat = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export function compact(n: number) {
  return numberFormat.format(n);
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${compact(n)} ${n === 1 ? one : many}`;
}

const dateFormat = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" });

export function longDate(iso: string) {
  return dateFormat.format(new Date(iso));
}

export function timeAgo(iso: string, now = Date.now()) {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return longDate(iso);
}

const ROMAN: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** Chapter numbers are set in roman numerals, as in a printed book. */
export function roman(n: number) {
  let out = "";
  let rest = n;
  for (const [value, glyph] of ROMAN) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out || String(n);
}

/** Paragraphs are separated by blank lines. */
export function paragraphs(content: string) {
  return content
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function readingMinutes(content: string) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 230));
}
