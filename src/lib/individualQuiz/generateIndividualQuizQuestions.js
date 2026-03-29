import {
  INDIVIDUAL_QUIZ_CATEGORIES,
  INDIVIDUAL_QUIZ_DIFFICULTIES,
  INDIVIDUAL_QUIZ_TARGETS,
  INDIVIDUAL_TEMPLATE_CAPS,
  MAIN_GAME_TEMPLATE_FAMILIES,
} from "./schema.js";

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function stableSort(values, seed) {
  return [...values].sort((left, right) => {
    const leftKey = `${seed}-${JSON.stringify(left)}`;
    const rightKey = `${seed}-${JSON.stringify(right)}`;
    return leftKey.localeCompare(rightKey);
  });
}

function buildChoices(answer, pool, seed, size = 4) {
  const distractors = stableSort(
    pool.filter((value) => value && value !== answer),
    `${seed}-distractors`,
  ).slice(0, Math.max(0, size - 1));

  return stableSort(unique([answer, ...distractors]), `${seed}-choices`);
}

function mapDifficultyBand(band) {
  if (band === "hard") return "hard";
  if (band === "medium") return "medium";
  return "easy";
}

function createQuestion({
  profile,
  id,
  difficulty,
  category,
  templateFamily,
  prompt,
  answer,
  choices,
  provenance,
  confidenceScore,
  funScore,
  uniquenessScore,
  fairnessRating,
  coverImage = null,
  image = null,
  metadata = {},
}) {
  return {
    id,
    group: profile.groupName,
    difficulty,
    category,
    gameMode: "individual-group-quiz",
    prompt,
    answer,
    choices,
    sourceProvenance: provenance,
    confidenceScore,
    funScore,
    uniquenessScore,
    fairnessRating,
    templateFamily,
    overlapRisk: MAIN_GAME_TEMPLATE_FAMILIES.has(templateFamily) ? "blocked" : "safe",
    coverImage,
    image,
    metadata,
  };
}

function confidenceForSources(sources) {
  const normalized = unique(sources);
  return Math.min(1, 0.72 + normalized.length * 0.08);
}

function normalizeFactDifficulty(value) {
  if (value === "expert") return "expert";
  if (value === "hard") return "hard";
  if (value === "medium") return "medium";
  return "easy";
}

function pickOutsiderSongs(allProfiles, groupName, count) {
  return unique(
    allProfiles
      .filter((profile) => profile.groupName !== groupName)
      .flatMap((profile) => profile.songs.map((song) => song.title)),
  ).slice(0, count);
}

function pickOutsiderAlbums(allProfiles, groupName, count) {
  return unique(
    allProfiles
      .filter((profile) => profile.groupName !== groupName)
      .flatMap((profile) => profile.albums.map((album) => album.title)),
  ).slice(0, count);
}

function pickOutsiderMembers(allProfiles, groupName, count) {
  return unique(
    allProfiles
      .filter((profile) => profile.groupName !== groupName)
      .flatMap((profile) => profile.members.map((member) => member.name)),
  ).slice(0, count);
}

