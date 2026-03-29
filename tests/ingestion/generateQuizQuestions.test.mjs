import test from "node:test";
import assert from "node:assert/strict";
import {
  generateQuizQuestionsForArtist,
  TARGET_DIFFICULTY_RATIOS,
} from "../../src/lib/ingestion/generateQuizQuestions.js";
import { buildKnowledgeProfile } from "../../src/lib/ingestion/buildKnowledgeProfile.js";
import { generateQuestionBank } from "../../src/lib/ingestion/generateQuestionBank.js";

test("question generation only emits supported questions from verified data", () => {
  const generated = generateQuizQuestionsForArtist(
    {
      artistName: "Girlset",
      lightstick: {
        name: "Glow Stick",
        imageUrl: "https://example.com/lightstick.png",
        source: "official",
      },
      discography: [
        {
          title: "Only One",
          albumCover: "https://example.com/cover.png",
          titleTracks: ["Only One"],
          sources: ["official"],
        },
      ],
      lyricMaterial: [
        {
          songTitle: "Only One",
          snippet: "You're my only...",
          isPermitted: true,
          source: "official",
        },
      ],
    },
    [
      "finish-the-lyric",
      "emoji-song-guess",
      "album-cover-zoom",
      "lightstick-silhouette-guess",
    ],
  );

  assert.equal(generated.questionGroups["finish-the-lyric"].length, 1);
  assert.equal(generated.questionGroups["emoji-song-guess"].length, 1);
  assert.equal(generated.questionGroups["album-cover-zoom"].length, 1);
  assert.equal(generated.questionGroups["lightstick-silhouette-guess"].length, 1);
  assert.equal(generated.questionGroups["emoji-song-guess"][0].answer, "Only One");
});

test("pool report includes target ratios and actual counts", () => {
  const generated = generateQuizQuestionsForArtist(
    {
      artistName: "Girlset",
      lightstick: {
        name: "Glow Stick",
        imageUrl: "https://example.com/lightstick.png",
        source: "official",
      },
      discography: [
        {
          title: "Only One",
          albumCover: "https://example.com/cover1.png",
          titleTracks: ["Only One", "Little Miss", "XO Call Me", "Commas", "Girls of the Year"],
          sources: ["official"],
        },
        {
          title: "Little Miss",
          albumCover: "https://example.com/cover2.png",
          titleTracks: ["Little Miss", "Recipe", "Favorite Girl"],
          sources: ["official"],
        },
      ],
      lyricMaterial: Array.from({ length: 12 }, (_, index) => ({
        songTitle: `Song ${index + 1}`,
        snippet: `Snippet ${index + 1}`,
        isPermitted: true,
        source: "official",
      })),
    },
    ["finish-the-lyric"],
  );

  assert.deepEqual(generated.poolReport["finish-the-lyric"].targetRatios, TARGET_DIFFICULTY_RATIOS);
  assert.equal(generated.poolReport["finish-the-lyric"].actualCounts.total, 12);
  assert.ok(generated.poolReport["finish-the-lyric"].actualCounts.expert >= 1);
});

test("hard and expert tiers reduce when verified material is limited", () => {
  const generated = generateQuizQuestionsForArtist(
    {
      artistName: "Girlset",
      lightstick: {
        name: null,
        imageUrl: null,
        source: null,
      },
      discography: [
        {
          title: "Only One",
          albumCover: "https://example.com/cover1.png",
          titleTracks: ["Only One"],
          sources: ["official"],
        },
      ],
      lyricMaterial: [
        {
          songTitle: "Only One",
          snippet: "Only...",
          isPermitted: true,
          source: "official",
        },
      ],
    },
    ["finish-the-lyric", "emoji-song-guess", "album-cover-zoom"],
  );

  assert.equal(generated.poolReport["finish-the-lyric"].actualCounts.hard, 0);
  assert.equal(generated.poolReport["finish-the-lyric"].actualCounts.expert, 0);
  assert.equal(generated.poolReport["emoji-song-guess"].actualCounts.hard, 0);
  assert.equal(generated.poolReport["album-cover-zoom"].actualCounts.expert, 0);
});

test("question bank indexes questions by group, category, difficulty, and mode", () => {
  const profile = buildKnowledgeProfile({
    artistName: "Girlset",
    aliases: ["VCHA"],
    fandomName: "LOCKETS",
    description: "A rebrand-era performance group.",
    company: "JYP Entertainment / Republic Records",
    debutDate: "August 29, 2025",
    debutSong: "Commas",
    nameMeaning: null,
    originStory: "The group rebranded from VCHA.",
    varietySeries: null,
    lightstick: { name: "Glow Stick", imageUrl: null, source: "official" },
    members: [
      { name: "Lexi", roles: { leader: true, maknae: false, bias: false }, image: "/quiz-media/Lexi.jpg" },
      { name: "Kendall", roles: { leader: false, maknae: false, bias: true }, image: "/quiz-media/Kendall.jpg" },
      { name: "Savanna", roles: { leader: false, maknae: true, bias: false }, image: "/quiz-media/Savanna.jpg" },
    ],
    discography: [
      {
        title: "Only One - Single",
        albumCover: "https://example.com/only-one.png",
        titleTracks: ["Only One", "Little Miss", "XO Call Me"],
        notableBSides: [],
        sources: ["official"],
        releaseDate: "2025-08-29",
      },
    ],
    lyricMaterial: [{ songTitle: "Only One", snippet: "You're my only", source: "official", isPermitted: true }],
    eras: [],
    notableFacts: [{ value: "Formerly VCHA", source: "official" }],
    sources: { fandomName: [{ source: "official" }], debutSong: [{ source: "official" }] },
  });

  const bank = generateQuestionBank([profile]);

  assert.ok(bank.groupBanks.Girlset.questions.length > 0);
  assert.ok(bank.groupBanks.Girlset.indexes.byCategory["identify-the-member"].length > 0);
  assert.ok(bank.groupBanks.Girlset.indexes.byGameMode["main-game"].length > 0);
  assert.ok(Array.isArray(bank.mixedGroupBank.questions));
});
