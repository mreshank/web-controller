"use client";

import {
  QA_CHEATSHEET,
  TALK_SECTIONS,
  TALK_TITLE,
} from "@/lib/talk-outline";

type PresenterNotesProps = {
  open: boolean;
  onClose: () => void;
};

export function PresenterNotes({ open, onClose }: PresenterNotesProps) {
  if (!open) return null;

  return (
    <aside className="gp-drawer">
      <header className="gp-drawer__head">
        <div>
          <p className="gp-eyebrow" style={{ margin: 0 }}>
            Speaker notes
          </p>
          <h2 className="gp-heading" style={{ marginTop: "0.35rem", fontSize: "0.95rem" }}>
            {TALK_TITLE}
          </h2>
        </div>
        <button type="button" className="gp-btn" onClick={onClose}>
          Close
        </button>
      </header>
      <div className="gp-drawer__scroll">
        {TALK_SECTIONS.map((section) => (
          <section key={section.time} className="gp-drawer__section">
            <p className="gp-drawer__time">{section.time}</p>
            <p className="gp-drawer__section-title">{section.title}</p>
            <ul className="gp-drawer__list">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
        <section className="gp-drawer__section">
          <p className="gp-section-label">Q&A</p>
          <dl className="gp-drawer__qa">
            {QA_CHEATSHEET.map((item) => (
              <div key={item.q}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </aside>
  );
}
