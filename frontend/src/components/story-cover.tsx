const CLOTHS = [
  { bg: "#6d231c", ink: "#f1e4cf" },
  { bg: "#1f2f45", ink: "#e9dfc9" },
  { bg: "#28402f", ink: "#eee3c8" },
  { bg: "#8f6320", ink: "#fbf1dc" },
  { bg: "#3a4146", ink: "#ece4d4" },
  { bg: "#4b2b3f", ink: "#f0e2d6" },
  { bg: "#1f4644", ink: "#e8e0c8" },
  { bg: "#7f3a1d", ink: "#f6e8d2" },
];

const SIZES = {
  sm: { box: "w-20", title: "text-[0.8rem] leading-[1.05]", author: "hidden", pad: "px-1.5 py-2" },
  md: { box: "w-36", title: "text-[1.45rem] leading-[1.02]", author: "text-[0.55rem]", pad: "p-3.5" },
  lg: { box: "w-52 sm:w-60", title: "text-[2.1rem] leading-[1]", author: "text-[0.62rem]", pad: "p-5" },
};

/** A cloth-bound book cover set in type, colored deterministically per story. */
export function StoryCover({
  id,
  title,
  author,
  size = "md",
}: {
  id: number;
  title: string;
  author?: string;
  size?: keyof typeof SIZES;
}) {
  const cloth = CLOTHS[id % CLOTHS.length];
  const s = SIZES[size];
  return (
    <div
      aria-hidden
      className={`${s.box} relative aspect-[2/3] shrink-0 overflow-hidden rounded-[2px] shadow-[2px_3px_0_rgba(28,25,21,0.18)]`}
      style={{
        backgroundColor: cloth.bg,
        color: cloth.ink,
        backgroundImage: [
          "linear-gradient(90deg, rgba(0,0,0,0.28) 0, rgba(0,0,0,0.05) 5%, rgba(255,255,255,0.06) 7%, transparent 11%)",
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px)",
          "repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 3px)",
        ].join(","),
      }}
    >
      <div
        className={`absolute inset-[7%] flex flex-col items-center justify-between border text-center ${s.pad}`}
        style={{ borderColor: `${cloth.ink}55` }}
      >
        <span className="block h-px w-6" style={{ backgroundColor: `${cloth.ink}99` }} />
        <span className={`font-display ${s.title} hyphens-auto [overflow-wrap:break-word]`} lang="en">
          {title}
        </span>
        <span className={`smallcaps ${s.author} tracking-[0.2em]`} style={{ color: `${cloth.ink}cc` }}>
          {author ?? ""}
        </span>
      </div>
    </div>
  );
}
