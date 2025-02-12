#!/usr/bin/env node

import { parseArgs } from "node:util";
import {
  wordCountFiles,
  WordCountFilesResults,
} from "./word-count.js";

const COMMAND = "wc";

function printHelp(code: number) {
  const out = code === 0 ? process.stdout : process.stderr;

  out.write(`
${COMMAND} CMD [OPTS]

Commands:
`);
  process.exit(code);
}

function printResult(combinedResults: WordCountFilesResults) {
  for (const results of combinedResults.results) {
    if ("lines" in results) {
      process.stdout.write(`\t${results.lines}`);
    }

    if ("words" in results) {
      process.stdout.write(`\t${results.words}`);
    }

    if ("file" in results) {
      process.stdout.write(`\t${results.file}`);
    }

    process.stdout.write("\n");
  }

  if (combinedResults.results.length > 1) {
    const total = combinedResults.total ?? {};
    if ("lines" in total) {
      process.stdout.write(`\t${total.lines}`);
    }

    if ("words" in total) {
      process.stdout.write(`\t${total.words}`);
    }

    process.stdout.write("\ttotal");
  }

  process.stdout.write("\n");
}

export async function main(argv: string[]) {
  // https://nodejs.org/api/util.html#utilparseargsconfig
  const args = parseArgs({
    options: {
      help: {
        type: "boolean",
      },
      lines: {
        type: "boolean",
        short: "l",
      },
      words: {
        type: "boolean",
        short: "w",
      },
    },
    args: argv.slice(2),
    allowPositionals: true,
  });
  const { values, positionals } = args;

  if (values.help) {
    printHelp(0);
  }

  let { lines } = values;
  const { words } = values;
  if (lines === undefined && words === undefined) {
    lines = true;
  }

  const results = wordCountFiles(positionals, { lines, words });
  printResult(results);
}
