import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * Flat-config ESLint setup. `eslint-config-next/core-web-vitals` bundles the
 * official Next.js rules plus React, React Hooks and jsx-a11y;
 * `eslint-config-next/typescript` layers in the TypeScript-aware rules. Both
 * ship as flat-config arrays, so we simply spread them.
 *
 * Three things are added on top, all of them rules that have caught a real
 * defect in this codebase rather than enforced a preference:
 *
 *  1. Type-aware linting. `projectService` hands the TypeScript program to
 *     the rules, which is what `no-floating-promises` and friends need to
 *     tell a promise from a value. It costs a few seconds on a project this
 *     size and catches the class of bug where an async call is fired and its
 *     rejection lands nowhere.
 *  2. The full jsx-a11y recommended set, as errors. The bundled Next config
 *     enables six of its rules as warnings; this is a public site, so the
 *     rest are on and none of them are advisory.
 *  3. `react-hooks/exhaustive-deps` promoted from warning to error. Every
 *     interactive component here wires up listeners, observers and timers in
 *     an effect, and a stale closure in one of those is invisible until it
 *     is a bug report.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
  {
    ignores: [".next/**", "next-env.d.ts", "node_modules/**", "out/**"],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      /* Type-aware correctness. */
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      /* An `any` or a suppression is not a fix; the strict flags in
         tsconfig.json are only worth having if they cannot be waved through. */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      /* React correctness. */
      "react-hooks/exhaustive-deps": "error",
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/jsx-no-target-blank": ["error", { allowReferrer: false }],
      "react/no-unstable-nested-components": "error",
    },
  },
  {
    /* The jsx-a11y plugin is already registered by the Next config, which
       switches on six of its rules as warnings. This takes the whole
       recommended set at its own severity — every one of them is a real
       barrier for someone using the site by keyboard or by screen reader,
       and on a public site none of them are advisory. */
    files: ["**/*.tsx"],
    rules: Object.fromEntries(
      Object.entries(jsxA11y.flatConfigs.recommended.rules).filter(
        ([, severity]) => severity !== "off" && severity?.[0] !== "off",
      ),
    ),
  },
];

export default config;