function buildTemplateCandidates(profile, allProfiles) {
  const candidates = [];
  const memberNames = profile.members.map((member) => member.name);
  const memberNamePool = unique(allProfiles.flatMap((entry) => entry.members.map((member) => member.name)));
  const songTitles = profile.songs.map((song) => song.title);
  const albumTitles = profile.albums.map((album) => album.title);
  const outsiderSongs = pickOutsiderSongs(allProfiles, profile.groupName, 80);
  const outsiderAlbums = pickOutsiderAlbums(allProfiles, profile.groupName, 40);
  const outsiderMembers = pickOutsiderMembers(allProfiles, profile.groupName, 80);
  const fandomValuePool = unique(
    allProfiles.flatMap((entry) => entry.fandomFacts.map((fact) => fact.value)),
  );
  const allSeriesTitles = unique(
    allProfiles.flatMap((entry) =>
      entry.fandomFacts.filter((fact) => fact.kind === "varietySeries").map((fact) => fact.value),
    ),
  );
  const allOriginValues = unique(
    allProfiles.flatMap((entry) =>
      entry.fandomFacts.filter((fact) => fact.kind === "originStory").map((fact) => fact.value),
    ),
  );
  const allAchievementValues = unique(
    allProfiles.flatMap((entry) =>
      entry.fandomFacts.filter((fact) => fact.kind === "achievementAnswer").map((fact) => fact.value),
    ),
  );

  profile.deepFacts.memberCredits.forEach((fact, index) => {
    const difficulty = normalizeFactDifficulty(fact.difficulty);
    const provenance = [fact.source];

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-member-credit-member-${index + 1}`,
        difficulty,
        category: "members",
        templateFamily: "member-credit-spotlight",
        prompt: `Which ${profile.groupName} member is tied to ${fact.contribution} on "${fact.songTitle}"?`,
        answer: fact.member,
        choices: buildChoices(fact.member, memberNamePool, `${profile.groupName}-member-credit-member-${index}`),
        provenance,
        confidenceScore: confidenceForSources(provenance),
        funScore: 0.93,
        uniquenessScore: 0.92,
        fairnessRating: 0.9,
        metadata: {
          sourceUrl: fact.sourceUrl ?? null,
          songTitle: fact.songTitle,
          contribution: fact.contribution,
          albumTitle: fact.albumTitle ?? null,
        },
      }),
    );

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-member-credit-song-${index + 1}`,
        difficulty: difficulty === "easy" ? "medium" : difficulty,
        category: "match-based",
        templateFamily: "member-credit-song-lock",
        prompt: `${fact.member} is credited for ${fact.contribution} on which ${profile.groupName} song?`,
        answer: fact.songTitle,
        choices: buildChoices(fact.songTitle, songTitles, `${profile.groupName}-member-credit-song-${index}`),
        provenance,
        confidenceScore: confidenceForSources(provenance),
        funScore: 0.92,
        uniquenessScore: 0.91,
        fairnessRating: 0.89,
        metadata: {
          sourceUrl: fact.sourceUrl ?? null,
          member: fact.member,
          contribution: fact.contribution,
          albumTitle: fact.albumTitle ?? null,
        },
      }),
    );

    if (fact.albumTitle) {
      candidates.push(
        createQuestion({
          profile,
          id: `${slugify(profile.groupName)}-member-credit-album-${index + 1}`,
          difficulty: difficulty === "easy" ? "medium" : "hard",
          category: "clue-based",
          templateFamily: "member-credit-era-clue",
          prompt: `Deep-fan clue for ${profile.groupName}: ${fact.member} has ${fact.contribution} credit on "${fact.songTitle}". Which release era does that point to?`,
          answer: fact.albumTitle,
          choices: buildChoices(fact.albumTitle, albumTitles, `${profile.groupName}-member-credit-album-${index}`),
          provenance,
          confidenceScore: confidenceForSources(provenance),
          funScore: 0.91,
          uniquenessScore: 0.92,
          fairnessRating: 0.86,
          metadata: {
            sourceUrl: fact.sourceUrl ?? null,
            member: fact.member,
            songTitle: fact.songTitle,
            contribution: fact.contribution,
          },
        }),
      );
    }
  });

  profile.deepFacts.videoClues.forEach((fact, index) => {
    const difficulty = normalizeFactDifficulty(fact.difficulty);
    const provenance = [fact.source];
    const answerPool = fact.answerType === "album" ? albumTitles : songTitles;

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-video-clue-${index + 1}`,
        difficulty,
        category: "variety-iconic-moments",
        templateFamily: "video-clue-spotlight",
        prompt: `Which ${profile.groupName} release fits this visual clue: ${fact.clue}?`,
        answer: fact.answer,
        choices: buildChoices(fact.answer, answerPool, `${profile.groupName}-video-clue-${index}`),
        provenance,
        confidenceScore: confidenceForSources(provenance),
        funScore: 0.95,
        uniquenessScore: 0.94,
        fairnessRating: 0.9,
        metadata: {
          sourceUrl: fact.sourceUrl ?? null,
          answerType: fact.answerType,
        },
      }),
    );

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-video-statement-${index + 1}`,
        difficulty: difficulty === "easy" ? "medium" : difficulty,
        category: "true-vs-false",
        templateFamily: "video-clue-true-check",
        prompt: `Which visual-era statement is actually true for ${profile.groupName}?`,
        answer: fact.answer,
        choices: buildChoices(fact.answer, answerPool, `${profile.groupName}-video-statement-${index}`),
        provenance,
        confidenceScore: confidenceForSources(provenance),
        funScore: 0.9,
        uniquenessScore: 0.9,
        fairnessRating: 0.87,
        metadata: {
          sourceUrl: fact.sourceUrl ?? null,
          clue: fact.clue,
          answerType: fact.answerType,
        },
      }),
    );
  });

  profile.deepFacts.releaseClues.forEach((fact, index) => {
    const difficulty = normalizeFactDifficulty(fact.difficulty);
    const provenance = [fact.source];
    const answerPool = fact.answerType === "song" ? songTitles : albumTitles;

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-release-clue-${index + 1}`,
        difficulty,
        category: "eras-comebacks",
        templateFamily: "release-story-clue",
        prompt: `Which ${profile.groupName} release matches this deeper clue: ${fact.clue}?`,
        answer: fact.answer,
        choices: buildChoices(fact.answer, answerPool, `${profile.groupName}-release-clue-${index}`),
        provenance,
        confidenceScore: confidenceForSources(provenance),
        funScore: 0.92,
        uniquenessScore: 0.92,
        fairnessRating: 0.88,
        metadata: {
          sourceUrl: fact.sourceUrl ?? null,
          answerType: fact.answerType,
        },
      }),
    );
  });

  profile.deepFacts.performanceClues.forEach((fact, index) => {
    const difficulty = normalizeFactDifficulty(fact.difficulty);
    const provenance = [fact.source];
    const answerPool =
      fact.answerType === "event"
        ? allAchievementValues.length
          ? allAchievementValues
          : [...songTitles, ...albumTitles]
        : fact.answerType === "album"
          ? albumTitles
          : songTitles;

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-performance-clue-${index + 1}`,
        difficulty,
        category: "variety-iconic-moments",
        templateFamily: "performance-moment-clue",
        prompt: `Recognize the ${profile.groupName} moment from this clue: ${fact.clue}`,
        answer: fact.answer,
        choices: buildChoices(fact.answer, answerPool, `${profile.groupName}-performance-clue-${index}`),
        provenance,
        confidenceScore: confidenceForSources(provenance),
        funScore: 0.94,
        uniquenessScore: 0.93,
        fairnessRating: 0.87,
        metadata: {
          sourceUrl: fact.sourceUrl ?? null,
          answerType: fact.answerType,
        },
      }),
    );
  });

  profile.visualFacts.forEach((fact, index) => {
    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-album-cover-${index + 1}`,
        difficulty: index < 3 ? "easy" : "medium",
        category: "album-covers",
        templateFamily: "album-cover-spotlight",
        prompt: `This ${profile.groupName} cover belongs to which release?`,
        answer: fact.value,
        choices: buildChoices(fact.value, albumTitles, `${profile.groupName}-album-cover-${index}`),
        provenance: [fact.source],
        confidenceScore: confidenceForSources([fact.source]),
        funScore: 0.9,
        uniquenessScore: 0.82,
        fairnessRating: 0.9,
        coverImage: fact.coverImage,
        metadata: { visualType: "album-cover" },
      }),
    );
  });

  profile.lyricPrompts.forEach((lyric, index) => {
    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-lyric-${index + 1}`,
        difficulty:
          profile.songs.find((song) => song.title === lyric.songTitle)?.familiarityBand === "hard"
            ? "hard"
            : index < 3
              ? "easy"
              : "medium",
        category: "lyrics",
        templateFamily: "lyric-finish-line",
        prompt: `${profile.groupName} lyric check: which song matches "${lyric.lyricLeadIn}..."?`,
        answer: lyric.songTitle,
        choices: buildChoices(lyric.songTitle, songTitles, `${profile.groupName}-lyric-${index}`),
        provenance: [lyric.source],
        confidenceScore: confidenceForSources([lyric.source]),
        funScore: 0.92,
        uniquenessScore: 0.84,
        fairnessRating: 0.89,
        metadata: { clueType: "lyric-snippet" },
      }),
    );
  });

  profile.songs.forEach((song, index) => {
    const songDifficulty = mapDifficultyBand(song.familiarityBand);

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-title-track-check-${index + 1}`,
        difficulty: song.isFavorite || songDifficulty === "easy" ? "easy" : "medium",
        category: "title-tracks",
        templateFamily: "title-track-spotlight",
        prompt: `Which ${profile.groupName} song feels like a real title-track lane pick here?`,
        answer: song.title,
        choices: buildChoices(song.title, [...songTitles, ...outsiderSongs], `${profile.groupName}-title-track-${index}`),
        provenance: song.sourceKinds,
        confidenceScore: confidenceForSources(song.sourceKinds),
        funScore: 0.83,
        uniquenessScore: 0.79,
        fairnessRating: 0.87,
      }),
    );

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-real-song-${index + 1}`,
        difficulty: songDifficulty,
        category: "discography",
        templateFamily: "real-song-check",
        prompt: `${profile.groupName} fan check: which of these songs is really theirs?`,
        answer: song.title,
        choices: buildChoices(song.title, [...songTitles, ...outsiderSongs], `${profile.groupName}-real-song-${index}`),
        provenance: song.sourceKinds,
        confidenceScore: confidenceForSources(song.sourceKinds),
        funScore: 0.86,
        uniquenessScore: 0.8,
        fairnessRating: 0.91,
        metadata: { songTitle: song.title },
      }),
    );

    if (song.albumTitle) {
      candidates.push(
        createQuestion({
          profile,
          id: `${slugify(profile.groupName)}-song-album-${index + 1}`,
          difficulty: songDifficulty === "easy" ? "medium" : songDifficulty,
          category: "match-based",
          templateFamily: "song-to-album-lock",
          prompt: `Which ${profile.groupName} release should you match with "${song.title}"?`,
          answer: song.albumTitle,
          choices: buildChoices(song.albumTitle, albumTitles, `${profile.groupName}-song-album-${index}`),
          provenance: song.sourceKinds,
          confidenceScore: confidenceForSources(song.sourceKinds),
          funScore: 0.85,
          uniquenessScore: 0.83,
          fairnessRating: 0.88,
          metadata: { songTitle: song.title, albumTitle: song.albumTitle },
        }),
      );

      const album = profile.albums.find((entry) => entry.title === song.albumTitle);

      if (album?.songTitles.length >= 2 && outsiderSongs[index]) {
        candidates.push(
          createQuestion({
            profile,
            id: `${slugify(profile.groupName)}-album-outsider-${index + 1}`,
            difficulty: songDifficulty === "easy" ? "medium" : "hard",
            category: "odd-one-out",
            templateFamily: "album-outsider-song",
            prompt: `Three of these tracks sit with ${song.albumTitle}. Which song is the outsider?`,
            answer: outsiderSongs[index],
            choices: stableSort(
              [...album.songTitles.slice(0, 3), outsiderSongs[index]],
              `${profile.groupName}-album-outsider-${index}`,
            ),
            provenance: song.sourceKinds,
            confidenceScore: confidenceForSources(song.sourceKinds),
            funScore: 0.89,
            uniquenessScore: 0.87,
            fairnessRating: 0.86,
          }),
        );
      }
    }

    if (song.coverImage) {
      candidates.push(
        createQuestion({
          profile,
          id: `${slugify(profile.groupName)}-cover-song-${index + 1}`,
          difficulty: song.isFavorite ? "easy" : songDifficulty,
          category: "title-tracks",
          templateFamily: "cover-to-song",
          prompt: `Which ${profile.groupName} song matches this release art?`,
          answer: song.title,
          choices: buildChoices(song.title, songTitles, `${profile.groupName}-cover-song-${index}`),
          provenance: song.sourceKinds,
          confidenceScore: confidenceForSources(song.sourceKinds),
          funScore: 0.88,
          uniquenessScore: 0.82,
          fairnessRating: 0.9,
          coverImage: song.coverImage,
          metadata: { songTitle: song.title, visualType: "cover-song" },
        }),
      );
    }

    if (song.emojiClue) {
      candidates.push(
        createQuestion({
          profile,
          id: `${slugify(profile.groupName)}-emoji-${index + 1}`,
          difficulty: songDifficulty === "hard" ? "medium" : songDifficulty,
          category: "clue-based",
          templateFamily: "emoji-song-clue",
          prompt: `${profile.groupName} emoji clue: ${song.emojiClue}`,
          answer: song.title,
          choices: buildChoices(song.title, songTitles, `${profile.groupName}-emoji-${index}`),
          provenance: song.sourceKinds,
          confidenceScore: confidenceForSources(song.sourceKinds),
          funScore: 0.94,
          uniquenessScore: 0.86,
          fairnessRating: 0.92,
        }),
      );
    }

    const trio = unique(
      stableSort(
        songTitles.filter((title) => title !== song.title),
        `${profile.groupName}-trio-${index}`,
      ).slice(0, 2),
    );

    if (trio.length === 2 && outsiderSongs[index]) {
      candidates.push(
        createQuestion({
          profile,
          id: `${slugify(profile.groupName)}-odd-song-${index + 1}`,
          difficulty: songDifficulty === "easy" ? "medium" : songDifficulty,
          category: "odd-one-out",
          templateFamily: "odd-one-out-song-pack",
          prompt: `One of these does not belong in ${profile.groupName}'s song list. Which one is the outsider?`,
          answer: outsiderSongs[index],
          choices: stableSort([song.title, ...trio, outsiderSongs[index]], `${profile.groupName}-odd-song-${index}`),
          provenance: [...song.sourceKinds, "cross-group-catalog"],
          confidenceScore: confidenceForSources(song.sourceKinds),
          funScore: 0.9,
          uniquenessScore: 0.86,
          fairnessRating: 0.9,
        }),
      );
    }

    if (song.albumTitle) {
      const album = profile.albums.find((entry) => entry.title === song.albumTitle);

      if (album && album.songTitles.length >= 2) {
        const albumClues = unique([song.albumTitle, ...album.songTitles.slice(0, 2)]);

        candidates.push(
          createQuestion({
            profile,
            id: `${slugify(profile.groupName)}-era-clue-${index + 1}`,
            difficulty: songDifficulty === "easy" ? "medium" : "hard",
            category: "eras-comebacks",
            templateFamily: "era-clue-pack",
            prompt: `Which ${profile.groupName} era fits this clue set: ${albumClues.join(" • ")}?`,
            answer: song.albumTitle,
            choices: buildChoices(song.albumTitle, albumTitles, `${profile.groupName}-era-${index}`),
            provenance: song.sourceKinds,
            confidenceScore: confidenceForSources(song.sourceKinds),
            funScore: 0.88,
            uniquenessScore: 0.88,
            fairnessRating: 0.84,
          }),
        );
      }
    }

    if (song.lyricLeadIn && song.albumTitle) {
      candidates.push(
        createQuestion({
          profile,
          id: `${slugify(profile.groupName)}-clue-song-${index + 1}`,
          difficulty: songDifficulty === "easy" ? "medium" : "hard",
          category: "clue-based",
          templateFamily: "multi-clue-song-reveal",
          prompt: `Name the ${profile.groupName} song from these clues: lyric "${song.lyricLeadIn}...", release "${song.albumTitle}", and a spot in this group's verified song pool.`,
          answer: song.title,
          choices: buildChoices(song.title, songTitles, `${profile.groupName}-clue-song-${index}`),
          provenance: [...song.sourceKinds],
          confidenceScore: confidenceForSources(song.sourceKinds),
          funScore: 0.91,
          uniquenessScore: 0.9,
          fairnessRating: 0.86,
        }),
      );
    }

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-song-statement-${index + 1}`,
        difficulty: songDifficulty === "easy" ? "medium" : "hard",
        category: "true-vs-false",
        templateFamily: "song-statement-check",
        prompt: `Which statement is real for ${profile.groupName}?`,
        answer: `"${song.title}" is in this group's verified song pool.`,
        choices: stableSort(
          [
            `"${song.title}" is in this group's verified song pool.`,
            `"${outsiderSongs[index] ?? "Unknown"}" is a verified ${profile.groupName} song.`,
            `"${outsiderSongs[index + 1] ?? "Unknown"}" belongs in ${profile.groupName}'s song lane.`,
            `"${outsiderSongs[index + 2] ?? "Unknown"}" is one of ${profile.groupName}'s verified releases.`,
          ],
          `${profile.groupName}-song-statement-${index}`,
        ),
        provenance: song.sourceKinds,
        confidenceScore: confidenceForSources(song.sourceKinds),
        funScore: 0.88,
        uniquenessScore: 0.84,
        fairnessRating: 0.87,
      }),
    );
  });

  profile.members.forEach((member, index) => {
    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-member-visual-${index + 1}`,
        difficulty: "easy",
        category: "visual-recognition",
        templateFamily: "member-spotlight-visual",
        prompt: `Which ${profile.groupName} member is on screen?`,
        answer: member.name,
        choices: buildChoices(member.name, memberNames, `${profile.groupName}-member-visual-${index}`),
        provenance: [member.source],
        confidenceScore: confidenceForSources([member.source]),
        funScore: 0.8,
        uniquenessScore: 0.7,
        fairnessRating: 0.94,
        image: member.image,
      }),
    );

    if (outsiderMembers[index]) {
      candidates.push(
        createQuestion({
          profile,
          id: `${slugify(profile.groupName)}-member-real-${index + 1}`,
          difficulty: "easy",
          category: "members",
          templateFamily: "real-member-check",
          prompt: `Which name is really part of ${profile.groupName}'s lineup?`,
          answer: member.name,
          choices: buildChoices(member.name, [...memberNames, ...outsiderMembers], `${profile.groupName}-member-real-${index}`),
          provenance: [member.source],
          confidenceScore: confidenceForSources([member.source]),
          funScore: 0.82,
          uniquenessScore: 0.78,
          fairnessRating: 0.94,
        }),
      );

      candidates.push(
        createQuestion({
          profile,
          id: `${slugify(profile.groupName)}-member-outsider-${index + 1}`,
          difficulty: "medium",
          category: "odd-one-out",
          templateFamily: "member-outsider-pack",
          prompt: `One of these names is not in ${profile.groupName}. Who is the outsider?`,
          answer: outsiderMembers[index],
          choices: stableSort(
            [member.name, ...memberNames.filter((name) => name !== member.name).slice(0, 2), outsiderMembers[index]],
            `${profile.groupName}-member-outsider-${index}`,
          ),
          provenance: [member.source, "cross-group-catalog"],
          confidenceScore: confidenceForSources([member.source]),
          funScore: 0.84,
          uniquenessScore: 0.81,
          fairnessRating: 0.92,
        }),
      );
    }
  });

  Object.entries(profile.memberRoles).forEach(([role, memberName], index) => {
    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-role-true-${index + 1}`,
        difficulty: role === "leader" ? "easy" : "medium",
        category: "members",
        templateFamily: "member-role-fact-check",
        prompt: `Which member is correctly tied to the ${role} role in ${profile.groupName}?`,
        answer: memberName,
        choices: buildChoices(memberName, memberNames, `${profile.groupName}-${role}-${index}`),
        provenance: ["mainQuizRounds"],
        confidenceScore: confidenceForSources(["mainQuizRounds"]),
        funScore: 0.79,
        uniquenessScore: 0.72,
        fairnessRating: 0.9,
      }),
    );

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-role-clue-${role}-${index + 1}`,
        difficulty: role === "leader" ? "medium" : "hard",
        category: "clue-based",
        templateFamily: "member-role-clue-pack",
        prompt: `This ${profile.groupName} clue points to which member: ${role} role spotlight, verified lineup, and fan-recognizable core profile?`,
        answer: memberName,
        choices: buildChoices(memberName, memberNames, `${profile.groupName}-role-clue-${role}-${index}`),
        provenance: ["mainQuizRounds"],
        confidenceScore: confidenceForSources(["mainQuizRounds"]),
        funScore: 0.83,
        uniquenessScore: 0.8,
        fairnessRating: 0.87,
      }),
    );
  });

  profile.albums.forEach((album, index) => {
    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-real-album-${index + 1}`,
        difficulty: index < 2 ? "easy" : "medium",
        category: "discography",
        templateFamily: "real-release-check",
        prompt: `Which release title really belongs to ${profile.groupName}?`,
        answer: album.title,
        choices: buildChoices(album.title, [...albumTitles, ...outsiderAlbums], `${profile.groupName}-real-album-${index}`),
        provenance: album.sourceKinds,
        confidenceScore: confidenceForSources(album.sourceKinds),
        funScore: 0.84,
        uniquenessScore: 0.79,
        fairnessRating: 0.9,
      }),
    );

    if (album.songTitles.length >= 2) {
      candidates.push(
        createQuestion({
          profile,
          id: `${slugify(profile.groupName)}-album-clue-${index + 1}`,
          difficulty: index < 2 ? "medium" : "hard",
          category: "clue-based",
          templateFamily: "album-clue-pack",
          prompt: `Which ${profile.groupName} release fits this clue set: ${album.songTitles.slice(0, 2).join(" • ")}?`,
          answer: album.title,
          choices: buildChoices(album.title, albumTitles, `${profile.groupName}-album-clue-${index}`),
          provenance: album.sourceKinds,
          confidenceScore: confidenceForSources(album.sourceKinds),
          funScore: 0.86,
          uniquenessScore: 0.85,
          fairnessRating: 0.88,
        }),
      );
    }
  });

  profile.fandomFacts.forEach((fact, index) => {
    const difficulty =
      ["fandom", "debutSong", "lightstick"].includes(fact.kind)
        ? "easy"
        : ["company", "varietySeries", "originStory"].includes(fact.kind)
          ? "medium"
          : "hard";

    const answerPool =
      fact.kind === "fandom"
        ? fandomValuePool
        : unique(
            allProfiles.flatMap((entry) =>
              entry.fandomFacts
                .filter((item) => item.kind === fact.kind)
                .map((item) => item.value),
            ),
          );

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-fact-${fact.kind}-${index + 1}`,
        difficulty,
        category:
          fact.kind === "varietySeries" || fact.kind === "originStory"
            ? "variety-iconic-moments"
            : "fandom-knowledge",
        templateFamily: `fact-spotlight-${fact.kind}`,
        prompt: (() => {
          if (fact.kind === "fandom") return `What is ${profile.groupName}'s fandom name?`;
          if (fact.kind === "lightstick") return `What is the official lightstick name for ${profile.groupName}?`;
          if (fact.kind === "company") return `Which company is tied to ${profile.groupName}?`;
          if (fact.kind === "debutSong") return `Which song launched ${profile.groupName}'s debut era?`;
          if (fact.kind === "varietySeries") return `Which variety series belongs to ${profile.groupName}?`;
          if (fact.kind === "originStory") return `Which origin story is connected to ${profile.groupName}?`;
          if (fact.kind === "nameMeaning") return `Which meaning best matches ${profile.groupName}?`;
          if (fact.kind === "achievementAnswer") return `Which notable answer belongs in ${profile.groupName}'s fan knowledge lane?`;
          if (fact.kind === "alias") return `Which alternate name is tied to ${profile.groupName}?`;
          return `Which fact correctly matches ${profile.groupName}?`;
        })(),
        answer: fact.value,
        choices: buildChoices(fact.value, answerPool, `${profile.groupName}-fact-${fact.kind}-${index}`),
        provenance: [fact.source],
        confidenceScore: confidenceForSources([fact.source]),
        funScore: 0.87,
        uniquenessScore: 0.85,
        fairnessRating: difficulty === "hard" ? 0.82 : 0.9,
      }),
    );

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-fact-statement-${fact.kind}-${index + 1}`,
        difficulty: difficulty === "easy" ? "medium" : difficulty,
        category:
          fact.kind === "varietySeries" || fact.kind === "originStory"
            ? "variety-iconic-moments"
            : "true-vs-false",
        templateFamily: `fact-statement-${fact.kind}`,
        prompt: `Which statement is actually true about ${profile.groupName}?`,
        answer: fact.value,
        choices: buildChoices(fact.value, answerPool, `${profile.groupName}-fact-statement-${fact.kind}-${index}`),
        provenance: [fact.source],
        confidenceScore: confidenceForSources([fact.source]),
        funScore: 0.88,
        uniquenessScore: 0.84,
        fairnessRating: 0.86,
      }),
    );

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-fact-clue-${fact.kind}-${index + 1}`,
        difficulty: difficulty === "easy" ? "medium" : "hard",
        category: "clue-based",
        templateFamily: `fact-clue-${fact.kind}`,
        prompt: `Fan clue pack for ${profile.groupName}: which answer fits this lane best? ${fact.kind.replace(/([A-Z])/g, " $1").toLowerCase()} spotlight, verified group context, and recognizable fan knowledge.`,
        answer: fact.value,
        choices: buildChoices(fact.value, answerPool, `${profile.groupName}-fact-clue-${fact.kind}-${index}`),
        provenance: [fact.source],
        confidenceScore: confidenceForSources([fact.source]),
        funScore: 0.87,
        uniquenessScore: 0.85,
        fairnessRating: 0.84,
      }),
    );
  });

  profile.songs.forEach((song, index) => {
    const falseSongA = outsiderSongs[index];
    const falseSongB = outsiderSongs[index + 1];
    const falseSongC = outsiderSongs[index + 2];

    if (!falseSongA || !falseSongB || !falseSongC) return;

    candidates.push(
      createQuestion({
        profile,
        id: `${slugify(profile.groupName)}-which-is-real-${index + 1}`,
        difficulty: song.familiarityBand === "hard" ? "hard" : "medium",
        category: "true-vs-false",
        templateFamily: "which-title-is-real",
        prompt: `Only one of these songs belongs to ${profile.groupName}. Which one is real?`,
        answer: song.title,
        choices: stableSort([song.title, falseSongA, falseSongB, falseSongC], `${profile.groupName}-which-real-${index}`),
        provenance: song.sourceKinds,
        confidenceScore: confidenceForSources(song.sourceKinds),
        funScore: 0.9,
        uniquenessScore: 0.87,
        fairnessRating: 0.91,
      }),
    );
  });

  return candidates.filter((candidate) => candidate.overlapRisk !== "blocked");
}

