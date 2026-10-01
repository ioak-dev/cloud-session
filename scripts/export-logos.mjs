/**
 * Writes every app icon proposal in `src/design/nix/wisp-logo.tsx` to `docs/logo/` as standalone
 * SVG in the Sparkles scheme: `<id>.svg` (the app icon) and `<id>-favicon.svg` (the 16–32px
 * drawing). The chosen icon's set (`APP_ICON_SET`) is also written as `app-icon.svg`,
 * `app-icon-round.svg` and `app-icon-mono.svg`, each with its `-favicon` drawing. Run with
 * `npm run logos`.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, "docs/logo");
const server = await createServer({ root, server: { middlewareMode: true }, appType: "custom" });
try {
  const { APP_ICON_SET, LOGOS, LOGO_VARIANTS, LOGOS_BUTTERFLY, LogoMark, K_SPARKLES } = await server.ssrLoadModule(
    "/src/design/nix/wisp-logo.tsx",
  );
  await mkdir(out, { recursive: true });
  /* the chosen icon under fixed names: the app icon, the circle, the one-colour mark */
  const chosen = APP_ICON_SET.map((logo, i) => [logo, ["app-icon", "app-icon-round", "app-icon-mono"][i]]);
  const all = [...APP_ICON_SET, ...LOGOS, ...LOGO_VARIANTS, ...LOGOS_BUTTERFLY].map((logo) => [logo, logo.id]);
  for (const [logo, base] of [...chosen, ...all]) {
    for (const [size, name] of [
      ["full", `${base}.svg`],
      ["small", `${base}-favicon.svg`],
    ]) {
      const svg = renderToStaticMarkup(
        createElement(LogoMark, { logo, k: K_SPARKLES, px: 512, size, uid: base }),
      )
        .replace(/ width="512" height="512"/, "")
        .replace(/ aria-hidden="true"/, "");
      await writeFile(path.join(out, name), `${svg}\n`);
      console.log(`docs/logo/${name}`);
    }
  }
} finally {
  await server.close();
}
