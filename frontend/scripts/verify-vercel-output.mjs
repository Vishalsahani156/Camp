import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";

// Vercel auto-detects the Build Output API v3 ONLY at .vercel/output/. See vite.config.ts.
const OUT = ".vercel/output";
const required = [
  `${OUT}/config.json`,
  `${OUT}/functions/__server.func/index.mjs`,
  `${OUT}/static`,
];

const missing = required.filter((path) => !existsSync(path));
if (missing.length > 0) {
  console.error("Vercel build output is incomplete. Missing:");
  for (const path of missing) console.error(`  - ${path}`);
  console.error("\nExpected the Nitro vercel preset to emit .vercel/output/ (Build Output API v3).");
  process.exit(1);
}

const config = JSON.parse(readFileSync(`${OUT}/config.json`, "utf8"));
if (config.version !== 3) {
  console.error(`Expected ${OUT}/config.json version 3, got ${config.version}`);
  process.exit(1);
}

const hasServerRoute = config.routes?.some(
  (route) => route.dest === "/__server" || route.dest?.endsWith("__server"),
);
if (!hasServerRoute) {
  console.error(`${OUT}/config.json is missing the SSR catch-all route to /__server`);
  process.exit(1);
}

console.log("Vercel output verified: .vercel/output/static + functions/__server.func + config.json");