function buildCategoryTargets(profile, difficulty, targetCount) {
  const discographyWeight = Math.max(1, profile.dataSignals.discographyDepth);
  const visualWeight = Math.max(1, profile.dataSignals.visualDepth);
  const fandomWeight = Math.max(1, profile.dataSignals.fandomDepth);
  const memberWeight = Math.max(1, profile.dataSignals.memberDepth);
  const deepFactWeight = Math.max(1, profile.dataSignals.deepFactDepth);

  const baseWeights = {
    easy: {
      "discography": discographyWeight,
      "album-covers": visualWeight,
      "title-tracks": discographyWeight,
      "lyrics": 2,
      "fandom-knowledge": fandomWeight,
      "visual-recognition": memberWeight,
      "members": memberWeight + Math.round(deepFactWeight / 2),
      "true-vs-false": 2,
      "odd-one-out": 2,
      "clue-based": 1 + Math.round(deepFactWeight / 3),
      "variety-iconic-moments": Math.max(1, Math.round(deepFactWeight / 3)),
    },
    medium: {
      "discography": discographyWeight,
      "match-based": discographyWeight + Math.round(deepFactWeight / 3),
      "eras-comebacks": discographyWeight,
      "lyrics": 2,
      "fandom-knowledge": fandomWeight,
      "variety-iconic-moments": fandomWeight + Math.round(deepFactWeight / 2),
      "odd-one-out": 2,
      "true-vs-false": 2,
      "clue-based": 2 + Math.round(deepFactWeight / 2),
      "members": Math.max(1, Math.round(deepFactWeight / 2)),
    },
    hard: {
      "discography": discographyWeight,
      "b-sides": Math.max(2, discographyWeight - 1),
      "eras-comebacks": discographyWeight,
      "fandom-knowledge": fandomWeight,
      "variety-iconic-moments": fandomWeight + deepFactWeight,
      "odd-one-out": 2,
      "true-vs-false": 2,
      "clue-based": 3 + Math.round(deepFactWeight / 2),
      "match-based": 2 + Math.round(deepFactWeight / 3),
      "members": Math.max(1, Math.round(deepFactWeight / 2)),
    },
    expert: {
      "b-sides": Math.max(2, discographyWeight - 1),
      "eras-comebacks": discographyWeight,
      "fandom-knowledge": fandomWeight,
      "variety-iconic-moments": fandomWeight + deepFactWeight,
      "odd-one-out": 2,
      "true-vs-false": 2,
      "clue-based": 4 + Math.round(deepFactWeight / 2),
      "match-based": 2 + Math.round(deepFactWeight / 3),
      "members": Math.max(1, Math.round(deepFactWeight / 2)),
    },
  };

  const weights = baseWeights[difficulty] ?? {};
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;

  return Object.fromEntries(
    INDIVIDUAL_QUIZ_CATEGORIES.map((category) => {
      const weight = weights[category] ?? 0;
      const target = weight ? Math.max(1, Math.round((weight / totalWeight) * targetCount)) : 0;
      return [category, target];
    }),
  );
}

