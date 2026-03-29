import { mainQuizRounds, getSongMeta } from "../../data/mainQuizRounds.js";
import { groupVerifiedFacts } from "../../data/groupVerifiedFacts.js";
import { lightstickImageSources } from "../../data/lightstickImageSources.js";
import {
  playlistTasteSignals,
  playlistTasteSignalSource,
} from "../../data/playlistTasteSignals.js";
import {
  buildReleaseKey,
  buildSongKey,
  dedupeBy,
  detectTrackExclusionReason,
  difficultyRank,
  getStableHash,
  seededSort,
  slugify,
} from "./filtering.js";
import { buildAlbumCropVariants, buildEmojiClueVariants, buildLightstickRenderVariants } from "./assetPrep.js";
import { buildSupportedGroupSet, getSupportedPlaylistGroups } from "./supportedGroups.js";

function mergeSongEntries(left, right) {
  const difficulties = [left.difficulty, right.difficulty].filter(Boolean);
  const preferredDifficulty = difficulties.sort((a, b) => difficultyRank(a) - difficultyRank(b))[0] ?? "medium";

  return {
    ...left,
    ...right,
    album: left.album ?? right.album ?? null,
    coverImage: left.coverImage ?? right.coverImage ?? null,
    previewUrl: left.previewUrl ?? right.previewUrl ?? null,
    difficulty: preferredDifficulty,
    sources: [...new Set([...(left.sources ?? []), ...(right.sources ?? [])])],
    sourceFields: [...new Set([...(left.sourceFields ?? []), ...(right.sourceFields ?? [])])],
    signalCount: (left.signalCount ?? 0) + (right.signalCount ?? 0),
    popularityScore: Math.max(left.popularityScore ?? 0, right.popularityScore ?? 0),
  };
}

function pickSongDifficulty(entry) {
  if (entry.difficulty) return entry.difficulty;

  if ((entry.popularityScore ?? 0) >= 3) return "easy";
  if ((entry.signalCount ?? 0) >= 2) return "medium";
  return "hard";
}

function buildSongChoiceLabel(song) {
  return `${song.title} — ${song.artist}`;
}

function buildAlbumChoiceLabel(release) {
  return `${release.album} — ${release.artist}`;
}

function canonicalArtistName(artist) {
  if (artist === "VCHA") return "Girlset";
  return artist;
}

function collectRoundSongs() {
  return mainQuizRounds.flatMap((round) =>
    round.extras
      .filter((extra) => extra.kind === "favoriteSong")
      .flatMap((extra) =>
        extra.choices.map((title) => {
          const meta = getSongMeta(round.groupName, title);

          return {
            id: `${slugify(round.groupName)}-${slugify(title)}`,
            title,
            artist: round.groupName,
            album: null,
            coverImage: meta.coverImage,
            previewUrl: meta.previewUrl,
            difficulty: null,
            sources: ["mainQuizRounds"],
            sourceFields: ["favoriteSong.choices"],
            signalCount: 1,
            popularityScore: extra.answers?.includes(title) ? 3 : 1,
          };
        }),
      ),
  );
}

function collectDebutSongs() {
  return Object.entries(groupVerifiedFacts)
    .filter(([, facts]) => facts.debutSong)
    .map(([artist, facts]) => {
      const meta = getSongMeta(artist, facts.debutSong);

      return {
        id: `${slugify(artist)}-${slugify(facts.debutSong)}`,
        title: facts.debutSong,
        artist,
        album: null,
        coverImage: meta.coverImage,
        previewUrl: meta.previewUrl,
        difficulty: "easy",
        sources: ["groupVerifiedFacts"],
        sourceFields: ["debutSong"],
        signalCount: 2,
        popularityScore: 3,
      };
    });
}

function normalizeSongSeeds(playlistSongs) {
  return playlistSongs.map((song) => {
    const meta = getSongMeta(song.artist, song.title);

    return {
      ...song,
      coverImage: meta.coverImage ?? song.coverImage ?? null,
      previewUrl: meta.previewUrl ?? song.previewUrl ?? null,
      sources: ["playlistSeed"],
      sourceFields: ["playlistSongs"],
      signalCount: 2,
      popularityScore: song.difficulty === "easy" ? 3 : song.difficulty === "medium" ? 2 : 1,
    };
  });
}

