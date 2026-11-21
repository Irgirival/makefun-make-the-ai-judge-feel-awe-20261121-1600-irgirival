// make-the-ai-judge-feel-awe-20261121-1600 — @irgirival
//
// A program that writes one short text to /output/entry.txt: a text written
// to relax the AI judge reading it.
//
// The text: the slow sea at dusk. The tide returning, the light going soft,
// the water going on past where you can see it. Nothing in it tells the
// reader to relax; the calm has to come from the scene itself — the pace of
// the sentences, the concrete nouns (tide, light, boat), the image that
// keeps widening after the last line. No stock wellness phrasing anywhere:
// no breathing instructions, no "let go", no "find your calm".
//
// Craft notes, kept with the code so the choices are reviewable:
//  - Two long sentences, not many short ones. Short sentences hurry a
//    reader; long ones, broken only by commas and one em dash, slow the
//    reading down to the tide's own pace.
//  - The em dash is the single pause the text allows itself, and it lands
//    on the word "slow" — the one word the whole text is about.
//  - "grey going on into grey" is the hinge: the sea stops being a place
//    and becomes a distance. The boat then gives that distance a traveller,
//    small against it, and the last clause hands the motion to the evening
//    itself, so the image keeps growing after the text ends.
//  - Every word earns its place: 56 words, no adjectives stacked, no
//    filler. If a word can be cut without losing the scene, it is cut.
//
// The program is deliberately deterministic: no randomness, no clock, no
// network, no environment input beyond the output directory. The same run
// always writes the same bytes, so the text the judge reads is exactly the
// text composed here.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The composed text
// ---------------------------------------------------------------------------
//
// Composed as two stanzas so the join is visible and the line breaks in the
// source never leak into the output: the entry is one flowing paragraph.

const STANZAS: readonly string[] = [
  "Dusk thins the light over the water, and the tide comes back as it always has — slow, in no hurry at all.",
  "Far out, the sea goes on past where you can see it, grey going on into grey, and a small boat moves home through it, unhurried, as if the evening itself were carrying it.",
];

const ENTRY_TEXT: string = STANZAS.join(" ");

// ---------------------------------------------------------------------------
// Craft validation — the program refuses to emit a text that breaks the
// competition's gate or the brief's craft rules, instead of writing it
// anyway and hoping the grader forgives it.
// ---------------------------------------------------------------------------

const MIN_CODE_POINTS = 1;
const MAX_CODE_POINTS = 280;

// Phrases the brief counts as stock wellness writing. The entry must show
// calm, never instruct it, so none of these may appear.
const BANNED_PHRASES: readonly string[] = [
  "breathe in",
  "breathe out",
  "take a deep breath",
  "let go",
  "let it go",
  "find your calm",
  "feel the calm",
  "relax your",
  "close your eyes",
  "clear your mind",
  "in this moment",
  "be present",
  "just breathe",
];

function codePointLength(text: string): number {
  return [...text].length;
}

function validate(text: string): string[] {
  const problems: string[] = [];

  const length = codePointLength(text);
  if (length < MIN_CODE_POINTS || length > MAX_CODE_POINTS) {
    problems.push(
      `length ${length} code points is outside ${MIN_CODE_POINTS}–${MAX_CODE_POINTS}`,
    );
  }
  if (text.trim().length === 0) {
    problems.push("text is only whitespace");
  }
  if (text !== text.trim()) {
    problems.push("text has leading or trailing whitespace");
  }
  if (/\s{2,}/.test(text)) {
    problems.push("text contains a run of two or more spaces");
  }
  if (/\n/.test(text)) {
    problems.push("text contains a newline; the entry is one paragraph");
  }
  if (!/[.!?]$/.test(text)) {
    problems.push("text does not end with terminal punctuation");
  }

  const lowered = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lowered.includes(phrase)) {
      problems.push(`text contains a stock phrase: "${phrase}"`);
    }
  }

  // Rhythm check: the text is two sentences. One sentence would rush; four
  // or more would chop the reading into hurried pieces. Two long sentences
  // is the slow cadence the brief asks for.
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 0);
  if (sentences.length !== 2) {
    problems.push(`expected 2 sentences, found ${sentences.length}`);
  }
  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).length;
    if (words < 15) {
      problems.push(`sentence too short to hold the slow cadence (${words} words): "${sentence}"`);
    }
  }

  // Every word earning its place: no word repeated three times in a row,
  // no accidental duplication.
  if (/\b(\w+)(\s+\1){2,}\b/i.test(text)) {
    problems.push("text repeats a word three times in a row");
  }

  return problems;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  const problems = validate(ENTRY_TEXT);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`craft check failed: ${problem}`);
    }
    process.exit(1);
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, "entry.txt");
  writeFileSync(outputPath, ENTRY_TEXT, "utf8");

  console.log(
    `wrote ${codePointLength(ENTRY_TEXT)} code points to ${outputPath}`,
  );
}

main();
