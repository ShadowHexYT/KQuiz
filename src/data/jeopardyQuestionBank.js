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
    company: "Source Music",
    debutDate: "May 2, 2022",
    fandom: "FEARNOT",
    debutSong: "FEARLESS",
    lightstick: "FIMBONG",
    varietySeries: "LENIVERSE",
    nameMeaning: `An anagram of "I'm Fearless".`,
    achievementPrompt:
      "According to kpopping coverage, which LE SSERAFIM release put them on the Billboard 200 within the shortest period for a Korean girl group after debut?",
    achievementAnswer: "ANTIFRAGILE",
  },
  IVE: {
    company: "STARSHIP Entertainment",
    debutDate: "December 1, 2021",
    fandom: "DIVE",
    debutSong: "ELEVEN",
    lightstick: "IHABONG",
    varietySeries: "1,2,3 IVE",
    nameMeaning: `IVE comes from "I HAVE".`,
    achievementPrompt: "Which IVE song gave the group its first Perfect All-Kill (PAK)?",
    achievementAnswer: "I AM",
  },
  NMIXX: {
    company: "JYP Entertainment",
    debutDate: "February 22, 2022",
    fandom: "NSWER",
    debutSong: "O.O",
    lightstick: "MIXXSTICK",
    varietySeries: "PICK NMIXX",
  },
  ILLIT: {
    company: "BE:LIFT Lab",
    debutDate: "March 25, 2024",
    fandom: "GLLIT",
    debutSong: "Magnetic",
    originStory: "R U Next?",
    achievementPrompt:
      "Which ILLIT song made them the first K-pop act to place both their debut song and debut album on Billboard's two main charts?",
    achievementAnswer: "Magnetic",
  },
  ITZY: {
    company: "JYP Entertainment",
    debutDate: "February 11, 2019",
    fandom: "MIDZY",
    debutSong: "DALLA DALLA",
    lightstick: "Light Ring",
    varietySeries: "CSI",
    nameMeaning:
      'The Korean word "있지" means "to have," pointing to having everything fans expect.',
    achievementPrompt:
      "What follower milestone did ITZY pass on Instagram, becoming the third K-pop girl group to do so in kpopping's January 2024 coverage?",
    achievementAnswer: "20 million followers",
  },
  STAYC: {
    company: "High Up Entertainment",
    debutDate: "November 12, 2020",
    fandom: "SWITH",
    debutSong: "SO BAD",
    varietySeries: "STAY:SEE",
    nameMeaning: "Star To A Young Culture",
  },
  KATSEYE: {
    company: "HYBE America and Geffen Records",
    debutDate: "June 28, 2024",
    fandom: "EYEKONS",
    debutSong: "Debut",
    originStory: "The Debut: Dream Academy",
    nameMeaning:
      "A cat's eye gemstone, chosen to represent the members' different colors and uniqueness.",
  },
  aespa: {
    company: "SM Entertainment",
    debutDate: "November 17, 2020",
    fandom: "MY",
    debutSong: "Black Mamba",
    varietySeries: "aesparty",
    nameMeaning: 'A mix of "avatar", "experience", and "aspect".',
    achievementPrompt:
      "Which aespa release made them the first K-pop girl group to sell 1 million copies in first-week sales?",
    achievementAnswer: "Girls",
  },
  NewJeans: {
    company: "ADOR",
    debutDate: "July 22, 2022",
    fandom: "Bunnies",
    debutSong: "Attention",
    lightstick: "Binky Bong",
    varietySeries: "Jeans' ZINE",
    nameMeaning:
      'A wordplay on timeless "new jeans" and "new genes" shaping a new pop generation.',
    achievementPrompt:
      "Which NewJeans release became a million-selling album in kpopping's June 2024 coverage?",
    achievementAnswer: "How Sweet",
  },
  "G-(I)DLE": {
    company: "Cube Entertainment",
    debutDate: "May 2, 2018",
    fandom: "Neverland",
    debutSong: "LATATA",
    lightstick: "Never Bong",
    varietySeries: "I-TALK",
    achievementPrompt:
      "What new group name did (G)I-DLE officially adopt on May 2, 2025?",
    achievementAnswer: "i-dle",
  },
  "Kiss of Life": {
    company: "S2 Entertainment",
    debutDate: "July 5, 2023",
    fandom: "KISSY",
    debutSong: "Shhh",
    achievementPrompt: "Which KISS OF LIFE song earned the group's first music-show win?",
    achievementAnswer: "Sticky",
  },
  VIVIZ: {
    company: "BPM Entertainment",
    debutDate: "February 9, 2022",
    fandom: "Na.V",
    debutSong: "BOP BOP!",
    lightstick: "Daegal Bong",
    originStory: "Three former GFRIEND members re-debuted as VIVIZ.",
    nameMeaning: "A blend of Vivacious, Vivid, and Days.",
  },
  BabyMonster: {
    company: "YG Entertainment",
    debutDate: "November 27, 2023",
    fandom: "MONSTIEZ",
    debutSong: "BATTER UP",
    varietySeries: "Last Evaluation",
    achievementPrompt:
      "Which BABYMONSTER album became their first million-seller one year after debut?",
    achievementAnswer: "DRIP",
  },
  TWICE: {
    company: "JYP Entertainment",
    debutDate: "October 20, 2015",
    fandom: "ONCE",
    debutSong: "Like OOH-AHH",
    lightstick: "Candybong",
    varietySeries: "TIME TO TWICE",
    originStory: "SIXTEEN",
    nameMeaning:
      "The group aims to move people once through the ears and once through the eyes.",
    achievementPrompt:
      "What major U.S. festival did TWICE become the first K-pop girl group to headline in August 2025?",
    achievementAnswer: "Lollapalooza Chicago",
  },
  XG: {
    company: "XGALX",
    debutDate: "March 18, 2022",
    fandom: "ALPHAZ",
    debutSong: "Tippy Toes",
    varietySeries: "XTRA XG",
    nameMeaning: "Xtraordinary Girls",
  },
  "Baby DONT Cry": {
    company: "P NATION",
    debutDate: "June 23, 2025",
    fandom: "Cherries",
    debutSong: "F Girl",
    nameMeaning:
      "A concept built around girls who look soft outside but are strong on the inside.",
    originStory: "Produced by Jeon Soyeon",
  },
  Meovv: {
    company: "THEBLACKLABEL",
    debutDate: "September 6, 2024",
    fandom: "PAWMPAWM",
    debutSong: "MEOW",
    nameMeaning: "My Eyes Open VVide",
  },
  Hearts2Hearts: {
    company: "SM Entertainment",
    debutDate: "February 24, 2025",
    fandom: "S2U",
    debutSong: "The Chase",
    nameMeaning:
      "They connect hearts with fans through music filled with emotion and heartfelt messages.",
  },
  KiiiKiii: {
    company: "STARSHIP Entertainment",
    debutDate: "February 24, 2025",
    fandom: "TiiiKiii",
    debutSong: "I DO ME",
    nameMeaning: "The sound of giggling and keeping joy alive.",
  },
  Girlset: {
    company: "JYP Entertainment / Republic Records",
    debutDate: "August 29, 2025",
    fandom: "LOCKETS",
    debutSong: "Commas",
    aliases: ["VCHA"],
    originStory: "The group rebranded from VCHA after A2K's original lineup changed.",
    achievementPrompt: "What was Girlset's group name before the 2025 rebrand?",
    achievementAnswer: "VCHA",
  },
};

