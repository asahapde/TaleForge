"use client";

import { useState } from "react";

export interface ChapterFields {
  title: string;
  choiceLabel: string;
  content: string;
}

export function wordCount(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Title, choice line and body for a chapter; also used for a new story's opening chapter. */
export function ChapterFieldset({
  value,
  onChange,
  withChoice,
  contentPlaceholder = "Write the chapter. Leave a blank line between paragraphs.",
}: {
  value: ChapterFields;
  onChange: (v: ChapterFields) => void;
  withChoice: boolean;
  contentPlaceholder?: string;
}) {
  const words = wordCount(value.content);
  return (
    <div className="space-y-6">
      {withChoice && (
        <div>
          <label htmlFor="choice" className="field-label">
            The choice readers will see
          </label>
          <input
            id="choice"
            required
            maxLength={140}
            value={value.choiceLabel}
            onChange={(e) => onChange({ ...value, choiceLabel: e.target.value })}
            placeholder="e.g. Follow the sound down the stairs"
            className="field field-serif italic"
          />
          <p className="field-hint">
            Readers pick between paths by this line, so phrase it as what the character does next.
          </p>
        </div>
      )}
      <div>
        <label htmlFor="chapter-title" className="field-label">
          Chapter title
        </label>
        <input
          id="chapter-title"
          required
          maxLength={120}
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="field font-display !text-2xl"
        />
      </div>
      <div>
        <label htmlFor="content" className="field-label">
          Text
        </label>
        <textarea
          id="content"
          required
          minLength={50}
          maxLength={60000}
          rows={18}
          value={value.content}
          onChange={(e) => onChange({ ...value, content: e.target.value })}
          placeholder={contentPlaceholder}
          className="field field-serif min-h-[24rem]"
        />
        <p className="field-hint flex justify-between">
          <span>Plain text. A line with just *** makes a scene break.</span>
          <span>
            {words.toLocaleString()} {words === 1 ? "word" : "words"}
          </span>
        </p>
      </div>
    </div>
  );
}

export function useChapterFields(initial?: Partial<ChapterFields>) {
  return useState<ChapterFields>({ title: "", choiceLabel: "", content: "", ...initial });
}
