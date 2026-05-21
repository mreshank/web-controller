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
    <div className="absolute inset-y-0 right-0 z-30 flex w-full max-w-md flex-col border-l border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-md">
      <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Speaker notes · N to close
          </p>
          <h2 className="mt-1 text-sm font-medium leading-snug text-white">
            {TALK_TITLE}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded border border-white/15 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
        >
          Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 text-xs text-white/80">
        <section className="space-y-4">
          {TALK_SECTIONS.map((section) => (
            <div key={section.time}>
              <p className="font-mono text-[10px] text-cyan-400/90">{section.time}</p>
              <p className="mt-0.5 font-medium text-white">{section.title}</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-white/60">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-6 border-t border-white/10 pt-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Q&A cheatsheet
          </p>
          <dl className="mt-2 space-y-3">
            {QA_CHEATSHEET.map((item) => (
              <div key={item.q}>
                <dt className="font-medium text-white/90">{item.q}</dt>
                <dd className="mt-0.5 text-white/55">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
