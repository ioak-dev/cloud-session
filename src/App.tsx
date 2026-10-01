import * as React from "react";

import { ReferencesPage, SidePage, WispPage } from "@/design/nix/NixBenchView";
import { Shell } from "@/studio/Shell";

/** The studio's pages, by hash: the main character (Wisp, on its ribbon wings), the side
 *  characters, the references, and Wisp on two pairs of butterfly wings as an alternate main
 *  character, kept for reference. */
const PAGES = [
  { hash: "#/wisp", label: "Wisp", page: () => <WispPage wings="ribbon" /> },
  { hash: "#/side", label: "Side characters", page: () => <SidePage /> },
  { hash: "#/references", label: "References", page: () => <ReferencesPage /> },
  { hash: "#/butterfly", label: "Wisp · Butterfly (reference)", page: () => <WispPage wings="pairs" /> },
] as const;

/** Old links: the ribbon page is now the Wisp page. */
const ALIASES: Record<string, string> = { "#/ribbon": "#/wisp" };

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
  const current = PAGES.find((p) => p.hash === (ALIASES[hash] ?? hash)) ?? PAGES[0];
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
