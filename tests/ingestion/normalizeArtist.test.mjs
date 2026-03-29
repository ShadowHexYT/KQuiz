import test from "node:test";
import assert from "node:assert/strict";
import { normalizeArtistResults } from "../../src/lib/ingestion/normalizeArtist.js";

test("normalization prefers higher-priority sources and logs conflicts", () => {
  const normalized = normalizeArtistResults(
    { artistName: "Girlset" },
    [
      {
        source: "official",
        status: "ok",
        fields: {
          artistName: "Girlset",
          fandomName: "Glow",
          members: [{ name: "Lexi", roles: { leader: true } }],
          discography: [],
          lyricMaterial: [],
          eras: [],
        },
      },
      {
        source: "kpopping",
        status: "ok",
        fields: {
          artistName: "Girlset",
          fandomName: "Glitter",
          members: [{ name: "Lexi", roles: { leader: true } }],
          discography: [],
          lyricMaterial: [],
          eras: [],
        },
      },
    ],
  );

  assert.equal(normalized.fandomName, "Glow");
  assert.equal(normalized.conflicts.length, 1);
  assert.equal(normalized.conflicts[0].field, "fandomName");
});

test("normalization sends missing fields to review queue instead of guessing", () => {
  const normalized = normalizeArtistResults(
    { artistName: "Girlset" },
    [
      {
        source: "official",
        status: "ok",
        fields: {
          artistName: "Girlset",
          aliases: [],
          members: [],
          discography: [],
          lyricMaterial: [],
          eras: [],
        },
      },
    ],
  );

  assert.equal(normalized.lightstick.name, null);
  assert.ok(normalized.reviewQueue.some((item) => item.field === "lightstick"));
});