function selectQuestionsForDifficulty(profile, candidates, difficulty, targetCount) {
  const pool = candidates
    .filter((question) => question.difficulty === difficulty)
    .sort((left, right) => {
      const rightScore =
        right.funScore + right.uniquenessScore + right.fairnessRating + right.confidenceScore;
      const leftScore =
        left.funScore + left.uniquenessScore + left.fairnessRating + left.confidenceScore;
      return rightScore - leftScore;
    });

  const templateCap = INDIVIDUAL_TEMPLATE_CAPS[difficulty] ?? 4;
  const categoryTargets = buildCategoryTargets(profile, difficulty, targetCount);
  const selected = [];
  const templateCounts = {};
  const categoryCounts = {};
  const usedQuestionIds = new Set();

  while (selected.length < targetCount) {
    const candidate = pool
      .filter((question) => !usedQuestionIds.has(question.id))
      .sort((left, right) => {
        const leftCategoryNeed =
          (categoryTargets[left.category] ?? 0) - (categoryCounts[left.category] ?? 0);
        const rightCategoryNeed =
          (categoryTargets[right.category] ?? 0) - (categoryCounts[right.category] ?? 0);
        const leftTemplateCount = templateCounts[left.templateFamily] ?? 0;
        const rightTemplateCount = templateCounts[right.templateFamily] ?? 0;
        const leftPenalty = leftTemplateCount * 0.25 + Math.max(0, -leftCategoryNeed) * 0.2;
        const rightPenalty = rightTemplateCount * 0.25 + Math.max(0, -rightCategoryNeed) * 0.2;
        const leftScore =
          left.funScore + left.uniquenessScore + left.fairnessRating + left.confidenceScore + Math.max(0, leftCategoryNeed) * 0.35 - leftPenalty;
        const rightScore =
          right.funScore + right.uniquenessScore + right.fairnessRating + right.confidenceScore + Math.max(0, rightCategoryNeed) * 0.35 - rightPenalty;
        return rightScore - leftScore;
      })
      .find((question) => {
        const previous = selected[selected.length - 1];
        const templateCount = templateCounts[question.templateFamily] ?? 0;
        const categoryCount = categoryCounts[question.category] ?? 0;
        const categoryTarget = categoryTargets[question.category] ?? 0;
        const atCategoryCap = categoryTarget > 0 && categoryCount >= categoryTarget + 2;

        if (templateCount >= templateCap) return false;
        if (previous?.templateFamily === question.templateFamily) return false;
        if (previous?.category === question.category && categoryCount >= 2) return false;
        if (atCategoryCap) return false;

        return true;
      });

    if (!candidate) break;

    selected.push(candidate);
    usedQuestionIds.add(candidate.id);
    templateCounts[candidate.templateFamily] = (templateCounts[candidate.templateFamily] ?? 0) + 1;
    categoryCounts[candidate.category] = (categoryCounts[candidate.category] ?? 0) + 1;
  }

  return selected;
}

