import test from "node:test";
import assert from "node:assert/strict";
import { KpoppingAdapter } from "../../src/lib/ingestion/adapters/kpoppingAdapter.js";
import { RepoCatalogAdapter } from "../../src/lib/ingestion/repoCatalogAdapter.js";

test("kpopping adapter parses structured payload fields", async () => {
  const adapter = new KpoppingAdapter();
  const result = await adapter.collectArtistData({
    artistName: "Girlset",
    sources: {
      kpopping: {
        payload: {
          artistName: "Girlset",
          aliases: ["VCHA"],
          fandomName: "Glitter",
          members: [{ name: "Lexi", roles: { leader: true } }],
          discography: [{ title: "Only One", titleTracks: ["Only One"] }],
        },
      },
    },
  });

  assert.equal(result.status, "ok");
  assert.equal(result.fields.artistName, "Girlset");
  assert.deepEqual(result.fields.aliases, ["VCHA"]);
  assert.equal(result.fields.members[0].name, "Lexi");
});

test("repo catalog adapter can seed existing site groups without external payloads", async () => {
  const adapter = new RepoCatalogAdapter();
  const result = await adapter.collectArtistData({ artistName: "TWICE", sources: {} });

  assert.equal(result.status, "ok");
  assert.equal(result.fields.artistName, "TWICE");
  assert.ok(result.fields.members.length > 0);
  assert.ok(result.fields.discography.length > 0);
});
