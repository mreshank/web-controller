import type { TalkCodeSnippet } from "@/lib/code-snippets";

type CodeBlockProps = {
  snippet: TalkCodeSnippet;
};

export function CodeBlock({ snippet }: CodeBlockProps) {
  return (
    <div className="gp-code-block">
      <header className="gp-code-block__head">
        <p className="gp-code-block__path">{snippet.path}</p>
        <h3 className="gp-code-block__title">{snippet.title}</h3>
        <p className="gp-code-block__sub">{snippet.subtitle}</p>
      </header>
      <pre className="gp-code-block__body">
        <code>
          {snippet.lines.map((line) => (
            <span
              key={line.number}
              className={
                line.highlight ? "gp-code-line gp-code-line--hi" : "gp-code-line"
              }
            >
              <span className="gp-code-line__n">{line.number}</span>
              {line.text || " "}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