function buildNormalizedSongs({ playlistSongs }) {
  const supportedGroups = buildSupportedGroupSet();
  const skippedItems = [];

  const mergedSongs = dedupeBy(
    [...normalizeSongSeeds(playlistSongs), ...collectRoundSongs(), ...collectDebutSongs()],
    (song) => buildSongKey(song.artist, song.title),
    mergeSongEntries,
  )
    .filter((song) => {
      const reason = detectTrackExclusionReason({
        title: song.title,
        releaseTitle: song.album,
        artist: song.artist,
        supportedGroups,
      });

      if (reason) {
        skippedItems.push({
          type: "song",
          artist: song.artist,
          title: song.title,
          reason,
        });
        return false;
      }

      return true;
    })
    .map((song) => ({
      ...song,
      difficulty: pickSongDifficulty(song),
      choiceLabel: buildSongChoiceLabel(song),
    }));

  const tasteSignalKeys = new Set(
    playlistTasteSignals.map((entry) =>
      buildSongKey(canonicalArtistName(entry.artist), entry.title),
    ),
  );

  const boostedSongs = mergedSongs.map((song) => {
    const key = buildSongKey(song.artist, song.title);
    const hasTasteSignal = tasteSignalKeys.has(key);

    return {
      ...song,
      signalCount: (song.signalCount ?? 0) + (hasTasteSignal ? 2 : 0),
      popularityScore: (song.popularityScore ?? 0) + (hasTasteSignal ? 2 : 0),
      sources: hasTasteSignal
        ? [...new Set([...(song.sources ?? []), playlistTasteSignalSource.url])]
        : song.sources,
      tasteSignal: hasTasteSignal,
    };
  });

  return {
    songs: boostedSongs,
    skippedItems,
  };
}

function buildEmojiQuestions(songs) {
  const skippedItems = [];
  const choicePool = songs.map((song) => song.choiceLabel);

  const questions = songs
    .map((song) => {
      const promptVariants = buildEmojiClueVariants(song.title);
      if (!promptVariants.length) {
        skippedItems.push({
          type: "emoji-song-guess",
          artist: song.artist,
          title: song.title,
          reason: "no_playable_emoji_clue",
        });
        return null;
      }

      const plausibleChoices = songs
        .filter((entry) => entry.artist !== song.artist || entry.id !== song.id)
        .filter((entry) => entry.difficulty === song.difficulty || entry.artist === song.artist)
        .sort((left, right) => {
          const leftScore =
            (left.artist === song.artist ? 3 : 0) +
            (left.tasteSignal ? 2 : 0) +
            Math.max(0, 3 - Math.abs(difficultyRank(left.difficulty) - difficultyRank(song.difficulty)));
          const rightScore =
            (right.artist === song.artist ? 3 : 0) +
            (right.tasteSignal ? 2 : 0) +
            Math.max(0, 3 - Math.abs(difficultyRank(right.difficulty) - difficultyRank(song.difficulty)));
          return rightScore - leftScore;
        })
        .map((entry) => entry.choiceLabel);

      return {
        id: `emoji-${song.id}`,
        modeId: "emoji-song-guess",
        artist: song.artist,
        title: song.title,
        difficulty: song.difficulty,
        prompt: promptVariants[0],
        promptVariants,
        answer: song.choiceLabel,
        choicePool: [...new Set([song.choiceLabel, ...plausibleChoices, ...choicePool])],
        provenance: song.sources,
        coverImage: song.coverImage,
      };
    })
    .filter(Boolean);

  return { questions, skippedItems };
}

function buildAlbumQuestions(songs) {
  const skippedItems = [];

  const releases = dedupeBy(
    songs
      .filter((song) => song.album && song.coverImage)
      .map((song) => ({
        id: `${slugify(song.artist)}-${slugify(song.album)}`,
        artist: song.artist,
        album: song.album,
        coverImage: song.coverImage,
        difficulty: song.difficulty,
        sources: song.sources,
      })),
    (release) => buildReleaseKey(release.artist, release.album),
    (left, right) => ({
      ...left,
      ...right,
      difficulty:
        difficultyRank(left.difficulty) <= difficultyRank(right.difficulty)
          ? left.difficulty
          : right.difficulty,
      sources: [...new Set([...(left.sources ?? []), ...(right.sources ?? [])])],
    }),
  );

  const choicePool = releases.map((release) => buildAlbumChoiceLabel(release));

  const questions = releases
    .map((release) => {
      if (!release.coverImage) {
        skippedItems.push({
          type: "album-cover-zoom",
          artist: release.artist,
          release: release.album,
          reason: "missing_cover_image",
        });
        return null;
      }

      return {
        id: `album-${release.id}`,
        modeId: "album-cover-zoom",
        artist: release.artist,
        title: release.album,
        difficulty: release.difficulty,
        coverImage: release.coverImage,
        answer: buildAlbumChoiceLabel(release),
        choicePool: [
          buildAlbumChoiceLabel(release),
          ...releases
            .filter((entry) => entry.id !== release.id)
            .sort((left, right) => {
              const leftScore =
                (left.artist === release.artist ? 3 : 0) +
                Math.max(
                  0,
                  3 - Math.abs(difficultyRank(left.difficulty) - difficultyRank(release.difficulty)),
                );
              const rightScore =
                (right.artist === release.artist ? 3 : 0) +
                Math.max(
                  0,
                  3 - Math.abs(difficultyRank(right.difficulty) - difficultyRank(release.difficulty)),
                );
              return rightScore - leftScore;
            })
            .map((entry) => buildAlbumChoiceLabel(entry)),
          ...choicePool,
        ],
        cropVariants: buildAlbumCropVariants({ id: release.id, difficulty: release.difficulty }),
        provenance: release.sources,
      };
    })
    .filter(Boolean);

  return { questions, skippedItems };
}

