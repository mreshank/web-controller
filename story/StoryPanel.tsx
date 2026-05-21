"use client";

import type { StoryChapter } from "@/story/chapters";

type StoryPanelProps = {
  chapter: StoryChapter;
  onClose: () => void;
};

export function StoryPanel({ chapter, onClose }: StoryPanelProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <article
        className="max-h-[85vh] max-w-lg overflow-y-auto rounded-2xl border p-6 shadow-2xl"
        style={{ borderColor: `${chapter.color}55` }}
      >
        <p className="font-mono text-xs uppercase tracking-wider" style={{ color: chapter.color }}>
          {chapter.subtitle}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{chapter.title}</h2>
        <p className="mt-4 leading-relaxed text-white/75">{chapter.body}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-white/20 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          Close (Esc or ○)
        </button>
      </article>
    </div>
  );
}
