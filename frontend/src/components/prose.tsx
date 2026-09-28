import { paragraphs } from "@/lib/format";
import { Fragment } from "react";

const SCENE_BREAK = /^(\*\s*){1,3}$|^#$/;

/** Renders plain chapter text: blank lines separate paragraphs, a lone "***" is a scene break. */
export function Prose({ content, dropcap = false }: { content: string; dropcap?: boolean }) {
  const paras = paragraphs(content);
  return (
    <div className={`tale ${dropcap ? "dropcap" : ""}`}>
      {paras.map((p, i) => {
        if (SCENE_BREAK.test(p)) {
          return (
            <p key={i} className="scene text-center text-[var(--reader-muted)]" aria-label="Scene break">
              ⁂
            </p>
          );
        }
        const afterBreak = i > 0 && SCENE_BREAK.test(paras[i - 1]);
        const lines = p.split("\n");
        return (
          <p key={i} className={afterBreak ? "scene" : undefined}>
            {lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