function getStableHash(value) {
  return Array.from(String(value)).reduce(
    (hash, char) => ((hash * 33) ^ char.charCodeAt(0)) >>> 0,
    5381,
  );
}

function sortWithSeed(values, seed) {
  return [...values].sort((left, right) => {
    const leftScore = getStableHash(`${seed}-${left.id ?? left.prompt ?? left}`);
    const rightScore = getStableHash(`${seed}-${right.id ?? right.prompt ?? right}`);
    if (leftScore !== rightScore) return leftScore - rightScore;

    const leftKey = String(left.id ?? left.prompt ?? left);
    const rightKey = String(right.id ?? right.prompt ?? right);
    return leftKey.localeCompare(rightKey);
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

function buildGroupSpotlightCategory(round) {
  const leader = getRoundExtra(round, "leader");
  const maknae = getRoundExtra(round, "maknae");
  const bias = getRoundExtra(round, "bias");
  const favorite = getFavoriteExtra(round);
  const favoriteAnswers = favorite?.answers ?? [favorite?.answer].filter(Boolean);
  const shuffledMembers = sortWithSeed(round.members, `${round.id}-spotlight-members`);
  const focusMemberOne = shuffledMembers[0];
  const focusMemberTwo = shuffledMembers[1] ?? shuffledMembers[0];
  const wrongMembersOne = getWrongMembers(round.groupName, "spotlight-member-one");
  const wrongMembersTwo = getWrongMembers(round.groupName, "spotlight-member-two");
  const wrongGroups = getWrongGroups(round.groupName, "spotlight-groups");
  const reference = groupReference[round.groupName] ?? {};

  return {
    id: `${round.id}-spotlight`,
    title: `${round.groupName} Spotlight`,
    groupTags: [round.groupName],
    questions: [
      makeQuestion({
        id: `${round.id}-spotlight-group-name`,
        prompt: `Which group do these questions belong to: ${round.groupName}?`,
        answer: round.groupName,
        choices: sortWithSeed(
          [round.groupName, ...wrongGroups],
          `${round.id}-spotlight-group-name-choices`,
        ),
        difficulty: "easy",
      }),
      makeQuestion({
        id: `${round.id}-spotlight-member-one`,
        prompt: `Which of these members belongs to ${round.groupName}?`,
        answer: focusMemberOne?.name ?? "",
        choices: sortWithSeed(
          [focusMemberOne?.name ?? "", ...wrongMembersOne],
          `${round.id}-spotlight-member-one-choices`,
        ),
        difficulty: "easy",
      }),
      makeQuestion({
        id: `${round.id}-spotlight-member-two`,
        prompt: `Pick another real member of ${round.groupName}.`,
        answer: focusMemberTwo?.name ?? "",
        choices: sortWithSeed(
          [focusMemberTwo?.name ?? "", ...wrongMembersTwo],
          `${round.id}-spotlight-member-two-choices`,
        ),
        difficulty: "medium",
      }),
      makeQuestion({
        id: `${round.id}-spotlight-favorite-one`,
        prompt: `Name another favorite song tied to ${round.groupName}.`,
        answer: favoriteAnswers[1] ?? favoriteAnswers[0] ?? "",
        choices: favorite?.choices ?? [],
        difficulty: "medium",
      }),
      makeQuestion({
        id: `${round.id}-spotlight-favorite-two`,
        prompt: `Which song should still count as one of your ${round.groupName} favorites?`,
        answer: favoriteAnswers[2] ?? favoriteAnswers[1] ?? favoriteAnswers[0] ?? "",
        choices: favorite?.choices ?? [],
        difficulty: "medium",
      }),
      makeQuestion({
        id: `${round.id}-spotlight-leader-repeat`,
        prompt: `Lock in the leader for ${round.groupName}.`,
        answer: leader?.answer ?? "",
        choices: leader?.choices ?? [],
        difficulty: "medium",
      }),
      makeQuestion({
        id: `${round.id}-spotlight-maknae-repeat`,
        prompt: `Who closes out the age line as the maknae of ${round.groupName}?`,
        answer: maknae?.answer ?? "",
        choices: maknae?.choices ?? [],
        difficulty: "medium",
      }),
      makeQuestion({
        id: `${round.id}-spotlight-bias-repeat`,
        prompt: `For ${round.groupName}, who is the bias pick in this game set?`,
        answer: bias?.answer ?? "",
        choices: bias?.choices ?? [],
        difficulty: "hard",
      }),
      ...(reference.fandom
        ? [
            makeQuestion({
              id: `${round.id}-spotlight-fandom`,
              prompt: `What fandom name goes with ${round.groupName}?`,
              answer: reference.fandom,
              difficulty: "hard",
            }),
          ]
        : []),
      ...(reference.debutSong
        ? [
            makeQuestion({
              id: `${round.id}-spotlight-debut-song`,
              prompt: `What debut song belongs to ${round.groupName}?`,
              answer: reference.debutSong,
              difficulty: "hard",
            }),
          ]
        : []),
      ...(reference.company
        ? [
            makeQuestion({
              id: `${round.id}-spotlight-company`,
              prompt: `Which company or label is tied to ${round.groupName}?`,
              answer: reference.company,
              difficulty: "hard",
            }),
          ]
        : []),
      ...(reference.debutDate
        ? [
            makeQuestion({
              id: `${round.id}-spotlight-debut-date`,
              prompt: `When did ${round.groupName} debut?`,
              answer: reference.debutDate,
              difficulty: "hard",
            }),
          ]
        : []),
      ...(reference.nameMeaning
        ? [
            makeQuestion({
              id: `${round.id}-spotlight-name-meaning`,
              prompt: `What does the name ${round.groupName} mean or refer to?`,
              answer: reference.nameMeaning,
              difficulty: "hard",
            }),
          ]
        : []),
      ...(reference.originStory
        ? [
            makeQuestion({
              id: `${round.id}-spotlight-origin-story`,
              prompt: `What project, show, or origin story is tied to ${round.groupName}?`,
              answer: reference.originStory,
              difficulty: "hard",
            }),
          ]
        : []),
      ...(reference.achievementPrompt && reference.achievementAnswer
        ? [
            makeQuestion({
              id: `${round.id}-spotlight-achievement`,
              prompt: reference.achievementPrompt,
              answer: reference.achievementAnswer,
              difficulty: "hard",
            }),
          ]
        : []),
      ...(reference.aliases?.length
        ? [
            makeQuestion({
              id: `${round.id}-spotlight-alias`,
              prompt: `What other name is directly tied to ${round.groupName}?`,
              answer: reference.aliases[0],
              choices: sortWithSeed(
                [reference.aliases[0], ...getWrongGroups(round.groupName, "spotlight-alias")],
                `${round.id}-spotlight-alias-choices`,
              ),
              difficulty: "medium",
            }),
          ]
        : []),
    ],
  };
}

const mainstreamRounds = allRounds.filter((round) => groupReference[round.groupName]?.fandom);
const referencedRounds = allRounds.filter((round) => groupReference[round.groupName]);

const leadersCategory = {
  id: "leaders-only",
  title: "Leaders Only",
  groupTags: mainstreamRounds.map((round) => round.groupName),
  questions: mainstreamRounds.map((round) => {
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
  questions: mainstreamRounds.map((round) => {
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
  groupTags: allRounds.map((round) => round.groupName),
  questions: allRounds.map((round) => {
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
  groupTags: allRounds.map((round) => round.groupName),
  questions: allRounds.map((round) => {
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
  groupTags: allRounds.map((round) => round.groupName),
  questions: allRounds.map((round) =>
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
  groupTags: mainstreamRounds.map((round) => round.groupName),
  questions: mainstreamRounds.map((round) =>
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
  groupTags: mainstreamRounds.map((round) => round.groupName),
  questions: mainstreamRounds.map((round) =>
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
  groupTags: lightstickRounds.map((round) => round.groupName),
  questions: lightstickRounds.map((round) =>
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
  groupTags: varietyRounds.map((round) => round.groupName),
  questions: varietyRounds.map((round) =>
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
  groupTags: uniqueAlbums.map((entry) => entry.artist),
  questions: uniqueAlbums.map((entry) =>
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
  groupTags: uniqueAlbums.map((entry) => entry.artist),
  questions: uniqueAlbums.map((entry) =>
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
  groupTags: lyricPrompts.map((prompt) => prompt.artist),
  questions: lyricPrompts.map((prompt) =>
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
  groupTags: playlistSongs.map((song) => song.artist),
  questions: playlistSongs.map((song) =>
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
  groupTags: playlistSongs.map((song) => song.artist),
  questions: playlistSongs.map((song) =>
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
  groupTags: playlistSongs.map((song) => song.artist),
  questions: playlistSongs.map((song) =>
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
  groupTags: allRounds.map((round) => round.groupName),
  questions: allRounds.map((round) => {
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
  groupTags: allRounds.map((round) => round.groupName),
  questions: allRounds.map((round) => {
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
  groupTags: allRounds.map((round) => round.groupName),
  questions: allRounds.map((round) => {
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
  groupTags: allRounds.map((round) => round.groupName),
  questions: allRounds.map((round) => {
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
  groupTags: allRounds.map((round) => round.groupName),
  questions: allRounds.map((round) => {
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
  groupTags: uniqueAlbums.map((entry) => entry.artist),
  questions: uniqueAlbums.map((entry) =>
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
  groupTags: ["KPDH", "KATSEYE", "XG", "BabyMonster", "Meovv", "Girlset"],
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
    makeQuestion({
      id: "girlset-only-one-special",
      prompt: `Which group formerly known as VCHA performs Only One?`,
      answer: "Girlset",
      difficulty: "medium",
    }),
  ],
};

const companyCategory = {
  id: "agency-check",
  title: "Agency Check",
  groupTags: referencedRounds.map((round) => round.groupName),
  questions: referencedRounds
    .filter((round) => groupReference[round.groupName]?.company)
    .map((round) =>
      makeQuestion({
        id: `${round.id}-agency-check`,
        prompt: `Which company is ${round.groupName} under?`,
        answer: groupReference[round.groupName]?.company ?? "",
        difficulty: "easy",
      }),
    ),
};

const debutDateCategory = {
  id: "debut-calendar",
  title: "Debut Calendar",
  groupTags: referencedRounds.map((round) => round.groupName),
  questions: referencedRounds
    .filter((round) => groupReference[round.groupName]?.debutDate)
    .map((round) =>
      makeQuestion({
        id: `${round.id}-debut-calendar`,
        prompt: `On what date did ${round.groupName} officially debut?`,
        answer: groupReference[round.groupName]?.debutDate ?? "",
        difficulty: "medium",
      }),
    ),
};

const nameMeaningCategory = {
  id: "name-meaning-lab",
  title: "Name Meaning Lab",
  groupTags: referencedRounds.map((round) => round.groupName),
  questions: referencedRounds
    .filter((round) => groupReference[round.groupName]?.nameMeaning)
    .map((round) =>
      makeQuestion({
        id: `${round.id}-name-meaning-lab`,
        prompt: `What does the name ${round.groupName} mean or stand for?`,
        answer: groupReference[round.groupName]?.nameMeaning ?? "",
        difficulty: "hard",
      }),
    ),
};

const originStoryCategory = {
  id: "origin-story-files",
  title: "Origin Story Files",
  groupTags: referencedRounds.map((round) => round.groupName),
  questions: referencedRounds
    .filter((round) => groupReference[round.groupName]?.originStory)
    .map((round) =>
      makeQuestion({
        id: `${round.id}-origin-story-files`,
        prompt: `What show, project, or backstory is directly tied to how ${round.groupName} was formed?`,
        answer: groupReference[round.groupName]?.originStory ?? "",
        difficulty: "hard",
      }),
    ),
};

const achievementCategory = {
  id: "achievement-archive",
  title: "Achievement Archive",
  groupTags: referencedRounds.map((round) => round.groupName),
  questions: referencedRounds
    .filter((round) => groupReference[round.groupName]?.achievementPrompt)
    .map((round) =>
      makeQuestion({
        id: `${round.id}-achievement-archive`,
        prompt: groupReference[round.groupName]?.achievementPrompt ?? "",
        answer: groupReference[round.groupName]?.achievementAnswer ?? "",
        difficulty: "hard",
      }),
    ),
};

export const jeopardyCategoryPool = [
  ...allRounds.map(buildGroupEssentialsCategory),
  ...allRounds.map(buildGroupSpotlightCategory),
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
  companyCategory,
  debutDateCategory,
  nameMeaningCategory,
  originStoryCategory,
  achievementCategory,
];

export const jeopardyCategoryCount = jeopardyCategoryPool.length;
const essentialsCategoryPool = jeopardyCategoryPool.filter((category) => category.id.endsWith("-essentials"));
const mixedCategoryPool = jeopardyCategoryPool.filter((category) => !category.id.endsWith("-essentials"));

function scoreQuestion(question) {
  return difficultyOrder[question.difficulty] ?? 2;
}

function pickBoardQuestions(category, seed) {
  const seeded = sortWithSeed(category.questions, `${category.id}-${seed}`);
  const usedIds = new Set();
  const targetDifficulties = ["easy", "easy", "medium", "medium", "hard"];

  function pullQuestion(preferredDifficulty) {
    const exactMatch = seeded.find(
      (question) => !usedIds.has(question.id) && question.difficulty === preferredDifficulty,
    );

    if (exactMatch) {
      usedIds.add(exactMatch.id);
      return exactMatch;
    }

    const fallback = seeded.find((question) => !usedIds.has(question.id));
    if (!fallback) return null;

    usedIds.add(fallback.id);
    return fallback;
  }

  return targetDifficulties
    .map((difficulty) => pullQuestion(difficulty))
    .filter(Boolean)
    .map((question, index) => ({
      ...question,
      value: jeopardyBoardValues[index],
    }));
}

export function buildJeopardyBoard(seed = 0) {
  const essentialsPick = sortWithSeed(essentialsCategoryPool, `jeopardy-essentials-${seed}`).slice(0, 1);
  const mixedPicks = sortWithSeed(mixedCategoryPool, `jeopardy-mixed-${seed}`).slice(
    0,
    Math.max(0, JEOPARDY_BOARD_CATEGORY_COUNT - essentialsPick.length),
  );
  const boardCategories = sortWithSeed(
    [...essentialsPick, ...mixedPicks],
    `jeopardy-board-layout-${seed}`,
  );

  return boardCategories.map((category) => ({
      ...category,
      boardQuestions: pickBoardQuestions(category, seed),
    }));
}
