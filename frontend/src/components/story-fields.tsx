"use client";

export interface StoryFields {
  title: string;
  description: string;
  tags: string;
  openToBranches: boolean;
}

export function parseTags(raw: string) {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function StoryFieldset({ value, onChange }: { value: StoryFields; onChange: (v: StoryFields) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="field-label">
          Title
        </label>
        <input
          id="title"
          required
          minLength={2}
          maxLength={120}
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="field font-display !text-3xl"
        />
      </div>
      <div>
        <label htmlFor="description" className="field-label">
          Description
        </label>
        <textarea
          id="description"
          required
          minLength={10}
          maxLength={600}
          rows={3}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="What the story is about, in a sentence or two. This is what readers see in the library."
          className="field field-serif"
        />
        <p className="field-hint text-right">{value.description.length}/600</p>
      </div>
      <div>
        <label htmlFor="tags" className="field-label">
          Tags
        </label>
        <input
          id="tags"
          value={value.tags}
          onChange={(e) => onChange({ ...value, tags: e.target.value })}
          placeholder="mystery, coastal, ghost-story"
          className="field"
        />
        <p className="field-hint">Up to six, separated by commas.</p>
      </div>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={value.openToBranches}
          onChange={(e) => onChange({ ...value, openToBranches: e.target.checked })}
          className="mt-1 h-4 w-4 accent-[var(--color-ink)]"
        />
        <span>
          <span className="field-label mb-0">Let other writers add branches</span>
          <span className="field-hint mt-0 block">
            Anyone signed in can write an alternative next chapter after any chapter. You can delete branches from
            your story, and turn this off at any time.
          </span>
        </span>
      </label>
    </div>
  );
}
