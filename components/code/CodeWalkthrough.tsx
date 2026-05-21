"use client";

import { useState } from "react";
import type { TalkCodeSnippet } from "@/lib/code-snippets";
import { CodeBlock } from "@/components/code/CodeBlock";

type CodeWalkthroughProps = {
  snippets: TalkCodeSnippet[];
};

export function CodeWalkthrough({ snippets }: CodeWalkthroughProps) {
  const [activeId, setActiveId] = useState(snippets[0]?.id ?? "slots");
  const active = snippets.find((s) => s.id === activeId) ?? snippets[0];

  if (!active) return null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <nav className="flex shrink-0 flex-wrap gap-2">
        {snippets.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveId(s.id)}
            className={`rounded-lg border px-3 py-1.5 text-left text-xs transition ${
              s.id === activeId
                ? "border-cyan-500/50 bg-cyan-950/50 text-cyan-100"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            {s.title}
          </button>
        ))}
      </nav>
      <div className="min-h-0 flex-1">
        <CodeBlock snippet={active} />
      </div>
    </div>
  );
}
