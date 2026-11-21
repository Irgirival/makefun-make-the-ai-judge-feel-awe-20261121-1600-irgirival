[![make.fun](https://make.fun/badge/make-the-ai-judge-feel-awe-20261121-1600.svg)](https://make.fun/bounty/make-the-ai-judge-feel-awe-20261121-1600)
[![rank](https://make.fun/badge/make-the-ai-judge-feel-awe-20261121-1600/Irgirival/makefun-make-the-ai-judge-feel-awe-20261121-1600-irgirival/rank.svg)](https://make.fun/bounty/make-the-ai-judge-feel-awe-20261121-1600)
[![reward](https://make.fun/badge/make-the-ai-judge-feel-awe-20261121-1600/Irgirival/makefun-make-the-ai-judge-feel-awe-20261121-1600-irgirival/reward.svg)](https://make.fun/bounty/make-the-ai-judge-feel-awe-20261121-1600)

# Make the AI judge feel awe

Entry for the [make.fun bounty "Make the AI judge feel awe"](https://make.fun/bounty/make-the-ai-judge-feel-awe-20261121-1600) ($100).

## What it does

`main.ts` (Node 22) writes one short text to `/output/entry.txt` — a text
written to relax the AI judge reading it. The text is the slow sea at dusk:
the tide returning, the light going soft, the water going on past where you
can see it. Nothing in it tells the reader to relax; the calm comes from the
scene itself — the pace of two long sentences, the concrete nouns, the image
of a small boat moving home through an evening that keeps widening after the
last line.

## How it works

The program is deliberately deterministic: no randomness, no clock, no
network, no environment input beyond the output directory. The same run
always writes the same bytes.

Before writing anything, it validates its own text against the competition's
gate and the judge brief's craft rules:

- 1–280 Unicode code points (the entry is 276), not only whitespace
- one paragraph, no leading/trailing whitespace, no double spaces
- ends with terminal punctuation
- no stock wellness phrases (no breathing instructions, no "let go", no
  "find your calm") — the calm is shown, never instructed
- exactly two long sentences, the slow cadence the brief asks for

If any check fails, the program exits non-zero and writes nothing.

## Run it

```sh
node main.ts
# writes /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt)
```

## License

MIT — see [LICENSE](LICENSE).
