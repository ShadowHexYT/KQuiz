import test from "node:test";
import assert from "node:assert/strict";
import { scoreFact } from "../../src/lib/ingestion/factScoring.js";

test("fact scoring keeps broadly known facts easier than notable deep-fandom facts", () => {
  const easyFact = scoreFact({
    category: "title_track",
    sources: ["official"],
    isBroadlyKnown: true,
  });
  const expertFact = scoreFact({
    category: "notable_fact",
    sources: ["kpopping"],
    isNotable: true,
  });

  assert.equal(easyFact.suggestedDifficulty, "easy");
  assert.ok(["hard", "expert"].includes(expertFact.suggestedDifficulty));
  assert.ok(easyFact.familiarityScore > expertFact.familiarityScore);
});
