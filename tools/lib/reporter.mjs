/**
 * Findings in, text out.
 *
 * Every check produces findings in one shape and the reporter is the only place
 * that decides how they look, so the human report and the `--json` report can
 * never drift apart.
 */

/**
 * @typedef {"error"|"warning"} Level
 *
 * @typedef {object} Finding
 * @property {Level} level
 * @property {string} message what is wrong, in a sentence a reader can act on
 * @property {string} [file] repository-relative path
 * @property {number} [line] 1-based
 * @property {number} [column] 1-based
 * @property {string} [hint] how to fix it
 *
 * @typedef {object} CheckResult
 * @property {string} name
 * @property {Finding[]} findings
 * @property {Record<string, unknown>} [stats] counts worth printing when a check passes
 *
 * @typedef {CheckResult & { ok: boolean, errorCount: number, warningCount: number, durationMs: number }} CheckReport
 *
 * @typedef {object} Report
 * @property {boolean} ok
 * @property {number} durationMs
 * @property {CheckReport[]} checks
 * @property {{ checks: number, errors: number, warnings: number }} summary
 */

/**
 * @param {Level} level
 * @param {string} message
 * @param {Partial<Finding>} [details]
 * @returns {Finding}
 */
export function finding(level, message, details = {}) {
  return { level, message, ...details };
}

/**
 * @param {string} message
 * @param {Partial<Finding>} [details]
 * @returns {Finding}
 */
export const error = (message, details) => finding("error", message, details);

/**
 * @param {string} message
 * @param {Partial<Finding>} [details]
 * @returns {Finding}
 */
export const warning = (message, details) => finding("warning", message, details);

/**
 * Order findings the way a reader scans them: by file, then by position.
 *
 * @param {Finding[]} findings
 * @returns {Finding[]}
 */
export function sortFindings(findings) {
  return [...findings].sort((a, b) => {
    const fileOrder = (a.file ?? "").localeCompare(b.file ?? "");
    if (fileOrder !== 0) return fileOrder;
    if ((a.line ?? 0) !== (b.line ?? 0)) return (a.line ?? 0) - (b.line ?? 0);
    if ((a.column ?? 0) !== (b.column ?? 0)) return (a.column ?? 0) - (b.column ?? 0);
    return a.message.localeCompare(b.message);
  });
}

/**
 * @param {CheckResult} result
 * @param {number} durationMs
 * @returns {CheckReport}
 */
export function summariseCheck(result, durationMs) {
  const findings = sortFindings(result.findings);
  const errorCount = findings.filter((item) => item.level === "error").length;
  const warningCount = findings.length - errorCount;
  return {
    name: result.name,
    stats: result.stats ?? {},
    findings,
    errorCount,
    warningCount,
    ok: errorCount === 0,
    durationMs,
  };
}

/**
 * @param {CheckReport[]} checks
 * @param {number} durationMs
 * @returns {Report}
 */
export function buildReport(checks, durationMs) {
  const errors = checks.reduce((total, check) => total + check.errorCount, 0);
  const warnings = checks.reduce((total, check) => total + check.warningCount, 0);
  return {
    ok: errors === 0,
    durationMs,
    checks,
    summary: { checks: checks.length, errors, warnings },
  };
}

/**
 * `file:line:column` — with as much of it as the check actually knows.
 *
 * @param {Finding} item
 * @returns {string}
 */
export function formatLocation(item) {
  if (!item.file) return "(repository)";
  if (item.line === undefined) return item.file;
  if (item.column === undefined) return `${item.file}:${item.line}`;
  return `${item.file}:${item.line}:${item.column}`;
}

/**
 * @param {Record<string, unknown>} stats
 * @returns {string}
 */
function formatStats(stats) {
  const entries = Object.entries(stats);
  if (entries.length === 0) return "";
  return ` (${entries.map(([key, value]) => `${key}: ${value}`).join(", ")})`;
}

/**
 * @param {Report} report
 * @param {{ quiet?: boolean }} [options]
 * @returns {string} the human report, newline terminated, or empty
 */
export function formatHuman(report, { quiet = false } = {}) {
  /** @type {string[]} */
  const lines = [];

  for (const check of report.checks) {
    if (check.findings.length === 0) {
      if (!quiet) lines.push(`${check.name}: ok${formatStats(check.stats)}`);
      continue;
    }
    const counts = [
      check.errorCount > 0 ? `${check.errorCount} error${check.errorCount === 1 ? "" : "s"}` : "",
      check.warningCount > 0
        ? `${check.warningCount} warning${check.warningCount === 1 ? "" : "s"}`
        : "",
    ].filter(Boolean);
    lines.push(`${check.name}: ${counts.join(", ")}${formatStats(check.stats)}`);
    for (const item of check.findings) {
      lines.push(`  ${item.level === "error" ? "error" : "warn "} ${formatLocation(item)}`);
      lines.push(`        ${item.message}`);
      if (item.hint) lines.push(`        fix: ${item.hint}`);
    }
    lines.push("");
  }

  const { checks, errors, warnings } = report.summary;
  const seconds = (report.durationMs / 1000).toFixed(2);
  if (!quiet || !report.ok) {
    lines.push(
      `${checks} check${checks === 1 ? "" : "s"}, ${errors} error${errors === 1 ? "" : "s"}, ` +
        `${warnings} warning${warnings === 1 ? "" : "s"} in ${seconds}s`,
    );
  }

  const text = lines.join("\n").replace(/\n+$/, "");
  return text === "" ? "" : `${text}\n`;
}

/**
 * @param {Report} report
 * @returns {string} the machine report, newline terminated
 */
export function formatJson(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}
