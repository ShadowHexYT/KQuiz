import { getStableHash, seededSort, slugify } from "./filtering.js";

const EMOJI_WORD_MAP = {
  after: "⏭️",
  ash: "🩶",
  attitude: "😏",
  baby: "👶",
  back: "🔙",
  bang: "💥",
  bebe: "👶",
  black: "⚫",
  better: "✨",
  breakthrough: "🚀",
  blue: "💙",
  body: "🕺",
  bubble: "🫧",
  cake: "🎂",
  call: "📞",
  candy: "🍬",
  cherish: "💎",
  cheeky: "😏",
  chase: "🏃‍♀️",
  clak: "🫰",
  clik: "⌨️",
  commas: "،",
  cookie: "🍪",
  cry: "😭",
  dance: "💃",
  debut: "🎤",
  different: "🪞",
  ditto: "👯",
  doughnut: "🍩",
  drama: "🎭",
  dream: "💭",
  easy: "🍃",
  eclipse: "🌘",
  eyes: "👀",
  fancy: "💖",
  fearless: "🦁",
  feel: "💖",
  fire: "🔥",
  five: "5️⃣",
  flu: "🤒",
  focus: "🎯",
  forever: "♾️",
  free: "🕊️",
  get: "⬆️",
  girl: "👧",
  girls: "👭",
  gods: "⚡",
  golden: "🥇",
  gunshot: "🔫",
  hands: "🙌",
  heart: "❤️",
  hearts: "💗",
  hot: "🔥",
  howl: "🐺",
  hype: "📣",
  icy: "🧊",
  idol: "⭐",
  igloo: "🧊",
  know: "🧠",
  left: "⬅️",
  level: "🆙",
  lonely: "😔",
  loud: "📢",
  love: "❤️",
  lucky: "🍀",
  magnetic: "🧲",
  mamba: "🐍",
  meow: "🐈",
  miss: "💋",
  moonlight: "🌙",
  more: "➕",
  my: "🙋‍♀️",
  night: "🌙",
  no: "🚫",
  nobody: "🚷",
  ocean: "🌊",
  omg: "😮",
  one: "1️⃣",
  only: "🫶",
  ooh: "😮",
  papillon: "🦋",
  psycho: "🧠",
  queer: "🌈",
  queen: "👑",
  rebel: "✊",
  really: "💯",
  right: "➡️",
  ring: "💍",
  rude: "🙄",
  rumor: "🗣️",
  scientist: "🧪",
  shadow: "🌑",
  shy: "🙈",
  slingshot: "🏹",
  sos: "🆘",
  soda: "🥤",
  spark: "✨",
  spicy: "🌶️",
  special: "✨",
  star: "🌠",
  sticky: "🍯",
  style: "👗",
  smart: "🧠",
  supernova: "🌟",
  super: "⚡",
  sweet: "🍬",
  sugarcoat: "🍭",
  takedown: "🥋",
  talk: "🗣️",
  that: "👉",
  thanks: "🙏",
  tight: "🪢",
  touch: "🫳",
  top: "🔝",
  toxic: "☠️",
  unforgiven: "😈",
  universe: "🌌",
  up: "⬆️",
  voltage: "⚡",
  wallflower: "🌼",
  wannabe: "💁‍♀️",
  wave: "🌊",
  whiplash: "💥",
  world: "🌍",
  xo: "💌",
  yes: "✅",
  young: "🌱",
  you: "👉",
};

export function buildEmojiClueVariants(title) {
  const normalizedWords = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const mapped = normalizedWords
    .map((word) => EMOJI_WORD_MAP[word])
    .filter(Boolean);

  if (!mapped.length) {
    return [];
  }

  const ordered = [...new Set(mapped)];
  const joined = ordered.join("");
  const spaced = ordered.join(" ");
  const reversed = [...ordered].reverse().join(" ");

  return [...new Set([joined, spaced, reversed])];
}

function buildDifficultyCropScales(difficulty) {
  if (difficulty === "easy") return [3.2, 2.9, 2.6, 2.35];
  if (difficulty === "medium") return [4.2, 3.9, 3.5, 3.2];
  return [5.2, 4.9, 4.5, 4.2];
}

export function buildAlbumCropVariants({ id, difficulty }) {
  const cropScales = buildDifficultyCropScales(difficulty);

  return cropScales.map((scale, index) => {
    const xHash = getStableHash(`${id}-crop-x-${index}`);
    const yHash = getStableHash(`${id}-crop-y-${index}`);

    return {
      id: `${slugify(id)}-crop-${index + 1}`,
      focusX: 18 + (xHash % 64),
      focusY: 18 + (yHash % 64),
      scale,
    };
  });
}

export function buildLightstickRenderVariants({ id, difficulty }) {
  const difficultySettings =
    difficulty === "easy"
      ? [
          { blurPx: 2, contrast: 1.5, rotateDeg: -4, maskInset: 0 },
          { blurPx: 3, contrast: 1.6, rotateDeg: 5, maskInset: 4 },
        ]
      : difficulty === "medium"
        ? [
            { blurPx: 5, contrast: 1.8, rotateDeg: -8, maskInset: 10 },
            { blurPx: 6, contrast: 2.1, rotateDeg: 6, maskInset: 14 },
          ]
        : [
            { blurPx: 7, contrast: 2.2, rotateDeg: -10, maskInset: 20 },
            { blurPx: 9, contrast: 2.5, rotateDeg: 10, maskInset: 24 },
          ];

  return difficultySettings.map((variant, index) => ({
    id: `${slugify(id)}-render-${index + 1}`,
    ...variant,
  }));
}

export function pickQuestionVariant(question, seed) {
  const promptVariants = question.promptVariants?.length
    ? seededSort(question.promptVariants, `${seed}-${question.id}`)
    : null;
  const cropVariants = question.cropVariants?.length
    ? seededSort(question.cropVariants, `${seed}-${question.id}`, (variant) => variant.id)
    : null;
  const renderVariants = question.renderVariants?.length
    ? seededSort(question.renderVariants, `${seed}-${question.id}`, (variant) => variant.id)
    : null;

  return {
    prompt: promptVariants?.[0] ?? question.prompt ?? null,
    cropVariant: cropVariants?.[0] ?? null,
    renderVariant: renderVariants?.[0] ?? null,
  };
}