function buildRoundStep(question, index) {
  return {
    id: question.id,
    type: "extra",
    key: `${question.templateFamily}-${index + 1}`,
    label: question.prompt,
    answer: question.answer,
    choices: question.choices,
    coverImage: question.coverImage,
    image: question.image,
    description: `${question.category} · ${question.difficulty}`,
    metadata: {
      category: question.category,
      templateFamily: question.templateFamily,
      sourceProvenance: question.sourceProvenance,
      confidenceScore: question.confidenceScore,
      funScore: question.funScore,
      uniquenessScore: question.uniquenessScore,
      fairnessRating: question.fairnessRating,
      ...question.metadata,
    },
  };
}

function buildExpertAvailability(profile, candidates) {
  const deepFactCount = profile.fandomFacts.filter((fact) =>
    ["originStory", "nameMeaning", "achievementAnswer", "alias", "varietySeries"].includes(fact.kind),
  ).length;
  const extendedDeepFactCount =
    deepFactCount +
    profile.deepFacts.memberCredits.length +
    profile.deepFacts.videoClues.length +
    profile.deepFacts.releaseClues.length +
    profile.deepFacts.performanceClues.length;
  const hardSongCount = profile.songs.filter((song) => song.familiarityBand === "hard").length;
  const expertCandidates = candidates.filter((question) => question.difficulty === "expert");
  return (
    extendedDeepFactCount >= 6 &&
    hardSongCount >= 4 &&
    expertCandidates.length >= INDIVIDUAL_QUIZ_TARGETS.expert
  );
}

