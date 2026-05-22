"use client";

import Link from "next/link";
import type { StoryChapter } from "@/story/chapters";
import { useStoryPanelGamepad } from "@/story/useStoryPanelGamepad";

type StoryPanelProps = {
  chapter: StoryChapter;
  onClose: () => void;
};

export function StoryPanel({ chapter, onClose }: StoryPanelProps) {
  useStoryPanelGamepad(true, onClose);

  return (
    <div className="gp-modal-backdrop">
      <article
        className="gp-modal gp-modal--story"
        style={{ borderColor: `${chapter.color}66`, maxWidth: "32rem" }}
      >
        <p className="gp-modal__eyebrow" style={{ color: chapter.color }}>
          {chapter.subtitle}
        </p>
        <h2 className="gp-modal__title">{chapter.title}</h2>
        <p className="gp-story-hook" style={{ color: chapter.color }}>
          {chapter.hook}
        </p>
        <p className="gp-modal__body">{chapter.body}</p>
        <ul className="gp-story-bullets">
          {chapter.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="gp-story-actions">
          {chapter.demoHref ? (
            <Link
              href={chapter.demoHref}
              className="gp-btn gp-btn--accent"
              style={{ borderColor: `${chapter.color}55` }}
            >
              {chapter.demoLabel ?? "Try demo"} →
            </Link>
          ) : null}
          <button type="button" className="gp-btn" onClick={onClose}>
            Close (○ or Esc)
          </button>
        </div>
      </article>
    </div>
  );
}
