import { SUPPORTED_QUESTION_CATEGORIES } from "./schema.js";

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function chooseDistractors(pool, answer, count) {
  return [...new Set(pool.filter((value) => value && value !== answer))].slice(0, count);
}

function createQuestion({
  id,
  groupName,
  category,
  difficulty,
  gameMode,
  prompt,
  answer,
  choices,
  provenance,
  tags = [],
}) {
  return {
    id,
    groupName,
    category,
    difficulty,
    gameMode,
    prompt,
    answer,
    choices,
    provenance,
    tags,
  };
}

function indexQuestions(questions) {
  return {
    byCategory: Object.fromEntries(
      SUPPORTED_QUESTION_CATEGORIES.map((category) => [
        category,
        questions.filter((question) => question.category === category).map((question) => question.id),
      ]),
    ),
    byDifficulty: {
      easy: questions.filter((question) => question.difficulty === "easy").map((question) => question.id),
      medium: questions.filter((question) => question.difficulty === "medium").map((question) => question.id),
      hard: questions.filter((question) => question.difficulty === "hard").map((question) => question.id),
      expert: questions.filter((question) => question.difficulty === "expert").map((question) => question.id),
    },
    byGameMode: questions.reduce((accumulator, question) => {
      if (!accumulator[question.gameMode]) accumulator[question.gameMode] = [];
      accumulator[question.gameMode].push(question.id);
      return accumulator;
    }, {}),
  };
}

function buildMainGameQuestions(profile, allProfiles) {
  const groupFacts = profile.factPool.filter((fact) => fact.category === "group_identity");
  const memberFacts = profile.factPool.filter((fact) => fact.category === "member_identity");
  const roleFacts = profile.factPool.filter((fact) => fact.category === "member_role");
  const songFacts = profile.factPool.filter((fact) => fact.category === "title_track");
  const groupNames = allProfiles.map((entry) => entry.groupName);
  const questions = [];

  if (groupFacts[0]) {
    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-identify-group`,
        groupName: profile.groupName,
        category: "identify-the-group",
        difficulty: "easy",
        gameMode: "main-game",
        prompt: `Which group is this round built around?`,
        answer: profile.groupName,
        choices: [profile.groupName, ...chooseDistractors(groupNames, profile.groupName, 3)],
        provenance: groupFacts[0].sources,
        tags: ["round-intro"],
      }),
    );
  }

  memberFacts.forEach((fact) => {
    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-identify-member-${slugify(fact.value)}`,
        groupName: profile.groupName,
        category: "identify-the-member",
        difficulty: fact.suggestedDifficulty,
        gameMode: "main-game",
        prompt: `Which member belongs to ${profile.groupName}?`,
        answer: fact.value,
        choices: [fact.value, ...chooseDistractors(memberFacts.map((item) => item.value), fact.value, 3)],
        provenance: fact.sources,
        tags: ["member-phase"],
      }),
    );
  });

  roleFacts.forEach((fact) => {
    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-${slugify(fact.type)}`,
        groupName: profile.groupName,
        category: "match-member-to-fact",
        difficulty: fact.suggestedDifficulty,
        gameMode: "main-game",
        prompt: `Who is the ${fact.label.toLowerCase()} for ${profile.groupName}?`,
        answer: fact.value,
        choices: [fact.value, ...chooseDistractors(memberFacts.map((item) => item.value), fact.value, 3)],
        provenance: fact.sources,
        tags: ["extra-phase"],
      }),
    );
  });

  songFacts.slice(0, 4).forEach((fact) => {
    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-identify-song-${slugify(fact.value)}`,
        groupName: profile.groupName,
        category: "identify-the-song",
        difficulty: fact.suggestedDifficulty,
        gameMode: "main-game",
        prompt: `Which song should count as a title track for ${profile.groupName}?`,
        answer: fact.value,
        choices: [fact.value, ...chooseDistractors(songFacts.map((item) => item.value), fact.value, 3)],
        provenance: fact.sources,
        tags: ["extra-phase"],
      }),
    );
  });

  return questions;
}

