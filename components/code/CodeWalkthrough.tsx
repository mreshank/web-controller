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
    <div>
      <nav className="gp-code-tabs">
        {snippets.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`gp-code-tab${s.id === activeId ? " is-active" : ""}`}
            onClick={() => setActiveId(s.id)}
          >
            {s.title}
          </button>
        ))}
      </nav>
      <CodeBlock snippet={active} />
    </div>
  );
}
