import { useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (theme === "light") root.classList.add("light");
  if (theme === "dark") root.classList.add("dark");
}

export function Shell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex max-w-[76rem] flex-wrap items-center gap-3 px-5 py-3">
          <p className="instrument m-0 text-foreground">Character studio</p>
          <div className="ml-auto">
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
