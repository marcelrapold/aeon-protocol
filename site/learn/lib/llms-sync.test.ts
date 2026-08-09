import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { VERSION } from "./content";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..", "..");

const llms = readFileSync(resolve(here, "..", "public", "llms.txt"), "utf8");
const bootstrap = readFileSync(resolve(repoRoot, "products", "learn", "bootstrap.md"), "utf8");

const RAW_URL = /https:\/\/raw\.githubusercontent\.com\/marcelrapold\/aeon-protocol\/[^\s>),]+/g;

describe("llms.txt mirrors bootstrap.md", () => {
  const llmsUrls = new Set(llms.match(RAW_URL) ?? []);
  const bootstrapUrls = new Set(bootstrap.match(RAW_URL) ?? []);

  it("both list the same raw spec URLs", () => {
    expect([...llmsUrls].sort()).toEqual([...bootstrapUrls].sort());
  });

  it("every raw URL is pinned to the current VERSION", () => {
    for (const url of [...llmsUrls, ...bootstrapUrls]) {
      expect(url).toContain(`/aeon-protocol/${VERSION}/`);
    }
  });

  it("llms.txt names all ten capability keys", () => {
    const keys = [
      "web_research",
      "persistent_memory",
      "scheduled_tasks",
      "proactive_notifications",
      "audio_generation",
      "text_to_speech",
      "file_generation",
      "presentation_generation",
      "image_generation",
      "code_execution",
    ];
    for (const key of keys) {
      expect(llms).toContain(key);
    }
  });

  it("llms.txt carries the state machine", () => {
    expect(llms).toContain(
      "UNINITIALIZED -> DISCOVERY -> RESEARCHING -> MAPPING -> CURRICULUM_READY -> ACTIVE -> ASSESSING -> ADAPTING -> COMPLETED",
    );
  });

  it("llms.txt forbids the lesson dump", () => {
    expect(llms).toContain("DISCOVER -> RESEARCH -> MAP -> CHALLENGE -> SEQUENCE -> TEACH");
  });
});
