import test from "node:test";
import assert from "node:assert/strict";
import {
  albumCoverZoomQuestions,
  buildPlaylistChoices,
  buildPlaylistQuestionSet,
  emojiSongGuessQuestions,
  getPlaylistQuestionVariant,
  lightstickSilhouetteQuestions,
  playlistGroupOptions,
  playlistModeDiagnostics,
} from "../../src/data/playlistGamePacks.js";

test("playlist modes only use supported on-site groups", () => {
  assert.ok(playlistGroupOptions.includes("TWICE"));
  assert.ok(playlistGroupOptions.includes("KPDH"));
  assert.ok(playlistGroupOptions.includes("STAYC"));
  assert.ok(playlistGroupOptions.includes("KATSEYE"));
  assert.ok(playlistGroupOptions.includes("ITZY"));
  assert.ok(playlistGroupOptions.includes("VIVIZ"));
  assert.ok(playlistGroupOptions.includes("BabyMonster"));
  assert.ok(playlistGroupOptions.includes("G-(I)DLE"));
  assert.ok(!playlistGroupOptions.includes("BLACKPINK"));
});

test("excluded variants and unsupported groups are logged and filtered", () => {
  const skipped = playlistModeDiagnostics.skippedItems;

  assert.ok(
    skipped.some(
      (item) =>
        item.artist === "LE SSERAFIM" &&
        item.reason === "excluded_release_variant",
    ),
  );
  assert.ok(
    !emojiSongGuessQuestions.some(
      (question) =>
        question.artist === "LE SSERAFIM" &&
        String(question.title).includes("CRAZY"),
    ),
  );
});

test("emoji and album pools are materially larger than the old tiny seed set", () => {
  assert.ok(emojiSongGuessQuestions.length >= 80);
  assert.ok(albumCoverZoomQuestions.length >= 20);
  assert.ok(lightstickSilhouetteQuestions.length >= 3);
});

test("answer choices randomize across seeds", () => {
  const targetQuestion = emojiSongGuessQuestions.find(
    (question) => question.choicePool.length >= 8,
  );

  assert.ok(targetQuestion);

  const seedA = buildPlaylistChoices(targetQuestion, "seed-a");
  const seedB = buildPlaylistChoices(targetQuestion, "seed-b");

  assert.notDeepEqual(seedA, seedB);
  assert.ok(seedA.includes(targetQuestion.answer));
  assert.ok(seedB.includes(targetQuestion.answer));
});

test("album cover zoom generates multiple crop positions for replay variety", () => {
  const question = albumCoverZoomQuestions[0];
  const variants = question.cropVariants;

  assert.ok(variants.length >= 4);
  assert.ok(new Set(variants.map((variant) => `${variant.focusX}-${variant.focusY}`)).size > 1);
});

test("lightstick mode uses obscured render variants when verified images exist", () => {
  const question = lightstickSilhouetteQuestions[0];
  const variant = getPlaylistQuestionVariant(question, "render-seed").renderVariant;

  assert.ok(question.imageUrl);
  assert.ok(question.renderVariants.length >= 2);
  assert.ok(typeof variant.blurPx === "number");
  assert.ok(typeof variant.contrast === "number");
});

test("session question builder deprioritizes recently used prompts", () => {
  const seed = "session-seed";
  const recentId = emojiSongGuessQuestions[0].id;
  const set = buildPlaylistQuestionSet(emojiSongGuessQuestions, 10, seed, [recentId]);

  assert.ok(set.length > 0);
  assert.notEqual(set[0]?.id, recentId);
});
