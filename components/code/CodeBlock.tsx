import type { TalkCodeSnippet } from "@/lib/code-snippets";

type CodeBlockProps = {
  snippet: TalkCodeSnippet;
};

export function CodeBlock({ snippet }: CodeBlockProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900/80">
      <header className="shrink-0 border-b border-white/10 px-4 py-3">
        <p className="font-mono text-[10px] text-white/40">{snippet.path}</p>
        <h3 className="mt-1 text-sm font-semibold text-white">{snippet.title}</h3>
        <p className="mt-0.5 text-xs text-white/55">{snippet.subtitle}</p>
      </header>
      <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed sm:text-sm md:text-[15px]">
        <code>
          {snippet.lines.map((line) => (
            <div
              key={line.number}
              className={
                line.highlight
                  ? "bg-amber-500/15 text-amber-100"
                  : "text-white/75"
              }
            >
              <span className="mr-4 inline-block w-8 select-none text-right text-white/25">
                {line.number}
              </span>
              {line.text || " "}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
