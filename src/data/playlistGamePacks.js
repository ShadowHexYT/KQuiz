import { getSongMeta } from "./mainQuizRounds";

function getStableHash(value) {
  return Array.from(value).reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function sortWithSeed(values, seed) {
  return [...values].sort((left, right) => {
    const leftScore = getStableHash(`${seed}-${left}`);
    const rightScore = getStableHash(`${seed}-${right}`);
    return leftScore - rightScore;
  });
}

function buildChoices(answer, pool, seed, size = 4) {
  const distractors = sortWithSeed(
    pool.filter((item) => item !== answer),
    `${seed}-distractors`,
  ).slice(0, Math.max(0, size - 1));

  return sortWithSeed([answer, ...distractors], `${seed}-choices`);
}

const playlistSongs = [
  { id: "aespa-whiplash", title: "Whiplash", artist: "aespa", difficulty: "easy", emojiClue: "👀💥" },
  { id: "stayc-gpt", title: "GPT", artist: "STAYC", difficulty: "easy", emojiClue: "🤖💬✨" },
  { id: "katseye-touch", title: "Touch", artist: "KATSEYE", difficulty: "easy", emojiClue: "🫳✨" },
  { id: "nmixx-love-is-lonely", title: "Love Is Lonely", artist: "NMIXX", difficulty: "easy", emojiClue: "❤️😔" },
  { id: "lesserafim-hot", title: "HOT", artist: "LE SSERAFIM", difficulty: "easy", emojiClue: "🥵🔥" },
  { id: "ive-rebel-heart", title: "REBEL HEART", artist: "IVE", difficulty: "easy", emojiClue: "✊❤️" },
  { id: "kiof-igloo", title: "Igloo", artist: "Kiss of Life", difficulty: "easy", emojiClue: "🧊🏠" },
  { id: "illit-cherish-my-love", title: "Cherish (My Love)", artist: "ILLIT", difficulty: "easy", emojiClue: "💎❤️" },
  { id: "babymonster-clik-clak", title: "CLIK CLAK", artist: "BabyMonster", difficulty: "easy", emojiClue: "⌨️🫰" },
  { id: "babymonster-love-in-my-heart", title: "Love In My Heart", artist: "BabyMonster", difficulty: "easy", emojiClue: "❤️🫀" },
  { id: "nmixx-see-that", title: "See that?", artist: "NMIXX", difficulty: "easy", emojiClue: "👀👉❓" },
  { id: "stayc-bebe", title: "BEBE", artist: "STAYC", difficulty: "easy", emojiClue: "👶✨" },
  { id: "ive-attitude", title: "ATTITUDE", artist: "IVE", difficulty: "easy", emojiClue: "😏✨" },
  { id: "katseye-my-way", title: "My Way", artist: "KATSEYE", difficulty: "easy", emojiClue: "🙋‍♀️🛣️" },
  { id: "itzy-five", title: "FIVE", artist: "ITZY", difficulty: "easy", emojiClue: "5️⃣" },
  { id: "katseye-debut", title: "Debut", artist: "KATSEYE", difficulty: "easy", emojiClue: "🎤🆕" },
  { id: "babymonster-forever", title: "FOREVER", artist: "BabyMonster", difficulty: "easy", emojiClue: "♾️💕" },
  { id: "stayc-cheeky-icy-thang", title: "Cheeky Icy Thang", artist: "STAYC", difficulty: "medium", emojiClue: "😏🧊✨" },
  { id: "ive-tko", title: "TKO", artist: "IVE", difficulty: "medium", emojiClue: "🥊💫" },
  { id: "ive-thank-u", title: "Thank U", artist: "IVE", difficulty: "medium", emojiClue: "🙏💌" },
  { id: "ive-you-wanna-cry", title: "You Wanna Cry", artist: "IVE", difficulty: "medium", emojiClue: "👉😭" },
  { id: "ive-flu", title: "FLU", artist: "IVE", difficulty: "medium", emojiClue: "🤒🛏️" },
  { id: "nmixx-know-about-me", title: "KNOW ABOUT ME", artist: "NMIXX", difficulty: "medium", emojiClue: "🧠🙋‍♀️" },
  { id: "nmixx-ocean", title: "Ocean", artist: "NMIXX", difficulty: "medium", emojiClue: "🌊" },
  { id: "nmixx-papillon", title: "Papillon", artist: "NMIXX", difficulty: "medium", emojiClue: "🦋" },
  { id: "nmixx-slingshot", title: "Slingshot (<★)", artist: "NMIXX", difficulty: "medium", emojiClue: "🏹⭐" },
  { id: "illit-tick-tack", title: "Tick-Tack", artist: "ILLIT", difficulty: "medium", emojiClue: "⏰🫰" },
  { id: "illit-iykyk", title: "IYKYK (If You Know You Know)", artist: "ILLIT", difficulty: "medium", emojiClue: "🤫🧠" },
  { id: "lesserafim-ash", title: "Ash", artist: "LE SSERAFIM", difficulty: "medium", emojiClue: "🔥➡️🩶" },
  { id: "lesserafim-crazy-english", title: "CRAZY (English ver.)", artist: "LE SSERAFIM", difficulty: "medium", emojiClue: "🤪🇺🇸" },
  { id: "kiof-no-one-but-us", title: "No One But Us", artist: "Kiss of Life", difficulty: "medium", emojiClue: "🚫👤❤️" },
  { id: "kiof-back-to-me", title: "Back To Me", artist: "Kiss of Life", difficulty: "medium", emojiClue: "🔙🙋‍♀️" },
  { id: "kiof-rem", title: "R.E.M", artist: "Kiss of Life", difficulty: "medium", emojiClue: "😴👁️" },
  { id: "kiof-get-loud", title: "Get Loud", artist: "Kiss of Life", difficulty: "medium", emojiClue: "📢🔊" },
  { id: "ive-dare-me", title: "DARE ME", artist: "IVE", difficulty: "medium", emojiClue: "😈👉" },
  { id: "kiiikiii-btg", title: "BTG", artist: "KiiiKiii", difficulty: "medium", emojiClue: "💥⚙️" },
  { id: "kiiikiii-i-do-me", title: "I DO ME", artist: "KiiiKiii", difficulty: "medium", emojiClue: "🙋‍♀️✅" },
  { id: "meovv-hands-up", title: "HANDS UP", artist: "Meovv", difficulty: "easy", emojiClue: "🙌⬆️" },
  { id: "viviz-shhh", title: "Shhh!", artist: "VIVIZ", difficulty: "easy", emojiClue: "🤫" },
  { id: "babydontcry-cry-baby", title: "Cry Baby", artist: "Baby DONT Cry", difficulty: "easy", emojiClue: "😭👶" },
  { id: "babydontcry-rumor", title: "Rumor", artist: "Baby DONT Cry", difficulty: "medium", emojiClue: "🗣️👂" },
  { id: "hearts2hearts-rude", title: "Rude!", artist: "Hearts2Hearts", difficulty: "easy", emojiClue: "🙄❗" },
  { id: "xg-hypnotize", title: "Hypnotize", artist: "XG", difficulty: "medium", emojiClue: "🌀👀" },
  { id: "xg-left-right", title: "Left Right", artist: "XG", difficulty: "easy", emojiClue: "⬅️➡️" },
  { id: "xg-shooting-star", title: "SHOOTING STAR", artist: "XG", difficulty: "easy", emojiClue: "🌠" },
  { id: "aespa-supernova", title: "Supernova", artist: "aespa", difficulty: "easy", emojiClue: "🌟💥" },
  { id: "aespa-armageddon", title: "Armageddon", artist: "aespa", difficulty: "medium", emojiClue: "🌍⚠️" },
  { id: "itzy-cake", title: "CAKE", artist: "ITZY", difficulty: "easy", emojiClue: "🎂" },
  { id: "itzy-voltage", title: "Voltage", artist: "ITZY", difficulty: "medium", emojiClue: "⚡" },
  { id: "twice-feel-special", title: "Feel Special", artist: "TWICE", difficulty: "easy", emojiClue: "✨💖" },
  { id: "twice-talk-that-talk", title: "Talk that Talk", artist: "TWICE", difficulty: "easy", emojiClue: "🗣️👉🗣️" },
  { id: "twice-the-feels", title: "The Feels", artist: "TWICE", difficulty: "easy", emojiClue: "🥰🎵" },
  { id: "gidle-queencard", title: "Queencard", artist: "G-(I)DLE", difficulty: "easy", emojiClue: "👑💳" },
  { id: "gidle-nxde", title: "Nxde", artist: "G-(I)DLE", difficulty: "medium", emojiClue: "🚫👗" },
  { id: "newjeans-super-shy", title: "Super Shy", artist: "NewJeans", difficulty: "easy", emojiClue: "🙈✨" },
  { id: "newjeans-omg", title: "OMG", artist: "NewJeans", difficulty: "easy", emojiClue: "😮🙏" },
  { id: "newjeans-ditto", title: "Ditto", artist: "NewJeans", difficulty: "medium", emojiClue: "🪞👯" },
  { id: "kpdh-golden", title: "Golden", artist: "KPDH", difficulty: "easy", emojiClue: "🥇✨" },
  { id: "kpdh-your-idol", title: "Your Idol", artist: "KPDH", difficulty: "medium", emojiClue: "👉⭐" },
];

const lyricPrompts = [
  { id: "lyric-whiplash", title: "Whiplash", artist: "aespa", difficulty: "easy", lyricLeadIn: "One look, give 'em", lyricAnswer: "whiplash" },
  { id: "lyric-touch", title: "Touch", artist: "KATSEYE", difficulty: "easy", lyricLeadIn: "Touch, touch,", lyricAnswer: "touch" },
  { id: "lyric-hot", title: "HOT", artist: "LE SSERAFIM", difficulty: "easy", lyricLeadIn: "Burning up so", lyricAnswer: "hot" },
  { id: "lyric-rebel-heart", title: "REBEL HEART", artist: "IVE", difficulty: "easy", lyricLeadIn: "Still beating like a", lyricAnswer: "rebel heart" },
  { id: "lyric-love-is-lonely", title: "Love Is Lonely", artist: "NMIXX", difficulty: "easy", lyricLeadIn: "Love is", lyricAnswer: "lonely" },
  { id: "lyric-see-that", title: "See that?", artist: "NMIXX", difficulty: "easy", lyricLeadIn: "See that, see", lyricAnswer: "that" },
  { id: "lyric-bebe", title: "BEBE", artist: "STAYC", difficulty: "easy", lyricLeadIn: "Be-be,", lyricAnswer: "bebe" },
  { id: "lyric-cherish", title: "Cherish (My Love)", artist: "ILLIT", difficulty: "easy", lyricLeadIn: "Cherish my", lyricAnswer: "love" },
  { id: "lyric-clik-clak", title: "CLIK CLAK", artist: "BabyMonster", difficulty: "medium", lyricLeadIn: "Clik", lyricAnswer: "clak" },
  { id: "lyric-tick-tack", title: "Tick-Tack", artist: "ILLIT", difficulty: "medium", lyricLeadIn: "Tick-", lyricAnswer: "tack" },
  { id: "lyric-get-loud", title: "Get Loud", artist: "Kiss of Life", difficulty: "easy", lyricLeadIn: "Get", lyricAnswer: "loud" },
  { id: "lyric-my-way", title: "My Way", artist: "KATSEYE", difficulty: "easy", lyricLeadIn: "Going my", lyricAnswer: "way" },
  { id: "lyric-five", title: "FIVE", artist: "ITZY", difficulty: "easy", lyricLeadIn: "One, two, three, four,", lyricAnswer: "five" },
  { id: "lyric-debut", title: "Debut", artist: "KATSEYE", difficulty: "medium", lyricLeadIn: "Ready for our", lyricAnswer: "debut" },
  { id: "lyric-forever", title: "FOREVER", artist: "BabyMonster", difficulty: "easy", lyricLeadIn: "You and me", lyricAnswer: "forever" },
  { id: "lyric-attitude", title: "ATTITUDE", artist: "IVE", difficulty: "medium", lyricLeadIn: "That kind of", lyricAnswer: "attitude" },
  { id: "lyric-gpt", title: "GPT", artist: "STAYC", difficulty: "medium", lyricLeadIn: "Type it into", lyricAnswer: "gpt" },
  { id: "lyric-iykyk", title: "IYKYK (If You Know You Know)", artist: "ILLIT", difficulty: "hard", lyricLeadIn: "If you know you", lyricAnswer: "know" },
  { id: "lyric-ash", title: "Ash", artist: "LE SSERAFIM", difficulty: "hard", lyricLeadIn: "Turn to", lyricAnswer: "ash" },
  { id: "lyric-rumor", title: "Rumor", artist: "Baby DONT Cry", difficulty: "hard", lyricLeadIn: "Heard a", lyricAnswer: "rumor" },
  { id: "lyric-rude", title: "Rude!", artist: "Hearts2Hearts", difficulty: "medium", lyricLeadIn: "So", lyricAnswer: "rude" },
  { id: "lyric-hands-up", title: "HANDS UP", artist: "Meovv", difficulty: "easy", lyricLeadIn: "Hands", lyricAnswer: "up" },
];

const titlePool = playlistSongs.map((song) => song.title);
const lyricAnswerPool = lyricPrompts.map((prompt) => prompt.lyricAnswer);

export const emojiSongGuessQuestions = playlistSongs.map((song) => ({
  ...song,
  prompt: song.emojiClue,
  answer: song.title,
  choices: buildChoices(song.title, titlePool, `${song.id}-emoji`),
}));

export const albumCoverZoomQuestions = playlistSongs
  .map((song, index) => {
    const songMeta = getSongMeta(song.artist, song.title);

    if (!songMeta.coverImage) {
      return null;
    }

    return {
      ...song,
      answer: song.title,
      coverImage: songMeta.coverImage,
      choices: buildChoices(song.title, titlePool, `${song.id}-cover`),
      focusX: 18 + ((index * 13) % 60),
      focusY: 18 + ((index * 9) % 60),
    };
  })
  .filter(Boolean);

export const finishTheLyricQuestions = lyricPrompts.map((prompt) => ({
  ...prompt,
  answer: prompt.lyricAnswer,
  choices:
    prompt.lyricChoices ??
    buildChoices(prompt.lyricAnswer, lyricAnswerPool, `${prompt.id}-lyric`),
}));

export const playlistDifficultyOptions = ["easy", "medium", "hard"];
export const playlistQuestionCountOptions = [5, 10, 15, 20, 25, 30, 40, 50];
