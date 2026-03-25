import { mainQuizRounds } from "./mainQuizRounds";
import { lyricPrompts, playlistSongs } from "./playlistGamePacks";

export const jeopardyBoardValues = [100, 200, 300, 400, 500];
export const JEOPARDY_BOARD_CATEGORY_COUNT = 5;

const difficultyOrder = {
  easy: 1,
  medium: 2,
  hard: 3,
};

const groupReference = {
  "LE SSERAFIM": {
    fandom: "FEARNOT",
    debutSong: "FEARLESS",
    lightstick: "FIMBONG",
    varietySeries: "LENIVERSE",
  },
  IVE: {
    fandom: "DIVE",
    debutSong: "ELEVEN",
    lightstick: "IHABONG",
    varietySeries: "1,2,3 IVE",
  },
  NMIXX: {
    fandom: "NSWER",
    debutSong: "O.O",
    lightstick: "MIXXSTICK",
    varietySeries: "PICK NMIXX",
  },
  ILLIT: {
    fandom: "GLLIT",
    debutSong: "Magnetic",
  },
  ITZY: {
    fandom: "MIDZY",
    debutSong: "DALLA DALLA",
    lightstick: "Light Ring",
    varietySeries: "CSI",
  },
  STAYC: {
    fandom: "SWITH",
    debutSong: "SO BAD",
    varietySeries: "STAY:SEE",
  },
  KATSEYE: {
    fandom: "EYEKONS",
    debutSong: "Debut",
  },
  aespa: {
    fandom: "MY",
    debutSong: "Black Mamba",
    varietySeries: "aesparty",
  },
  NewJeans: {
    fandom: "Bunnies",
    debutSong: "Attention",
    lightstick: "Binky Bong",
    varietySeries: "Jeans' ZINE",
  },
  "G-(I)DLE": {
    fandom: "Neverland",
    debutSong: "LATATA",
    lightstick: "Never Bong",
    varietySeries: "I-TALK",
  },
  "Kiss of Life": {
    fandom: "KISSY",
    debutSong: "Shhh",
  },
  VIVIZ: {
    fandom: "Na.V",
    debutSong: "BOP BOP!",
    lightstick: "Daegal Bong",
  },
  BabyMonster: {
    fandom: "MONSTIEZ",
    debutSong: "BATTER UP",
    varietySeries: "Last Evaluation",
  },
  TWICE: {
    fandom: "ONCE",
    debutSong: "Like OOH-AHH",
    lightstick: "Candybong",
    varietySeries: "TIME TO TWICE",
  },
  XG: {
    fandom: "ALPHAZ",
    debutSong: "Tippy Toes",
    varietySeries: "XTRA XG",
  },
  Meovv: {
    debutSong: "MEOW",
  },
  Hearts2Hearts: {
    debutSong: "The Chase",
  },
  KiiiKiii: {
    debutSong: "I DO ME",
  },
};