function buildFallbackVariant(question, difficulty, index) {
  const promptPrefix =
    difficulty === "easy"
      ? "Starter-pack remix:"
      : difficulty === "medium"
        ? "Fan-level remix:"
        : "Deep-cut remix:";

  return {
    ...question,
    id: `${question.id}-variant-${difficulty}-${index + 1}`,
    difficulty,
    prompt: `${promptPrefix} ${question.prompt}`,
    templateFamily: `variant-${question.templateFamily}`,
    funScore: Math.max(0.72, question.funScore - 0.04),
    uniquenessScore: Math.max(0.68, question.uniquenessScore - 0.08),
    fairnessRating: Math.max(0.78, question.fairnessRating - 0.03),
  };
}

function topUpQuestions(profile, selected, candidates, difficulty, targetCount) {
  if (selected.length >= targetCount) return selected;

  const usedIds = new Set(selected.map((question) => question.id));
  const fallbackSources = candidates.filter(
    (question) =>
      !usedIds.has(question.id) &&
      question.difficulty !== difficulty &&
      !question.templateFamily.startsWith("variant-"),
  );

  const variants = [];

  for (const question of fallbackSources) {
    variants.push(buildFallbackVariant(question, difficulty, variants.length));
    if (selected.length + variants.length >= targetCount) break;
  }

  return [...selected, ...variants].slice(0, targetCount);
}

