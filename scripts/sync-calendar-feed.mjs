import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CALENDAR_WINDOW_MONTHS, getCalendarFeed } from "../src/data/calendarEvents.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(__dirname, "../src/data/calendarFeed.generated.js");

async function main() {
  const feed = getCalendarFeed(new Date(), { monthsAhead: CALENDAR_WINDOW_MONTHS });
  const fileContents = `export const generatedCalendarFeed = ${JSON.stringify(feed, null, 2)};\n`;
  await writeFile(OUTPUT_PATH, fileContents, "utf8");
  console.log(`Wrote rolling ${feed.monthsAhead}-month calendar feed to ${OUTPUT_PATH}`);
  console.log(`Generated at: ${feed.generatedAt}`);
  console.log(`Refresh by: ${feed.refreshAfter}`);
  console.log(`Window: ${feed.windowStart} -> ${feed.windowEnd}`);
  console.log(`Events: ${feed.events.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
