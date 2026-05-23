"use client";

import Link from "next/link";
import type { PortfolioBeacon } from "@/portfolio/data";
import { usePortfolioPanelGamepad } from "@/portfolio/usePortfolioPanelGamepad";

type Props = {
  beacon: PortfolioBeacon;
  onClose: () => void;
};

export function PortfolioPanel({ beacon, onClose }: Props) {
  usePortfolioPanelGamepad(true, onClose);

  return (
    <div className="gp-modal-backdrop">
      <article
        className="gp-modal gp-modal--portfolio"
        style={{ borderColor: `${beacon.color}66`, maxWidth: "34rem" }}
      >
        <p className="gp-modal__eyebrow" style={{ color: beacon.color }}>
          {beacon.subtitle}
        </p>
        <h2 className="gp-modal__title">{beacon.title}</h2>
        <p className="gp-story-hook" style={{ color: beacon.color }}>
          {beacon.hook}
        </p>
        <p className="gp-modal__body">{beacon.body}</p>
        <ul className="gp-story-bullets">
          {beacon.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        {beacon.links && beacon.links.length > 0 ? (
          <div className="gp-story-actions">
            {beacon.links.map((link) => {
              const external = link.href.startsWith("http");
              return external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="gp-btn gp-btn--accent"
                >
                  {link.label} ↗
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="gp-btn gp-btn--accent">
                  {link.label} →
                </Link>
              );
            })}
          </div>
        ) : null}
        <button type="button" className="gp-btn" onClick={onClose} style={{ marginTop: "1rem" }}>
          Close (○ or Esc)
        </button>
      </article>
    </div>
  );
}
