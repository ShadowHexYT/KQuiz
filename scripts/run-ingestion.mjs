import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { runIngestionWorkflow } from "../src/lib/ingestion/runIngestionWorkflow.js";
import { readCachedPayload, writeCachedPayload } from "../src/lib/ingestion/cache.js";
import { SUPPORTED_INGESTION_GAME_MODES } from "../src/lib/ingestion/schema.js";

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) continue;
    parsed[value.slice(2)] = argv[index + 1];
    index += 1;
  }

  return parsed;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const requestFile = args.input;
  const outputDir = args.output ?? "src/data/generated";

  if (!requestFile) {
    throw new Error("Missing required --input <request.json> argument.");
  }

  const requestPayload = JSON.parse(await fs.readFile(requestFile, "utf8"));
  const requestedModes = (requestPayload.requestedModes ?? SUPPORTED_INGESTION_GAME_MODES).filter(Boolean);
  const cacheDir = path.resolve(".cache/ingestion");

  const workflowResult = await runIngestionWorkflow({
    artists: requestPayload.artists ?? [],
    requestedModes,
    cacheApi: {
      read: (cacheKey) => readCachedPayload(cacheDir, cacheKey),
      write: (cacheKey, payload) => writeCachedPayload(cacheDir, cacheKey, payload),
    },
  });

  await fs.mkdir(outputDir, { recursive: true });

  for (const artistResult of workflowResult.processedArtists) {
    const artistDir = path.join(outputDir, slugify(artistResult.artistName));
    await fs.mkdir(artistDir, { recursive: true });

    await fs.writeFile(
      path.join(artistDir, "normalized-artist.json"),
      JSON.stringify(artistResult.normalizedArtistJson, null, 2),
    );
    await fs.writeFile(
      path.join(artistDir, "quiz-questions.json"),
      JSON.stringify(artistResult.quizQuestionJson, null, 2),
    );
    await fs.writeFile(
      path.join(artistDir, "validation-report.json"),
      JSON.stringify(artistResult.validationReport, null, 2),
    );
    await fs.writeFile(
      path.join(artistDir, "skipped-items-report.json"),
      JSON.stringify(artistResult.skippedItemsReport, null, 2),
    );
  }

  const summary = workflowResult.processedArtists.map((artistResult) => ({
    artistName: artistResult.artistName,
    requestedModes: artistResult.requestedModes,
    sourcesUsed: artistResult.adapterResults
      .filter((result) => result.status === "ok")
      .map((result) => result.source),
    skippedItems: artistResult.skippedItemsReport.length,
    reviewQueueItems: artistResult.validationReport.reviewQueue.length,
  }));

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
