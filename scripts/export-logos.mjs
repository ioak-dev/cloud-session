/**
 * Writes every app icon proposal in `src/design/nix/wisp-logo.tsx` to `docs/logo/` as standalone
 * SVG in the Sparkles scheme: `<id>.svg` (the app icon) and `<id>-favicon.svg` (the 16–32px
 * drawing). Run with `npm run logos`.
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
  const { LOGOS, LogoMark, K_SPARKLES } = await server.ssrLoadModule("/src/design/nix/wisp-logo.tsx");
  await mkdir(out, { recursive: true });
  for (const logo of LOGOS) {
    for (const [size, name] of [
      ["full", `${logo.id}.svg`],
      ["small", `${logo.id}-favicon.svg`],
    ]) {
      const svg = renderToStaticMarkup(
        createElement(LogoMark, { logo, k: K_SPARKLES, px: 512, size, uid: logo.id }),
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
