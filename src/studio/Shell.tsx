import { useEffect, useState, type ReactNode } from "react";

import { SCHEMES } from "@/design/nix/theme";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (theme === "light") root.classList.add("light");
  if (theme === "dark") root.classList.add("dark");
}

export function Shell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [scheme, setScheme] = useState(SCHEMES[0].id);
  const [custom, setCustom] = useState({ primary: "#5b5fc7", accent: "#ff8f7a" });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const s = scheme === "custom" ? custom : SCHEMES.find((x) => x.id === scheme)!;
    const root = document.documentElement.style;
    root.setProperty("--char-primary", s.primary);
    root.setProperty("--char-accent", s.accent);
  }, [scheme, custom]);

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex max-w-[76rem] flex-wrap items-center gap-3 px-5 py-3">
          <p className="instrument m-0 text-foreground">Character studio</p>
          <fieldset className="m-0 ml-auto flex flex-wrap items-center gap-1 border-0 p-0">
            <legend className="sr-only">Character colours</legend>
            <span className="instrument mr-1 text-xs text-muted-foreground">Colours</span>
            {SCHEMES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={scheme === x.id}
                className="filter-seg inline-flex items-center gap-1.5"
                onClick={() => setScheme(x.id)}
              >
                <span aria-hidden className="inline-flex">
                  <span className="size-3 rounded-full" style={{ background: x.primary }} />
                  <span className="-ml-1 size-3 rounded-full" style={{ background: x.accent }} />
                </span>
                {x.label}
              </button>
            ))}
            <label
              className="filter-seg inline-flex items-center gap-1"
              data-on={scheme === "custom"}
            >
              <input
                type="color"
                aria-label="Custom primary"
                value={custom.primary}
                onChange={(e) => {
                  setCustom((c) => ({ ...c, primary: e.target.value }));
                  setScheme("custom");
                }}
                className="size-4 cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="color"
                aria-label="Custom accent"
                value={custom.accent}
                onChange={(e) => {
                  setCustom((c) => ({ ...c, accent: e.target.value }));
                  setScheme("custom");
                }}
                className="size-4 cursor-pointer border-0 bg-transparent p-0"
              />
              Custom
            </label>
          </fieldset>
          <div>
            <fieldset className="m-0 flex gap-1 border-0 p-0">
              <legend className="sr-only">Ground</legend>
              {(["light", "dark", "system"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={theme === mode}
                  className="filter-seg capitalize"
                  onClick={() => setTheme(mode)}
                >
                  {mode}
                </button>
              ))}
            </fieldset>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[76rem] px-5 py-8">{children}</main>
    </div>
  );
}
