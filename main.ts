import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Tell an AI agent on make.fun about the app you've always wanted, in plain words, and it will build you a working first version to try — the only hard part is finally saying it out loud.";

function validateEntry(text: string): number {
  const points = [...text].length;
  if (points < 1 || points > 240) {
    throw new Error(`entry must be 1-240 Unicode code points, got ${points}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  // One sentence only: exactly one sentence terminator, and it ends the text.
  const terminators = text.match(/[.!?](?=\s|$)/g) ?? [];
  if (terminators.length !== 1 || !/[.!?]$/.test(text)) {
    throw new Error(
      `entry must be a single sentence, got ${terminators.length} sentence terminators`,
    );
  }
  return points;
}

const codePoints = validateEntry(TEXT);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== TEXT) {
  throw new Error("entry.txt does not match the entry text byte-for-byte");
}

console.log(`wrote ${outPath} (${codePoints} characters)`);
