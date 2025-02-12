import * as fs from "node:fs";

export interface WordCountOptions {
  lines?: boolean;
  words?: boolean;
}
export interface WordCountResults {
  file?: string;
  lines?: number;
  words?: number;
}
export function wordCountContents(
  contents: string,
  options: WordCountOptions,
): WordCountResults {
  const includeLines = options.lines === true;
  const includeWords = options.words === true;
  if (!(includeLines || includeWords)) {
    return {};
  }

  let lines = 0;
  let words = 0;

  const contentLines = contents.split("\n");
  for (const line of contentLines) {
    ++lines;

    if (includeWords) {
      for (const word of line.split(/\s/)) {
        if (word.length > 0) {
          ++words;
        }
      }
    }
  }

  if (contents[contents.length - 1] === "\n") {
    // don't count a trailing newline
    --lines;
  }

  return Object.assign(
    {},
    includeLines ? { lines } : {},
    includeWords ? { words } : {},
  );
}

export function wordCountFile(
  path: string,
  options: WordCountOptions,
): WordCountResults {
  const contents = fs.readFileSync(path);
  return Object.assign(wordCountContents(contents.toString(), options), {
    file: path,
  });
}

export interface WordCountFilesResults {
  results: WordCountResults[];
  total?: {
    lines?: number;
    words?: number;
  };
}
export function wordCountFiles(
  paths: string[],
  options: WordCountOptions,
): WordCountFilesResults {
  const includeLines = options.lines === true;
  const includeWords = options.words === true;
  if (!(includeLines || includeWords)) {
    return { results: [], total: {} };
  }

  let lines = 0;
  let words = 0;

  const results: WordCountResults[] = [];
  for (const path of paths) {
    const fileResults = wordCountFile(path, options);
    lines += fileResults.lines ?? 0;
    words += fileResults.words ?? 0;
    results.push(fileResults);
  }

  return {
    results,
    total: Object.assign(
      {},
      includeLines ? { lines } : {},
      includeWords ? { words } : {},
    ),
  };
}
