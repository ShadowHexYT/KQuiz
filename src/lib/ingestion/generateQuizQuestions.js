import { addSkippedItem } from "./reviewQueue.js";
import { SUPPORTED_INGESTION_GAME_MODES } from "./schema.js";

const DIFFICULTY_ORDER = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 4,
};

export const TARGET_DIFFICULTY_RATIOS = {
  easy: 0.4,
  medium: 0.35,
  hard: 0.2,
  expert: 0.05,
};

const EMOJI_WORD_MAP = {
  one: "1️⃣",
  only: "🫵",
  little: "🤏",
  miss: "❌",
  xo: "💋",
  call: "📞",
  me: "🙋",
  love: "❤️",
  heart: "🫀",
  hot: "🔥",
  touch: "🫳",
  cry: "😭",
  baby: "👶",
  hands: "🙌",
  up: "⬆️",
  left: "⬅️",
  right: "➡️",
  star: "⭐",
  golden: "🥇",
};

function sortByDifficulty(questions) {
  return [...questions].sort((left, right) => {
    const leftRank = DIFFICULTY_ORDER[left.difficulty] ?? 99;
    const rightRank = DIFFICULTY_ORDER[right.difficulty] ?? 99;
    return leftRank - rightRank;
  });
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deriveEmojiClue(title) {
  const tokens = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const emojis = tokens.map((token) => EMOJI_WORD_MAP[token]).filter(Boolean);
  return emojis.length ? emojis.join("") : null;
}

function normalizeDifficulty(value) {
  return DIFFICULTY_ORDER[value] ? value : "easy";
}

function createQuestion(question, extra = {}) {
  return {
    ...question,
    difficulty: normalizeDifficulty(question.difficulty),
    ...extra,
  };
}

function buildDifficultyStats(questions) {
  return questions.reduce(
    (stats, question) => {
      const difficulty = normalizeDifficulty(question.difficulty);
      stats[difficulty] += 1;
      return stats;
    },
    {
      easy: 0,
      medium: 0,
      hard: 0,
      expert: 0,
      total: questions.length,
    },
  );
}

function allocateDifficultyTargets(totalCount) {
  const tiers = ["easy", "medium", "hard", "expert"];
  const targets = {
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0,
  };

  tiers.forEach((tier) => {
    targets[tier] = Math.floor(totalCount * TARGET_DIFFICULTY_RATIOS[tier]);
  });

  let assigned = tiers.reduce((sum, tier) => sum + targets[tier], 0);
  const priorityOrder = ["easy", "medium", "hard", "expert"];
  let index = 0;

  while (assigned < totalCount) {
    const tier = priorityOrder[index % priorityOrder.length];
    targets[tier] += 1;
    assigned += 1;
    index += 1;
  }

  return targets;
}

function balanceQuestionsByDifficulty(questions) {
  const buckets = {
    easy: [],
    medium: [],
    hard: [],
    expert: [],
  };

  questions.forEach((question) => {
    buckets[normalizeDifficulty(question.difficulty)].push(question);
  });

  const totalCount = questions.length;
  const targets = allocateDifficultyTargets(totalCount);
  const selected = [];

  ["easy", "medium", "hard", "expert"].forEach((tier) => {
    const bucket = buckets[tier];
    const count = Math.min(targets[tier], bucket.length);
    selected.push(...bucket.slice(0, count));
    targets[tier] -= count;
  });

  if (targets.expert > 0) targets.expert = 0;
  if (targets.hard > 0) targets.hard = 0;

  if (targets.medium > 0) {
    const bucket = buckets.medium.slice(selected.filter((question) => question.difficulty === "medium").length);
    const count = Math.min(targets.medium, bucket.length);
    selected.push(...bucket.slice(0, count));
    targets.medium -= count;
  }

  if (targets.easy > 0) {
    const bucket = buckets.easy.slice(selected.filter((question) => question.difficulty === "easy").length);
    const count = Math.min(targets.easy, bucket.length);
    selected.push(...bucket.slice(0, count));
    targets.easy -= count;
  }

  const selectedIds = new Set(selected.map((question) => question.id));
  const leftovers = questions.filter((question) => !selectedIds.has(question.id));

  return sortByDifficulty([...selected, ...leftovers]);
}

function buildFinishTheLyricQuestions(normalizedArtist, skippedItems) {
  const questions = normalizedArtist.lyricMaterial
    .filter((item) => item.isPermitted && item.snippet && item.songTitle)
    .map((item, index) =>
      createQuestion({
        id: `${slugify(normalizedArtist.artistName)}-finish-the-lyric-${index + 1}`,
        modeId: "finish-the-lyric",
        artistName: normalizedArtist.artistName,
        prompt: item.snippet,
        answer: item.songTitle,
        difficulty:
          index < 4 ? "easy" : index < 8 ? "medium" : index < 11 ? "hard" : "expert",
        provenance: [
          {
            field: `lyricMaterial:${item.songTitle}`,
            source: item.source,
          },
        ],
      }),
    );

  if (!questions.length) {
    addSkippedItem(skippedItems, {
      field: "lyricMaterial",
      reason: "no_permitted_lyric_snippets",
      modeId: "finish-the-lyric",
    });
  }

  return questions;
}

function buildEmojiSongGuessQuestions(normalizedArtist, skippedItems) {
  const questions = normalizedArtist.discography.flatMap((release) =>
    (release.titleTracks ?? []).map((songTitle, index) => {
      const emojiClue = deriveEmojiClue(songTitle);
      if (!emojiClue) {
        addSkippedItem(skippedItems, {
          field: `titleTrack:${songTitle}`,
          reason: "unable_to_derive_conservative_emoji_clue",
          modeId: "emoji-song-guess",
        });
        return null;
      }

      return createQuestion({
        id: `${slugify(normalizedArtist.artistName)}-emoji-song-${slugify(songTitle)}`,
        modeId: "emoji-song-guess",
        artistName: normalizedArtist.artistName,
        prompt: emojiClue,
        answer: songTitle,
        difficulty:
          index === 0 ? "easy" : index < 3 ? "medium" : index < 5 ? "hard" : "expert",
        provenance: [
          {
            field: `release:${release.title}.titleTracks`,
            source: release.sources?.[0] ?? "unknown",
          },
        ],
      });
    }),
  ).filter(Boolean);

  return questions;
}

function buildAlbumCoverZoomQuestions(normalizedArtist, skippedItems) {
  const questions = normalizedArtist.discography
    .filter((release) => release.albumCover && release.title)
    .map((release, index) =>
      createQuestion({
        id: `${slugify(normalizedArtist.artistName)}-album-cover-${slugify(release.title)}`,
        modeId: "album-cover-zoom",
        artistName: normalizedArtist.artistName,
        prompt: release.albumCover,
        answer: release.title,
        difficulty:
          index === 0 ? "easy" : index < 3 ? "medium" : index < 5 ? "hard" : "expert",
        renderHint: {
          type: "zoom",
          focusX: 20 + ((index * 17) % 60),
          focusY: 20 + ((index * 11) % 60),
        },
        provenance: [
          {
            field: `release:${release.title}.albumCover`,
            source: release.sources?.[0] ?? "unknown",
          },
        ],
      }),
    );

  if (!questions.length) {
    addSkippedItem(skippedItems, {
      field: "albumCover",
      reason: "no_verified_cover_art",
      modeId: "album-cover-zoom",
    });
  }

  return questions;
}

function buildLightstickQuestions(normalizedArtist, skippedItems) {
  if (!normalizedArtist.lightstick?.imageUrl || !normalizedArtist.lightstick?.name) {
    addSkippedItem(skippedItems, {
      field: "lightstick",
      reason: "missing_verified_lightstick_metadata",
      modeId: "lightstick-silhouette-guess",
    });
    return [];
  }

  return [
    createQuestion({
      id: `${slugify(normalizedArtist.artistName)}-lightstick`,
      modeId: "lightstick-silhouette-guess",
      artistName: normalizedArtist.artistName,
      prompt: normalizedArtist.lightstick.imageUrl,
      answer: normalizedArtist.artistName,
      difficulty: "easy",
      renderHint: {
        type: "silhouette",
      },
      provenance: [
        {
          field: "lightstick.imageUrl",
          source: normalizedArtist.lightstick.source ?? "unknown",
        },
      ],
    }),
  ];
}

export function generateQuizQuestionsForArtist(
  normalizedArtist,
  requestedModes = SUPPORTED_INGESTION_GAME_MODES,
) {
  const skippedItems = [];
  const questionGroups = {};
  const poolReport = {};

  requestedModes.forEach((modeId) => {
    if (modeId === "finish-the-lyric") {
      const balancedQuestions = balanceQuestionsByDifficulty(
        buildFinishTheLyricQuestions(normalizedArtist, skippedItems),
      );
      questionGroups[modeId] = balancedQuestions;
      poolReport[modeId] = {
        targetRatios: TARGET_DIFFICULTY_RATIOS,
        actualCounts: buildDifficultyStats(balancedQuestions),
      };
      return;
    }

    if (modeId === "emoji-song-guess") {
      const balancedQuestions = balanceQuestionsByDifficulty(
        buildEmojiSongGuessQuestions(normalizedArtist, skippedItems),
      );
      questionGroups[modeId] = balancedQuestions;
      poolReport[modeId] = {
        targetRatios: TARGET_DIFFICULTY_RATIOS,
        actualCounts: buildDifficultyStats(balancedQuestions),
      };
      return;
    }

    if (modeId === "album-cover-zoom") {
      const balancedQuestions = balanceQuestionsByDifficulty(
        buildAlbumCoverZoomQuestions(normalizedArtist, skippedItems),
      );
      questionGroups[modeId] = balancedQuestions;
      poolReport[modeId] = {
        targetRatios: TARGET_DIFFICULTY_RATIOS,
        actualCounts: buildDifficultyStats(balancedQuestions),
      };
      return;
    }

    if (modeId === "lightstick-silhouette-guess") {
      const balancedQuestions = balanceQuestionsByDifficulty(
        buildLightstickQuestions(normalizedArtist, skippedItems),
      );
      questionGroups[modeId] = balancedQuestions;
      poolReport[modeId] = {
        targetRatios: TARGET_DIFFICULTY_RATIOS,
        actualCounts: buildDifficultyStats(balancedQuestions),
      };
    }
  });

  return {
    artistName: normalizedArtist.artistName,
    requestedModes,
    questionGroups,
    poolReport,
    skippedItems,
  };
}