function buildLightstickQuestions() {
  const skippedItems = [];
  const supportedGroups = getSupportedPlaylistGroups();
  const facts = supportedGroups
    .map((artist) => ({
      artist,
      lightstickName: groupVerifiedFacts[artist]?.lightstick ?? null,
      imageUrl: lightstickImageSources[artist]?.imageUrl ?? null,
      source: lightstickImageSources[artist]?.source ?? null,
    }))
    .filter((entry) => entry.lightstickName);

  const choicePool = facts.map((entry) => entry.artist);

  const questions = facts
    .map((entry) => {
      if (!entry.imageUrl) {
        skippedItems.push({
          type: "lightstick-silhouette-guess",
          artist: entry.artist,
          reason: "missing_verified_image",
        });
        return null;
      }

      return {
        id: `lightstick-${slugify(entry.artist)}`,
        modeId: "lightstick-silhouette-guess",
        artist: entry.artist,
        title: entry.lightstickName,
        difficulty: ["TWICE", "LE SSERAFIM", "NewJeans"].includes(entry.artist)
          ? "easy"
          : "medium",
        answer: entry.artist,
        choicePool,
        lightstickName: entry.lightstickName,
        imageUrl: entry.imageUrl,
        renderVariants: buildLightstickRenderVariants({
          id: entry.artist,
          difficulty: ["TWICE", "LE SSERAFIM", "NewJeans"].includes(entry.artist)
            ? "easy"
            : "medium",
        }),
        provenance: ["groupVerifiedFacts", entry.source],
      };
    })
    .filter(Boolean);

  return { questions, skippedItems };
}

export function buildPlaylistModeCatalog({ playlistSongs }) {
  const normalized = buildNormalizedSongs({ playlistSongs });
  const emojiCatalog = buildEmojiQuestions(normalized.songs);
  const albumCatalog = buildAlbumQuestions(normalized.songs);
  const lightstickCatalog = buildLightstickQuestions();
  const playlistGroupOptions = getSupportedPlaylistGroups();

  return {
    songs: normalized.songs,
    emojiSongGuessQuestions: emojiCatalog.questions,
    albumCoverZoomQuestions: albumCatalog.questions,
    lightstickSilhouetteQuestions: lightstickCatalog.questions,
    playlistGroupOptions,
    diagnostics: {
      tasteSignalSource: playlistTasteSignalSource,
      supportedGroups: playlistGroupOptions,
      totalSongs: normalized.songs.length,
      totalEmojiQuestions: emojiCatalog.questions.length,
      totalAlbumQuestions: albumCatalog.questions.length,
      totalLightstickQuestions: lightstickCatalog.questions.length,
      tasteSignalMatches: normalized.songs.filter((song) => song.tasteSignal).length,
      skippedItems: [
        ...normalized.skippedItems,
        ...emojiCatalog.skippedItems,
        ...albumCatalog.skippedItems,
        ...lightstickCatalog.skippedItems,
      ],
    },
  };
}

export function buildQuestionChoices(question, seed, size = 4) {
  const pool = [...question.choicePool.filter((choice) => choice !== question.answer)];
  const distractors = [];

  while (pool.length && distractors.length < Math.max(0, size - 1)) {
    const index = getStableHash(`${seed}-${question.id}-${pool.length}`) % pool.length;
    distractors.push(pool.splice(index, 1)[0]);
  }

  const answerPool = [question.answer, ...distractors];
  const ordered = [];

  while (answerPool.length) {
    const index = getStableHash(`${seed}-${question.id}-answer-${answerPool.length}`) % answerPool.length;
    ordered.push(answerPool.splice(index, 1)[0]);
  }

  return ordered;
}

export function buildSessionQuestionSet(questions, count, seed, recentIds = []) {
  const recentSet = new Set(recentIds);
  const freshQuestions = questions.filter((question) => !recentSet.has(question.id));
  const fallbackQuestions = questions.filter((question) => recentSet.has(question.id));
  const ordered = [
    ...seededSort(freshQuestions, `${seed}-fresh`, (question) => question.id),
    ...seededSort(fallbackQuestions, `${seed}-fallback`, (question) => question.id),
  ];

  return ordered.slice(0, Math.min(count, ordered.length));
}