function buildModeQuestions(profile) {
  const questions = [];
  const albumFacts = profile.factPool.filter((fact) => fact.category === "album");
  const lightstickFacts = profile.factPool.filter((fact) => fact.category === "lightstick");
  const lyricFacts = profile.factPool.filter((fact) => fact.category === "lyric");
  const songFacts = profile.factPool.filter((fact) => ["title_track", "b_side"].includes(fact.category));
  const communityFacts = profile.factPool.filter((fact) => ["community", "notable_fact"].includes(fact.category));

  albumFacts.forEach((fact) => {
    if (!fact.albumCover) return;
    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-album-cover-${slugify(fact.value)}`,
        groupName: profile.groupName,
        category: "identify-the-album",
        difficulty: fact.suggestedDifficulty,
        gameMode: "album-cover-zoom",
        prompt: fact.albumCover,
        answer: fact.value,
        choices: [fact.value, ...chooseDistractors(albumFacts.map((item) => item.value), fact.value, 3)],
        provenance: fact.sources,
      }),
    );
  });

  lightstickFacts.forEach((fact) => {
    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-lightstick-${slugify(fact.value)}`,
        groupName: profile.groupName,
        category: "identify-the-lightstick",
        difficulty: fact.suggestedDifficulty,
        gameMode: "lightstick-silhouette-guess",
        prompt: fact.imageUrl ?? fact.value,
        answer: profile.groupName,
        choices: [profile.groupName],
        provenance: fact.sources,
      }),
    );
  });

  lyricFacts.forEach((fact) => {
    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-lyric-${slugify(fact.value)}`,
        groupName: profile.groupName,
        category: "match-lyric-to-song",
        difficulty: fact.suggestedDifficulty,
        gameMode: "finish-the-lyric",
        prompt: `${fact.snippet}...`,
        answer: fact.value,
        choices: [fact.value, ...chooseDistractors(songFacts.map((item) => item.value), fact.value, 3)],
        provenance: fact.sources,
      }),
    );
  });

  songFacts.forEach((fact) => {
    if (!fact.albumTitle) return;

    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-song-album-${slugify(fact.value)}`,
        groupName: profile.groupName,
        category: "match-song-to-album",
        difficulty: fact.suggestedDifficulty,
        gameMode: "main-game",
        prompt: `Which album should you match with ${fact.value}?`,
        answer: fact.albumTitle,
        choices: [fact.albumTitle, ...chooseDistractors(albumFacts.map((item) => item.value), fact.albumTitle, 3)],
        provenance: fact.sources,
      }),
    );
  });

  if (albumFacts.filter((fact) => fact.releaseDate).length >= 3) {
    const ordered = albumFacts.filter((fact) => fact.releaseDate).slice(0, 3).map((fact) => fact.value);
    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-release-order`,
        groupName: profile.groupName,
        category: "release-order",
        difficulty: "hard",
        gameMode: "main-game",
        prompt: `Which album came first for ${profile.groupName}?`,
        answer: ordered[0],
        choices: ordered,
        provenance: albumFacts.flatMap((fact) => fact.sources),
      }),
    );
  }

  communityFacts.forEach((fact, index) => {
    const category = index % 2 === 0 ? "which-statement-is-true" : "clue-reveal-round";
    questions.push(
      createQuestion({
        id: `${slugify(profile.groupName)}-${category}-${index + 1}`,
        groupName: profile.groupName,
        category,
        difficulty: fact.suggestedDifficulty,
        gameMode: "main-game",
        prompt:
          category === "which-statement-is-true"
            ? `Which statement is true about ${profile.groupName}?`
            : `Clue reveal: which group fits this fact? ${fact.value}`,
        answer: category === "which-statement-is-true" ? fact.value : profile.groupName,
        choices: [category === "which-statement-is-true" ? fact.value : profile.groupName],
        provenance: fact.sources,
      }),
    );
  });

  return questions;
}

function buildMixedGroupQuestions(allProfiles) {
  const questions = [];
  const allGroupNames = allProfiles.map((profile) => profile.groupName);
  const allFandomFacts = allProfiles.flatMap((profile) =>
    profile.factPool.filter((fact) => fact.category === "fandom").map((fact) => ({
      ...fact,
      groupName: profile.groupName,
    })),
  );

  allProfiles.forEach((profile) => {
    const memberFacts = profile.factPool.filter((fact) => fact.category === "member_identity");
    memberFacts.slice(0, 2).forEach((fact) => {
      questions.push(
        createQuestion({
          id: `mixed-identify-group-${slugify(profile.groupName)}-${slugify(fact.value)}`,
          groupName: "Mixed",
          category: "identify-the-group",
          difficulty: "easy",
          gameMode: "mixed-group",
          prompt: `${fact.value} belongs to which group?`,
          answer: profile.groupName,
          choices: [profile.groupName, ...chooseDistractors(allGroupNames, profile.groupName, 3)],
          provenance: fact.sources,
        }),
      );
    });
  });

  allFandomFacts.forEach((fact) => {
    questions.push(
      createQuestion({
        id: `mixed-true-statement-${slugify(fact.groupName)}`,
        groupName: "Mixed",
        category: "which-statement-is-true",
        difficulty: fact.suggestedDifficulty,
        gameMode: "mixed-group",
        prompt: "Which statement is true?",
        answer: `${fact.groupName}'s fandom is ${fact.value}.`,
        choices: [
          `${fact.groupName}'s fandom is ${fact.value}.`,
          ...chooseDistractors(
            allFandomFacts.map((entry) => `${entry.groupName}'s fandom is ${entry.value}.`),
            `${fact.groupName}'s fandom is ${fact.value}.`,
            3,
          ),
        ],
        provenance: fact.sources,
      }),
    );
  });

  return questions;
}

export function generateQuestionBank(profiles) {
  const groupBanks = {};

  profiles.forEach((profile) => {
    const mainGameQuestions = buildMainGameQuestions(profile, profiles);
    const modeQuestions = buildModeQuestions(profile);
    const speedRoundQuestions = [...mainGameQuestions, ...modeQuestions]
      .filter((question) => ["easy", "medium"].includes(question.difficulty))
      .slice(0, 6)
      .map((question, index) => ({
        ...question,
        id: `${question.id}-speed-${index + 1}`,
        category: "speed-round",
        gameMode: "main-game",
      }));

    const allQuestions = [...mainGameQuestions, ...modeQuestions, ...speedRoundQuestions];
    profile.mainGameRoundPlan.questionIds = mainGameQuestions.map((question) => question.id);

    groupBanks[profile.groupName] = {
      groupName: profile.groupName,
      factPool: profile.factPool,
      mainGameRoundPlan: profile.mainGameRoundPlan,
      questions: allQuestions,
      indexes: indexQuestions(allQuestions),
    };
  });

  const mixedGroupQuestions = buildMixedGroupQuestions(profiles);

  return {
    groupBanks,
    mixedGroupBank: {
      groupName: "Mixed",
      questions: mixedGroupQuestions,
      indexes: indexQuestions(mixedGroupQuestions),
    },
  };
}
