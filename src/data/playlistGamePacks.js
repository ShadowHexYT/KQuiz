import {
  buildPlaylistModeCatalog,
  buildQuestionChoices,
  buildSessionQuestionSet,
} from "../lib/playlistModes/catalog.js";
import { pickQuestionVariant } from "../lib/playlistModes/assetPrep.js";
import { getSupportedPlaylistGroups } from "../lib/playlistModes/supportedGroups.js";

function buildChoices(answer, pool, seed, size = 4) {
  const distractors = [...pool.filter((item) => item !== answer)].sort((left, right) =>
    `${seed}-distractors-${left}`.localeCompare(`${seed}-distractors-${right}`),
  )
    .slice(0, Math.max(0, size - 1));

  return [answer, ...distractors].sort((left, right) =>
    `${seed}-choices-${left}`.localeCompare(`${seed}-choices-${right}`),
  );
}

export const playlistSongs = [
  { id: "aespa-whiplash", title: "Whiplash", artist: "aespa", album: "Whiplash - The 5th Mini Album - EP", difficulty: "easy", emojiClue: "👀💥" },
  { id: "stayc-gpt", title: "GPT", artist: "STAYC", album: "GPT - Single", difficulty: "easy", emojiClue: "🤖💬✨" },
  { id: "katseye-touch", title: "Touch", artist: "KATSEYE", album: "SIS (Soft Is Strong) - EP", difficulty: "easy", emojiClue: "🫳✨" },
  { id: "nmixx-love-is-lonely", title: "Love Is Lonely", artist: "NMIXX", album: "Fe3O4: STICK OUT - EP", difficulty: "easy", emojiClue: "❤️😔" },
  { id: "lesserafim-hot", title: "HOT", artist: "LE SSERAFIM", album: "HOT - EP", difficulty: "easy", emojiClue: "🥵🔥" },
  { id: "ive-rebel-heart", title: "REBEL HEART", artist: "IVE", album: "REBEL HEART - Single", difficulty: "easy", emojiClue: "✊❤️" },
  { id: "kiof-igloo", title: "Igloo", artist: "Kiss of Life", album: "Lose Yourself", difficulty: "easy", emojiClue: "🧊🏠" },
  { id: "illit-cherish-my-love", title: "Cherish (My Love)", artist: "ILLIT", album: "I'LL LIKE YOU - EP", difficulty: "easy", emojiClue: "💎❤️" },
  { id: "babymonster-clik-clak", title: "CLIK CLAK", artist: "BabyMonster", album: "DRIP", difficulty: "easy", emojiClue: "⌨️🫰" },
  { id: "babymonster-love-in-my-heart", title: "Love In My Heart", artist: "BabyMonster", album: "DRIP", difficulty: "easy", emojiClue: "❤️🫀" },
  { id: "nmixx-see-that", title: "See that?", artist: "NMIXX", album: "Fe3O4: STICK OUT - EP", difficulty: "easy", emojiClue: "👀👉❓" },
  { id: "stayc-bebe", title: "BEBE", artist: "STAYC", album: "S - Single", difficulty: "easy", emojiClue: "👶✨" },
  { id: "ive-attitude", title: "ATTITUDE", artist: "IVE", album: "IVE EMPATHY - EP", difficulty: "easy", emojiClue: "😏✨" },
  { id: "katseye-my-way", title: "My Way", artist: "KATSEYE", album: "SIS (Soft Is Strong) - EP", difficulty: "easy", emojiClue: "🙋‍♀️🛣️" },
  { id: "itzy-five", title: "FIVE", artist: "ITZY", album: "GOLD", difficulty: "easy", emojiClue: "5️⃣" },
  { id: "katseye-debut", title: "Debut", artist: "KATSEYE", album: "Debut - Single", difficulty: "easy", emojiClue: "🎤🆕" },
  { id: "babymonster-forever", title: "FOREVER", artist: "BabyMonster", album: "FOREVER - Single", difficulty: "easy", emojiClue: "♾️💕" },
  { id: "stayc-cheeky-icy-thang", title: "Cheeky Icy Thang", artist: "STAYC", album: "Metamorphic", difficulty: "medium", emojiClue: "😏🧊✨" },
  { id: "ive-tko", title: "TKO", artist: "IVE", album: "IVE EMPATHY - EP", difficulty: "medium", emojiClue: "🥊💫" },
  { id: "ive-thank-u", title: "Thank U", artist: "IVE", album: "IVE EMPATHY - EP", difficulty: "medium", emojiClue: "🙏💌" },
  { id: "ive-you-wanna-cry", title: "You Wanna Cry", artist: "IVE", album: "IVE EMPATHY - EP", difficulty: "medium", emojiClue: "👉😭" },
  { id: "ive-flu", title: "FLU", artist: "IVE", album: "IVE EMPATHY - EP", difficulty: "medium", emojiClue: "🤒🛏️" },
  { id: "nmixx-know-about-me", title: "KNOW ABOUT ME", artist: "NMIXX", album: "Fe3O4: FORWARD - EP", difficulty: "medium", emojiClue: "🧠🙋‍♀️" },
  { id: "nmixx-ocean", title: "Ocean", artist: "NMIXX", album: "Fe3O4: FORWARD - EP", difficulty: "medium", emojiClue: "🌊" },
  { id: "nmixx-papillon", title: "Papillon", artist: "NMIXX", album: "Fe3O4: FORWARD - EP", difficulty: "medium", emojiClue: "🦋" },
  { id: "nmixx-slingshot", title: "Slingshot (<★)", artist: "NMIXX", album: "Fe3O4: FORWARD - EP", difficulty: "medium", emojiClue: "🏹⭐" },
  { id: "illit-tick-tack", title: "Tick-Tack", artist: "ILLIT", album: "I'LL LIKE YOU - EP", difficulty: "medium", emojiClue: "⏰🫰" },
  { id: "illit-iykyk", title: "IYKYK (If You Know You Know)", artist: "ILLIT", album: "I'LL LIKE YOU - EP", difficulty: "medium", emojiClue: "🤫🧠" },
  { id: "lesserafim-ash", title: "Ash", artist: "LE SSERAFIM", album: "HOT - EP", difficulty: "medium", emojiClue: "🔥➡️🩶" },
  { id: "lesserafim-crazy-english", title: "CRAZY (English ver.)", artist: "LE SSERAFIM", album: "CRAZY (Party Remixes 1)", difficulty: "medium", emojiClue: "🤪🇺🇸" },
  { id: "kiof-no-one-but-us", title: "No One But Us", artist: "Kiss of Life", album: "Lose Yourself", difficulty: "medium", emojiClue: "🚫👤❤️" },
  { id: "kiof-back-to-me", title: "Back To Me", artist: "Kiss of Life", album: "Lose Yourself", difficulty: "medium", emojiClue: "🔙🙋‍♀️" },
  { id: "kiof-rem", title: "R.E.M", artist: "Kiss of Life", album: "R.E.M - Single", difficulty: "medium", emojiClue: "😴👁️" },
  { id: "kiof-get-loud", title: "Get Loud", artist: "Kiss of Life", album: "Lose Yourself", difficulty: "medium", emojiClue: "📢🔊" },
  { id: "ive-dare-me", title: "DARE ME", artist: "IVE", album: "DARE ME - Single", difficulty: "medium", emojiClue: "😈👉" },
  { id: "kiiikiii-btg", title: "BTG", artist: "KiiiKiii", album: "UNCUT GEM - EP", difficulty: "medium", emojiClue: "💥⚙️" },
  { id: "kiiikiii-i-do-me", title: "I DO ME", artist: "KiiiKiii", album: "I DO ME - Single", difficulty: "medium", emojiClue: "🙋‍♀️✅" },
  { id: "meovv-hands-up", title: "HANDS UP", artist: "Meovv", album: "HANDS UP - Single", difficulty: "easy", emojiClue: "🙌⬆️" },
  { id: "viviz-shhh", title: "Shhh!", artist: "VIVIZ", album: "The 5th Mini Album 'VOYAGE' - EP", difficulty: "easy", emojiClue: "🤫" },
  { id: "babydontcry-cry-baby", title: "Cry Baby", artist: "Baby DONT Cry", album: "F Girl", difficulty: "easy", emojiClue: "😭👶" },
  { id: "babydontcry-rumor", title: "Rumor", artist: "Baby DONT Cry", album: "F Girl", difficulty: "medium", emojiClue: "🗣️👂" },
  { id: "hearts2hearts-rude", title: "Rude!", artist: "Hearts2Hearts", album: "The Chase - Single", difficulty: "easy", emojiClue: "🙄❗" },
  { id: "xg-hypnotize", title: "Hypnotize", artist: "XG", album: "THE CORE", difficulty: "medium", emojiClue: "🌀👀" },
  { id: "xg-left-right", title: "Left Right", artist: "XG", album: "SHOOTING STAR - Single", difficulty: "easy", emojiClue: "⬅️➡️" },
  { id: "xg-shooting-star", title: "SHOOTING STAR", artist: "XG", album: "SHOOTING STAR - Single", difficulty: "easy", emojiClue: "🌠" },
  { id: "aespa-supernova", title: "Supernova", artist: "aespa", album: "Armageddon - The 1st Album", difficulty: "easy", emojiClue: "🌟💥" },
  { id: "aespa-armageddon", title: "Armageddon", artist: "aespa", album: "Armageddon - The 1st Album", difficulty: "medium", emojiClue: "🌍⚠️" },
  { id: "itzy-cake", title: "CAKE", artist: "ITZY", album: "KILL MY DOUBT - EP", difficulty: "easy", emojiClue: "🎂" },
  { id: "itzy-voltage", title: "Voltage", artist: "ITZY", album: "Voltage", difficulty: "medium", emojiClue: "⚡" },
  { id: "twice-feel-special", title: "Feel Special", artist: "TWICE", album: "Feel Special", difficulty: "easy", emojiClue: "✨💖" },
  { id: "twice-talk-that-talk", title: "Talk that Talk", artist: "TWICE", album: "BETWEEN 1&2", difficulty: "easy", emojiClue: "🗣️👉🗣️" },
  { id: "twice-the-feels", title: "The Feels", artist: "TWICE", album: "The Feels - Single", difficulty: "easy", emojiClue: "🥰🎵" },
  { id: "gidle-queencard", title: "Queencard", artist: "G-(I)DLE", album: "I feel", difficulty: "easy", emojiClue: "👑💳" },
  { id: "gidle-nxde", title: "Nxde", artist: "G-(I)DLE", album: "I love", difficulty: "medium", emojiClue: "🚫👗" },
  { id: "newjeans-super-shy", title: "Super Shy", artist: "NewJeans", album: "NewJeans 'Super Shy' - Single", difficulty: "easy", emojiClue: "🙈✨" },
  { id: "newjeans-omg", title: "OMG", artist: "NewJeans", album: "OMG - Single", difficulty: "easy", emojiClue: "😮🙏" },
  { id: "newjeans-ditto", title: "Ditto", artist: "NewJeans", album: "Ditto - Single", difficulty: "medium", emojiClue: "🪞👯" },
  { id: "kpdh-golden", title: "Golden", artist: "KPDH", album: "KPop Demon Hunters (Soundtrack from the Netflix Film)", difficulty: "easy", emojiClue: "🥇✨" },
  { id: "kpdh-your-idol", title: "Your Idol", artist: "KPDH", album: "KPop Demon Hunters (Soundtrack from the Netflix Film)", difficulty: "medium", emojiClue: "👉⭐" },
];

