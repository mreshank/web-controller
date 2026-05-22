import Link from "next/link";
import { CodeWalkthrough } from "@/components/code/CodeWalkthrough";
import { getTalkCodeSnippets } from "@/lib/code-snippets";

export default function CodePage() {
  const snippets = getTalkCodeSnippets();

  return (
    <div className="gp-page" style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <header className="gp-page-header">
        <div>
          <p className="gp-eyebrow">Code walkthrough</p>
          <h1 className="gp-heading">React + 60fps — refs, one poll loop</h1>
        </div>
        <div className="gp-page-header__actions">
          <Link href="/demo" className="gp-btn gp-btn--accent">
            Talk demo
          </Link>
          <Link href="/naive" className="gp-btn gp-btn--naive">
            Naive
          </Link>
          <Link href="/stage" className="gp-btn">
            Stage
          </Link>
        </div>
      </header>

      <main className="gp-container" style={{ flex: 1, paddingBottom: "2rem" }}>
        <CodeWalkthrough snippets={snippets} />
      </main>

      <footer
        className="gp-mono"
        style={{
          padding: "0.75rem",
          textAlign: "center",
          fontSize: "0.65rem",
          color: "var(--gp-text-faint)",
          borderTop: "1px solid var(--gp-border)",
        }}
      >
        Highlighted lines = call out on stage
      </footer>
    </div>
  );
}
