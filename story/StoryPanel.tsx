"use client";

import type { StoryChapter } from "@/story/chapters";

type StoryPanelProps = {
  chapter: StoryChapter;
  onClose: () => void;
};

export function StoryPanel({ chapter, onClose }: StoryPanelProps) {
  return (
    <div className="gp-modal-backdrop">
      <article
        className="gp-modal gp-modal--story"
        style={{ borderColor: `${chapter.color}44` }}
      >
        <p
          className="gp-modal__eyebrow"
          style={{ color: chapter.color }}
        >
          {chapter.subtitle}
        </p>
        <h2 className="gp-modal__title">{chapter.title}</h2>
        <p className="gp-modal__body">{chapter.body}</p>
        <button
          type="button"
          className="gp-btn gp-btn--block"
          style={{ marginTop: "1.25rem" }}
          onClick={onClose}
        >
          Close (Esc)
        </button>
      </article>
    </div>
  );
}