export const lyricPrompts = [
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

const lyricAnswerPool = lyricPrompts.map((prompt) => prompt.lyricAnswer);

export const finishTheLyricQuestions = lyricPrompts.map((prompt) => ({
  ...prompt,
  answer: prompt.lyricAnswer,
  choices:
    prompt.lyricChoices ??
    buildChoices(prompt.lyricAnswer, lyricAnswerPool, `${prompt.id}-lyric`),
}));

export const playlistDifficultyOptions = ["easy", "medium", "hard"];
export const playlistQuestionCountOptions = [5, 10, 15, 20, 25, 30, 40, 50];
const generatedCatalog = buildPlaylistModeCatalog({ playlistSongs });

export const emojiSongGuessQuestions = generatedCatalog.emojiSongGuessQuestions;
export const albumCoverZoomQuestions = generatedCatalog.albumCoverZoomQuestions;
export const lightstickSilhouetteQuestions = generatedCatalog.lightstickSilhouetteQuestions;
export const playlistModeDiagnostics = generatedCatalog.diagnostics;
export const playlistGroupOptions = getSupportedPlaylistGroups();

export function buildPlaylistChoices(question, seed, size = 4) {
  return question.choicePool
    ? buildQuestionChoices(question, seed, size)
    : question.choices ?? [];
}

export function buildPlaylistQuestionSet(questions, count, seed, recentIds = []) {
  return buildSessionQuestionSet(questions, count, seed, recentIds);
}

export function getPlaylistQuestionVariant(question, seed) {
  return pickQuestionVariant(question, seed);
}
