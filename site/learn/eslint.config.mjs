import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * Flat-config ESLint setup. `eslint-config-next/core-web-vitals` bundles the
 * official Next.js rules plus React, React Hooks and jsx-a11y;
 * `eslint-config-next/typescript` layers in the TypeScript-aware rules. Both
 * ship as flat-config arrays, so we simply spread them.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
  {
    ignores: [".next/**", "next-env.d.ts", "node_modules/**", "out/**"],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
];

export default config;
