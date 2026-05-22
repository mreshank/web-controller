import Link from "next/link";
import { StageRouteList } from "@/components/stage/StageRouteList";
import { TALK_TITLE } from "@/lib/talk-outline";

export default function StagePage() {
  return (
    <div className="gp-page">
      <div className="gp-container">
        <p className="gp-eyebrow">Stage launcher</p>
        <h1 className="gp-display" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
          {TALK_TITLE}
        </h1>
        <p className="gp-lead">
          Bookmark before you go on stage. Flow: Demo → Naive → Code → Game finale →
          Q&A.
        </p>

        <StageRouteList />

        <div className="gp-panel gp-panel--callout" style={{ marginTop: "2.5rem" }}>
          <p className="gp-heading" style={{ fontSize: "1rem" }}>
            Day-of checklist
          </p>
          <ul className="gp-drawer__list" style={{ marginTop: "0.75rem" }}>
            <li>Test projector + HDMI at venue</li>
            <li>Press button on controller before each route</li>
            <li>backup-demo.mp4 ready · tab on /backup</li>
            <li>Saturday: no code changes</li>
          </ul>
        </div>

        <p style={{ marginTop: "2rem" }}>
          <Link href="/" className="gp-btn">
            ← Hub
          </Link>
        </p>
      </div>
    </div>
  );
}
