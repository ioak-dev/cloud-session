import * as React from "react";

import { ReferencesPage, SIDE_IDS, SideCharacterPage, SideReferencesPage, SidePage, WispPage } from "@/design/nix/NixBenchView";
import { CharacterPage } from "@/design/nix/side-character-page";
import { castMember } from "@/design/nix/side-companion";
import { Shell } from "@/studio/Shell";

/** The studio's pages, by hash: the main character (Wisp, on its ribbon wings), the side
 *  characters, the references, and Wisp on two pairs of butterfly wings as an alternate main
 *  character, kept for reference. */
const PAGES = [
  { hash: "#/wisp", label: "Wisp", page: () => <WispPage wings="ribbon" /> },
  { hash: "#/side", label: "Side characters", page: () => <SidePage /> },
  { hash: "#/side-references", label: "Side characters · References", page: () => <SideReferencesPage /> },
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
  const sideId = hash.startsWith("#/side/") ? decodeURIComponent(hash.slice(7)) : undefined;
  const cast = sideId ? castMember(sideId) : undefined;
  const character = cast ? cast.slug : sideId && SIDE_IDS.includes(sideId) ? sideId : undefined;
  const current =
    (character ? PAGES.find((p) => p.hash === "#/side") : PAGES.find((p) => p.hash === (ALIASES[hash] ?? hash))) ??
    PAGES[0];
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
      <div key={character ?? current.hash} className="studio-page">
        {cast ? <CharacterPage m={cast} /> : character ? <SideCharacterPage id={character} /> : current.page()}
      </div>
    </Shell>
  );
}