export function generateIndividualQuizMode(profile, allProfiles) {
  const candidates = buildTemplateCandidates(profile, allProfiles);
  const expertEnabled = buildExpertAvailability(profile, candidates);
  const difficulties = expertEnabled
    ? INDIVIDUAL_QUIZ_DIFFICULTIES
    : INDIVIDUAL_QUIZ_DIFFICULTIES.filter((difficulty) => difficulty !== "expert");

  const questionPools = Object.fromEntries(
    difficulties.map((difficulty) => [
      difficulty,
      topUpQuestions(
        profile,
        selectQuestionsForDifficulty(profile, candidates, difficulty, INDIVIDUAL_QUIZ_TARGETS[difficulty]),
        candidates,
        difficulty,
        INDIVIDUAL_QUIZ_TARGETS[difficulty],
      ),
    ]),
  );

  const rounds = difficulties.map((difficulty) => ({
    id: `${slugify(profile.groupName)}-${difficulty}`,
    groupName: profile.groupName,
    roundLabel: difficulty[0].toUpperCase() + difficulty.slice(1),
    members: profile.members.map((member) => ({
      name: member.name,
      image: member.image,
    })),
    customSteps: questionPools[difficulty].map(buildRoundStep),
  }));

  return {
    groupName: profile.groupName,
    rounds,
    questionPools,
    reviewQueue: profile.reviewQueue,
    coverage: Object.fromEntries(
      difficulties.map((difficulty) => [difficulty, questionPools[difficulty].length]),
    ),
  };
}
