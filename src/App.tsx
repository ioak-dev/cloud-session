import * as React from "react";

import { SidePage, WispPage } from "@/design/nix/NixBenchView";
import { Shell } from "@/studio/Shell";

/** The studio's pages, by hash: the main character, its ribbon-wing clone, the side characters. */
const PAGES = [
  { hash: "#/wisp", label: "Wisp", page: () => <WispPage wings="pairs" /> },
  { hash: "#/ribbon", label: "Wisp · Ribbon", page: () => <WispPage wings="ribbon" /> },
  { hash: "#/side", label: "Side characters", page: () => <SidePage /> },
] as const;

function useHash() {
  const [hash, setHash] = React.useState(() => window.location.hash);
  React.useEffect(() => {
    const on = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export function App() {
  const hash = useHash();
  const current = PAGES.find((p) => p.hash === hash) ?? PAGES[0];
  return (
    <Shell
      nav={
        <nav aria-label="Pages" className="flex flex-wrap gap-1">
          {PAGES.map((p) => (
            <a
              key={p.hash}
              href={p.hash}
              aria-current={p === current ? "page" : undefined}
              className="filter-seg no-underline"
            >
              {p.label}
            </a>
          ))}
        </nav>
      }
    >
      {/* keyed so each page starts with its own bench state; `studio-page` lets the browser skip
          the blocks of the page that are off screen (studio.css) */}
      <div key={current.hash} className="studio-page">
        {current.page()}
      </div>
    </Shell>
  );
}
