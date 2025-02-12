import { assert, describe, test } from "vitest";
import {
  wordCountContents,
  wordCountFile,
  wordCountFiles,
} from "./word-count.js";
import fs from "node:fs";
import path from "node:path";
import tmp from "tmp-promise";
import fixturify from "fixturify";

tmp.setGracefulCleanup();

const poem = `
upon
a red wheel
barrow
glazed with rain
water
beside the white
chickens
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripFile(obj: any) {
  delete obj.file;
  if ("results" in obj) {
    for (const result of obj.results) {
      delete result.file;
    }
  }
  return obj;
}

describe("wordCountContents", () => {
  test("it counts lines and words", () => {
    assert.deepEqual(wordCountContents(poem, { lines: true }), { lines: 8 });
    assert.deepEqual(wordCountContents(poem, { words: true }), { words: 13 });
    assert.deepEqual(wordCountContents(poem, { lines: true, words: true }), {
      lines: 8,
      words: 13,
    });
    assert.deepEqual(wordCountContents(poem, {}), {});
  });
});

describe("wordCountFile", () => {
  test("it counts lines and words", async () => {
    const tmpDir = await tmp.dir({ unsafeCleanup: true });
    const poemFilePath = path.join(tmpDir.path, "poem.txt");
    fs.writeFileSync(poemFilePath, poem);
    assert.deepEqual(stripFile(wordCountFile(poemFilePath, { lines: true })), {
      lines: 8,
    });
    assert.deepEqual(stripFile(wordCountFile(poemFilePath, { words: true })), {
      words: 13,
    });
    assert.deepEqual(
      stripFile(wordCountFile(poemFilePath, { lines: true, words: true })),
      { lines: 8, words: 13 },
    );
    assert.deepEqual(stripFile(wordCountFile(poemFilePath, {})), {});

    await tmpDir.cleanup();
  });
});

describe("wordCountFiles", async () => {
  test("it counts lines and words in multiple files", async () => {
    const tmpDir = await tmp.dir({ unsafeCleanup: true });

    fixturify.writeSync(tmpDir.path, {
      "poem-a.txt": poem,
      "poem-b.txt": poem,
    });

    const paths = [
      path.join(tmpDir.path, "poem-a.txt"),
      path.join(tmpDir.path, "poem-b.txt"),
    ];

    assert.deepEqual(stripFile(wordCountFiles(paths, { lines: true })), {
      results: [{ lines: 8 }, { lines: 8 }],
      total: { lines: 16 },
    });
    assert.deepEqual(stripFile(wordCountFiles(paths, { words: true })), {
      results: [{ words: 13 }, { words: 13 }],
      total: { words: 26 },
    });
    assert.deepEqual(
      stripFile(wordCountFiles(paths, { lines: true, words: true })),
      {
        results: [
          { lines: 8, words: 13 },
          { lines: 8, words: 13 },
        ],
        total: { lines: 16, words: 26 },
      },
    );
    assert.deepEqual(stripFile(wordCountFiles(paths, {})), {
      results: [],
      total: {},
    });

    await tmpDir.cleanup();
  });
});
