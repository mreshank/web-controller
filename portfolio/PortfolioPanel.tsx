"use client";

import Link from "next/link";
import { PORTFOLIO_BEACONS, type PortfolioBeacon } from "@/portfolio/data";
import { playUiClick } from "@/portfolio/portfolio-sounds";
import { usePortfolioPanelGamepad } from "@/portfolio/usePortfolioPanelGamepad";

type Props = {
  beacon: PortfolioBeacon;
  visited: Set<string>;
  onClose: () => void;
};

export function PortfolioPanel({ beacon, visited, onClose }: Props) {
  usePortfolioPanelGamepad(true, onClose);
  const chapterIdx = PORTFOLIO_BEACONS.findIndex((b) => b.id === beacon.id) + 1;

  const click = () => playUiClick();

  return (
    <div className="mc-book-backdrop" role="dialog" aria-modal="true" aria-labelledby="mc-book-title">
      <article className="mc-book">
        <header className="mc-book__header">
          <div className="mc-book__icon" aria-hidden>
            📖
          </div>
          <div className="mc-book__headtext">
            <p className="mc-book__quest">
              Quest {chapterIdx}/{PORTFOLIO_BEACONS.length} — {beacon.kind}
            </p>
            <h2 id="mc-book-title" className="mc-book__title">
              {beacon.title}
            </h2>
            <p className="mc-book__subtitle">{beacon.subtitle}</p>
          </div>
        </header>

        <div className="mc-book__hook">{beacon.hook}</div>

        <div className="mc-book__body">
          <p className="mc-book__lead">{beacon.body}</p>

          {beacon.highlights && beacon.highlights.length > 0 ? (
            <div className="mc-book__stats">
              {beacon.highlights.map((h) => (
                <div key={h.label} className="mc-book__stat">
                  <span className="mc-book__stat-k">{h.label}</span>
                  <span className="mc-book__stat-v">{h.value}</span>
                </div>
              ))}
            </div>
          ) : null}

          {beacon.timeline && beacon.timeline.length > 0 ? (
            <section className="mc-book__section">
              <h3 className="mc-book__section-title">◆ Timeline</h3>
              <ul className="mc-book__timeline">
                {beacon.timeline.map((t) => (
                  <li key={`${t.period}-${t.org}`}>
                    <span className="mc-book__time">{t.period}</span>
                    <strong>
                      {t.role} @ {t.org}
                    </strong>
                    <p>{t.detail}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {beacon.skills && beacon.skills.length > 0 ? (
            <section className="mc-book__section">
              <h3 className="mc-book__section-title">◆ Skills</h3>
              <ul className="mc-book__skills">
                {beacon.skills.map((sk) => (
                  <li key={sk.name}>
                    <div className="mc-book__skill-row">
                      <span>{sk.name}</span>
                      <span>{sk.pct}</span>
                    </div>
                    <div className="mc-book__skill-bar">
                      <span style={{ width: `${sk.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {beacon.projects && beacon.projects.length > 0 ? (
            <section className="mc-book__section">
              <h3 className="mc-book__section-title">◆ Projects</h3>
              <div className="mc-book__projects">
                {beacon.projects.map((pr) => (
                  <div key={pr.name} className="mc-book__project">
                    <h4>{pr.name}</h4>
                    {pr.stack ? <code>{pr.stack}</code> : null}
                    <p>{pr.desc}</p>
                    {pr.href ? (
                      pr.href.startsWith("http") ? (
                        <a
                          href={pr.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={click}
                        >
                          [ Open ]
                        </a>
                      ) : (
                        <Link href={pr.href} onClick={click}>
                          [ Open ]
                        </Link>
                      )
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {beacon.sections?.map((sec) => (
            <section key={sec.heading} className="mc-book__section">
              <h3 className="mc-book__section-title">◆ {sec.heading}</h3>
              <p>{sec.body}</p>
            </section>
          ))}

          <section className="mc-book__section">
            <h3 className="mc-book__section-title">◆ Notes</h3>
            <ul className="mc-book__list">
              {beacon.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="mc-book__footer">
          <div className="mc-book__dots" aria-label="Quest progress">
            {PORTFOLIO_BEACONS.map((ch) => (
              <span
                key={ch.id}
                className={`mc-book__dot${visited.has(ch.id) ? " is-done" : ""}${ch.id === beacon.id ? " is-here" : ""}`}
                title={ch.title}
              />
            ))}
          </div>
          <div className="mc-book__actions">
            {beacon.links?.map((link) => {
              const external = link.href.startsWith("http");
              return external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mc-btn"
                  onClick={click}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="mc-btn" onClick={click}>
                  {link.label}
                </Link>
              );
            })}
            <button type="button" className="mc-btn mc-btn--primary" onClick={onClose}>
              Close [ O ]
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
}