function getStableHash(value) {
  return Array.from(String(value)).reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function sortWithSeed(values, seed) {
  return [...values].sort((left, right) => {
    const leftScore = getStableHash(`${seed}-${left.id ?? left.prompt ?? left}`);
    const rightScore = getStableHash(`${seed}-${right.id ?? right.prompt ?? right}`);
    return leftScore - rightScore;
  });
}

function uniqueBy(values, keyGetter) {
  const seen = new Set();
  return values.filter((value) => {
    const key = keyGetter(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getRoundExtra(round, key) {
  return round.extras.find((extra) => extra.key === key);
}

function getFavoriteExtra(round) {
  return round.extras.find((extra) => extra.kind === "favoriteSong" || extra.key === "favoriteSong");
}

function makeQuestion({
  id,
  prompt,
  answer,
  choices = [],
  difficulty = "medium",
  promptType = "text",
  image = null,
  note = null,
}) {
  return {
    id,
    prompt,
    answer,
    choices,
    difficulty,
    promptType,
    image,
    note,
  };
}

const allRounds = mainQuizRounds;
const allMembers = allRounds.flatMap((round) =>
  round.members.map((member) => ({
    ...member,
    groupName: round.groupName,
  })),
);
const allRoundNames = allRounds.map((round) => round.groupName);

function getWrongMembers(groupName, seed, count = 3) {
  return sortWithSeed(
    allMembers.filter((member) => member.groupName !== groupName),
    `${groupName}-${seed}-wrong-members`,
  )
    .slice(0, count)
    .map((member) => member.name);
}

function getWrongGroups(groupName, seed, count = 3) {
  return sortWithSeed(
    allRoundNames.filter((name) => name !== groupName),
    `${groupName}-${seed}-wrong-groups`,
  ).slice(0, count);
}

function buildGroupEssentialsCategory(round) {
  const leader = getRoundExtra(round, "leader");
  const maknae = getRoundExtra(round, "maknae");
  const bias = getRoundExtra(round, "bias");
  const favorite = getFavoriteExtra(round);
  const focusMember = sortWithSeed(round.members, `${round.id}-focus-member`)[0];
  const wrongMembers = getWrongMembers(round.groupName, "member");
  const wrongFavoriteSongs = sortWithSeed(
    playlistSongs
      .filter((song) => song.artist !== round.groupName)
      .map((song) => song.title),
    `${round.id}-wrong-favorites`,
  ).slice(0, 3);
  const reference = groupReference[round.groupName] ?? {};
  const fallbackQuestion = reference.fandom
    ? makeQuestion({
        id: `${round.id}-fandom`,
        prompt: `What is ${round.groupName}'s fandom name?`,
        answer: reference.fandom,
        difficulty: "hard",
      })
    : reference.debutSong
      ? makeQuestion({
          id: `${round.id}-debut`,
          prompt: `What debut song should you connect with ${round.groupName}?`,
          answer: reference.debutSong,
          difficulty: "hard",
        })
      : makeQuestion({
          id: `${round.id}-belongs`,
          prompt: `Which song is one of your main-game favorites for ${round.groupName}?`,
          answer: favorite?.answers?.[0] ?? favorite?.answer ?? "",
          choices: sortWithSeed(
            [favorite?.answers?.[0] ?? favorite?.answer ?? "", ...wrongFavoriteSongs],
            `${round.id}-belongs-choices`,
          ),
          difficulty: "hard",
        });

  return {
    id: `${round.id}-essentials`,
    title: `${round.groupName} Essentials`,
    groupTags: [round.groupName],
    questions: [
      makeQuestion({
        id: `${round.id}-leader-core`,
        prompt: `Who is the leader of ${round.groupName}?`,
        answer: leader?.answer ?? "",
        choices: leader?.choices ?? [],
        difficulty: "easy",
      }),
      makeQuestion({
        id: `${round.id}-member-count`,
        prompt: `How many members are in ${round.groupName} in your main-game round?`,
        answer: String(round.members.length),
        difficulty: "easy",
      }),
      makeQuestion({
        id: `${round.id}-favorite-core`,
        prompt: `Name one song from your favorites list for ${round.groupName}.`,
        answer: favorite?.answers?.[0] ?? favorite?.answer ?? "",
        choices: favorite?.choices ?? [],
        difficulty: "medium",
      }),
      makeQuestion({
        id: `${round.id}-maknae-core`,
        prompt: `Who is the maknae of ${round.groupName}?`,
        answer: maknae?.answer ?? "",
        choices: maknae?.choices ?? [],
        difficulty: "medium",
      }),
      makeQuestion({
        id: `${round.id}-member-belongs`,
        prompt: `Which of these is a member of ${round.groupName}?`,
        answer: focusMember?.name ?? "",
        choices: sortWithSeed(
          [focusMember?.name ?? "", ...wrongMembers],
          `${round.id}-member-belongs-choices`,
        ),
        difficulty: "medium",
      }),
      makeQuestion({
        id: `${round.id}-bias-core`,
        prompt: `Who is your bias for ${round.groupName}?`,
        answer: bias?.answer ?? "",
        choices: bias?.choices ?? [],
        difficulty: "hard",
      }),
      fallbackQuestion,
    ],
  };
}

const mainstreamRounds = allRounds.filter((round) => groupReference[round.groupName]?.fandom);

const leadersCategory = {
  id: "leaders-only",
  title: "Leaders Only",
  groupTags: mainstreamRounds.map((round) => round.groupName),
  questions: mainstreamRounds.slice(0, 7).map((round) => {
    const leader = getRoundExtra(round, "leader");
    return makeQuestion({
      id: `${round.id}-leaders-only`,
      prompt: `Who leads ${round.groupName}?`,
      answer: leader?.answer ?? "",
      choices: leader?.choices ?? [],
      difficulty: "easy",
    });
  }),
};

const maknaesCategory = {
  id: "maknae-line",
  title: "Maknae Line",
  groupTags: mainstreamRounds.map((round) => round.groupName),
  questions: mainstreamRounds.slice(0, 7).map((round) => {
    const maknae = getRoundExtra(round, "maknae");
    return makeQuestion({
      id: `${round.id}-maknae-line`,
      prompt: `Who is the maknae of ${round.groupName}?`,
      answer: maknae?.answer ?? "",
      choices: maknae?.choices ?? [],
      difficulty: "easy",
    });
  }),
};

const biasCategory = {
  id: "bias-vault",
  title: "Bias Vault",
  groupTags: allRounds.slice(0, 7).map((round) => round.groupName),
  questions: allRounds.slice(0, 7).map((round) => {
    const bias = getRoundExtra(round, "bias");
    return makeQuestion({
      id: `${round.id}-bias-vault`,
      prompt: `Who is your bias for ${round.groupName}?`,
      answer: bias?.answer ?? "",
      choices: bias?.choices ?? [],
      difficulty: "medium",
    });
  }),
};

const favoriteSongsCategory = {
  id: "favorite-song-vault",
  title: "Favorite Song Vault",
  groupTags: allRounds.slice(0, 7).map((round) => round.groupName),
  questions: allRounds.slice(0, 7).map((round) => {
    const favorite = getFavoriteExtra(round);
    return makeQuestion({
      id: `${round.id}-favorite-vault`,
      prompt: `Which song belongs in your favorites for ${round.groupName}?`,
      answer: favorite?.answers?.[0] ?? favorite?.answer ?? "",
      choices: favorite?.choices ?? [],
      difficulty: "medium",
    });
  }),
};

const memberCountsCategory = {
  id: "member-count-check",
  title: "Member Count Check",
  groupTags: allRounds.slice(0, 7).map((round) => round.groupName),
  questions: allRounds.slice(0, 7).map((round) =>
    makeQuestion({
      id: `${round.id}-member-count-check`,
      prompt: `How many members are in ${round.groupName}?`,
      answer: String(round.members.length),
      difficulty: "easy",
    }),
  ),
};

const debutCategory = {
  id: "debut-title-sprint",
  title: "Debut Title Sprint",
  groupTags: mainstreamRounds.slice(0, 7).map((round) => round.groupName),
  questions: mainstreamRounds.slice(0, 7).map((round) =>
    makeQuestion({
      id: `${round.id}-debut-title-sprint`,
      prompt: `What debut song should you match to ${round.groupName}?`,
      answer: groupReference[round.groupName]?.debutSong ?? "",
      difficulty: "hard",
    }),
  ),
};

const fandomCategory = {
  id: "fandom-roll-call",
  title: "Fandom Roll Call",
  groupTags: mainstreamRounds.slice(0, 7).map((round) => round.groupName),
  questions: mainstreamRounds.slice(0, 7).map((round) =>
    makeQuestion({
      id: `${round.id}-fandom-roll-call`,
      prompt: `What is ${round.groupName}'s fandom name?`,
      answer: groupReference[round.groupName]?.fandom ?? "",
      difficulty: "hard",
    }),
  ),
};

const lightstickRounds = allRounds.filter((round) => groupReference[round.groupName]?.lightstick);
const lightstickCategory = {
  id: "lightstick-shelf",
  title: "Lightstick Shelf",
  groupTags: lightstickRounds.slice(0, 7).map((round) => round.groupName),
  questions: lightstickRounds.slice(0, 7).map((round) =>
    makeQuestion({
      id: `${round.id}-lightstick-shelf`,
      prompt: `What lightstick name belongs to ${round.groupName}?`,
      answer: groupReference[round.groupName]?.lightstick ?? "",
      difficulty: "hard",
    }),
  ),
};

const varietyRounds = allRounds.filter((round) => groupReference[round.groupName]?.varietySeries);
const varietyCategory = {
  id: "youtube-variety-club",
  title: "YouTube Variety Club",
  groupTags: varietyRounds.slice(0, 7).map((round) => round.groupName),
  questions: varietyRounds.slice(0, 7).map((round) =>
    makeQuestion({
      id: `${round.id}-youtube-variety-club`,
      prompt: `Name one official content series tied to ${round.groupName}'s channel or core video content.`,
      answer: groupReference[round.groupName]?.varietySeries ?? "",
      difficulty: "hard",
    }),
  ),
};

const uniqueAlbums = uniqueBy(
  playlistSongs.map((song) => ({ album: song.album, artist: song.artist, title: song.title })),
  (entry) => `${entry.artist}::${entry.album}`,
);

const albumMatchCategory = {
  id: "album-match-up",
  title: "Album Match-Up",
  groupTags: uniqueAlbums.slice(0, 7).map((entry) => entry.artist),
  questions: uniqueAlbums.slice(0, 7).map((entry) =>
    makeQuestion({
      id: `${entry.artist}-${entry.title}-album-match-up`,
      prompt: `Which album goes with ${entry.title} by ${entry.artist}?`,
      answer: entry.album,
      difficulty: "medium",
    }),
  ),
};

const songByAlbumCategory = {
  id: "which-album-is-it-on",
  title: "Which Album Is It On?",
  groupTags: uniqueAlbums.slice(7, 14).map((entry) => entry.artist),
  questions: uniqueAlbums.slice(7, 14).map((entry) =>
    makeQuestion({
      id: `${entry.artist}-${entry.title}-which-album-is-it-on`,
      prompt: `Name one song from ${entry.album} by ${entry.artist}.`,
      answer: entry.title,
      difficulty: "medium",
    }),
  ),
};

const lyricCategory = {
  id: "finish-the-lyric-board",
  title: "Finish the Lyric",
  groupTags: lyricPrompts.slice(0, 7).map((prompt) => prompt.artist),
  questions: lyricPrompts.slice(0, 7).map((prompt) =>
    makeQuestion({
      id: `${prompt.id}-finish-the-lyric-board`,
      prompt: `"${prompt.lyricLeadIn}..."`,
      answer: prompt.lyricAnswer,
      difficulty: prompt.difficulty,
      promptType: "lyric",
      note: `${prompt.title} by ${prompt.artist}`,
    }),
  ),
};

const emojiCategory = {
  id: "emoji-to-title",
  title: "Emoji to Title",
  groupTags: playlistSongs.slice(0, 7).map((song) => song.artist),
  questions: playlistSongs.slice(0, 7).map((song) =>
    makeQuestion({
      id: `${song.id}-emoji-to-title`,
      prompt: song.emojiClue,
      answer: song.title,
      difficulty: song.difficulty,
      promptType: "emoji",
      note: song.artist,
    }),
  ),
};

const whoSingsThisCategory = {
  id: "who-sings-this",
  title: "Who Sings This?",
  groupTags: playlistSongs.slice(7, 14).map((song) => song.artist),
  questions: playlistSongs.slice(7, 14).map((song) =>
    makeQuestion({
      id: `${song.id}-who-sings-this`,
      prompt: `Who performs ${song.title}?`,
      answer: song.artist,
      difficulty: song.difficulty,
    }),
  ),
};

const artistToSongCategory = {
  id: "artist-to-song",
  title: "Artist to Song",
  groupTags: playlistSongs.slice(14, 21).map((song) => song.artist),
  questions: playlistSongs.slice(14, 21).map((song) =>
    makeQuestion({
      id: `${song.id}-artist-to-song`,
      prompt: `Name one tracked playlist song by ${song.artist}.`,
      answer: song.title,
      difficulty: song.difficulty,
    }),
  ),
};

const memberBelongsCategory = {
  id: "member-belongs-to-which-group",
  title: "Member Belongs To Which Group?",
  groupTags: allRounds.slice(7, 14).map((round) => round.groupName),
  questions: allRounds.slice(7, 14).map((round) => {
    const member = sortWithSeed(round.members, `${round.id}-member-belongs-mixed`)[0];
    return makeQuestion({
      id: `${round.id}-member-belongs-to-which-group`,
      prompt: `${member.name} belongs to which group?`,
      answer: round.groupName,
      choices: sortWithSeed(
        [round.groupName, ...getWrongGroups(round.groupName, "member-belongs-mixed")],
        `${round.id}-member-belongs-mixed-choices`,
      ),
      difficulty: "medium",
      image: member.image,
    });
  }),
};

const favoriteCheckCategory = {
  id: "main-game-favorites-check",
  title: "Main-Game Favorites Check",
  groupTags: allRounds.slice(7, 14).map((round) => round.groupName),
  questions: allRounds.slice(7, 14).map((round) => {
    const favorite = getFavoriteExtra(round);
    const answer = favorite?.answers?.[0] ?? favorite?.answer ?? "";
    return makeQuestion({
      id: `${round.id}-main-game-favorites-check`,
      prompt: `Which answer fits your favorites list for ${round.groupName}?`,
      answer,
      choices: favorite?.choices ?? [],
      difficulty: "medium",
    });
  }),
};

const biasAgainCategory = {
  id: "bias-picks-again",
  title: "Bias Picks Again",
  groupTags: allRounds.slice(7, 14).map((round) => round.groupName),
  questions: allRounds.slice(7, 14).map((round) => {
    const bias = getRoundExtra(round, "bias");
    return makeQuestion({
      id: `${round.id}-bias-picks-again`,
      prompt: `For ${round.groupName}, who did you lock in as your bias?`,
      answer: bias?.answer ?? "",
      choices: bias?.choices ?? [],
      difficulty: "hard",
    });
  }),
};

const leadersAgainCategory = {
  id: "captain-check",
  title: "Captain Check",
  groupTags: allRounds.slice(7, 14).map((round) => round.groupName),
  questions: allRounds.slice(7, 14).map((round) => {
    const leader = getRoundExtra(round, "leader");
    return makeQuestion({
      id: `${round.id}-captain-check`,
      prompt: `Which member is the leader of ${round.groupName}?`,
      answer: leader?.answer ?? "",
      choices: leader?.choices ?? [],
      difficulty: "medium",
    });
  }),
};

const maknaesAgainCategory = {
  id: "youngest-line-check",
  title: "Youngest Line Check",
  groupTags: allRounds.slice(7, 14).map((round) => round.groupName),
  questions: allRounds.slice(7, 14).map((round) => {
    const maknae = getRoundExtra(round, "maknae");
    return makeQuestion({
      id: `${round.id}-youngest-line-check`,
      prompt: `Which member is the maknae of ${round.groupName}?`,
      answer: maknae?.answer ?? "",
      choices: maknae?.choices ?? [],
      difficulty: "medium",
    });
  }),
};

const albumOwnerCategory = {
  id: "album-owner",
  title: "Album Owner",
  groupTags: uniqueAlbums.slice(14, 21).map((entry) => entry.artist),
  questions: uniqueAlbums.slice(14, 21).map((entry) =>
    makeQuestion({
      id: `${entry.artist}-${entry.title}-album-owner`,
      prompt: `${entry.album} belongs to which artist in your playlist set?`,
      answer: entry.artist,
      difficulty: "medium",
    }),
  ),
};

const soundtrackCategory = {
  id: "soundtrack-and-special-acts",
  title: "Soundtrack and Special Acts",
  groupTags: ["KPDH", "KATSEYE", "XG", "BabyMonster", "Meovv"],
  questions: [
    makeQuestion({
      id: "kpdh-golden-soundtrack",
      prompt: `Which soundtrack act performs Golden?`,
      answer: "KPDH",
      difficulty: "medium",
    }),
    makeQuestion({
      id: "kpdh-your-idol-soundtrack",
      prompt: `Which soundtrack act performs Your Idol?`,
      answer: "KPDH",
      difficulty: "medium",
    }),
    makeQuestion({
      id: "katseye-debut-special",
      prompt: `Which global group in your set has a song literally called Debut?`,
      answer: "KATSEYE",
      difficulty: "easy",
    }),
    makeQuestion({
      id: "xg-left-right-special",
      prompt: `Which group in your playlist set performs Left Right?`,
      answer: "XG",
      difficulty: "easy",
    }),
    makeQuestion({
      id: "babymonster-forever-special",
      prompt: `Which act performs FOREVER?`,
      answer: "BabyMonster",
      difficulty: "easy",
    }),
    makeQuestion({
      id: "meovv-hands-up-special",
      prompt: `Which act performs HANDS UP?`,
      answer: "Meovv",
      difficulty: "easy",
    }),
    makeQuestion({
      id: "hearts2hearts-rude-special",
      prompt: `Which rookie act performs Rude!?`,
      answer: "Hearts2Hearts",
      difficulty: "medium",
    }),
  ],
};

export const jeopardyCategoryPool = [
  ...allRounds.map(buildGroupEssentialsCategory),
  leadersCategory,
  maknaesCategory,
  biasCategory,
  favoriteSongsCategory,
  memberCountsCategory,
  debutCategory,
  fandomCategory,
  lightstickCategory,
  varietyCategory,
  albumMatchCategory,
  songByAlbumCategory,
  lyricCategory,
  emojiCategory,
  whoSingsThisCategory,
  artistToSongCategory,
  memberBelongsCategory,
  favoriteCheckCategory,
  biasAgainCategory,
  leadersAgainCategory,
  maknaesAgainCategory,
  albumOwnerCategory,
  soundtrackCategory,
];

export const jeopardyCategoryCount = jeopardyCategoryPool.length;

function scoreQuestion(question) {
  return difficultyOrder[question.difficulty] ?? 2;
}

function pickBoardQuestions(category, seed) {
  const sorted = sortWithSeed(category.questions, `${category.id}-${seed}`).sort((left, right) => {
    const difficultyDelta = scoreQuestion(left) - scoreQuestion(right);
    if (difficultyDelta !== 0) return difficultyDelta;
    return left.prompt.localeCompare(right.prompt);
  });

  const spread = [
    sorted[0],
    sorted[Math.min(1, sorted.length - 1)],
    sorted[Math.min(2, sorted.length - 1)],
    sorted[Math.min(4, sorted.length - 1)],
    sorted[Math.min(sorted.length - 1, 6)],
  ];

  return spread.filter(Boolean).map((question, index) => ({
    ...question,
    value: jeopardyBoardValues[index],
  }));
}

export function buildJeopardyBoard(seed = 0) {
  return sortWithSeed(jeopardyCategoryPool, `jeopardy-board-${seed}`)
    .slice(0, Math.min(JEOPARDY_BOARD_CATEGORY_COUNT, jeopardyCategoryPool.length))
    .map((category) => ({
      ...category,
      boardQuestions: pickBoardQuestions(category, seed),
    }));
}
