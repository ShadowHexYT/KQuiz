export const gameModes = [
  {
    id: "main-game",
    title: "Are You Smarter Than a K-popper?",
    tagline: "The flagship gameshow round with photos, songs, and bias trivia.",
    category: "Headliner",
    playerFormat: "Party",
    layoutType: "showcase",
    description:
      "A full-round gameshow flow that mixes group recognition, member photos, favorite songs, and personal bonus questions.",
    flow: ["Party setup", "Round intro", "Question run", "Answer reveal", "Score results"],
    setupOptions: ["Group rotation", "Host scoring", "Team play", "Manual point awards"],
    hostTools: ["Reveal answer", "Award points", "Jump between groups", "Reset game"],
    dataFields: ["groupName", "members", "extras", "songChoices", "previewUrl"],
  },
  {
    id: "jeopardy",
    title: "K-pop Jeopardy",
    tagline: "A board-based trivia showdown with steals and big points.",
    category: "Board",
    playerFormat: "Solo or Teams",
    layoutType: "board",
    description:
      "A category grid with point values, mixed media clues, optional Daily Doubles, and host-led score control.",
    flow: ["Choose board", "Pick category tile", "Buzz or answer", "Steal chance", "Board clear"],
    setupOptions: ["Category pack", "Point ladder", "Daily Double toggle", "Steal rules"],
    hostTools: ["Reveal clue", "Mark tile complete", "Open steal", "Award or subtract points"],
    dataFields: ["category", "pointValue", "promptType", "prompt", "answer", "groupTags"],
  },
  {
    id: "wheel-of-fortune",
    title: "K-pop Wheel of Fortune",
    tagline: "Spin, guess letters, and solve song and album puzzles.",
    category: "Puzzle",
    playerFormat: "Solo or Teams",
    layoutType: "wheel",
    description:
      "A puzzle-solving mode built around hidden song titles, lyrics, fandom names, and album names.",
    flow: ["Spin wheel", "Guess letter", "Fill puzzle", "Solve attempt", "Bonus spin"],
    setupOptions: ["Puzzle category", "Wheel outcomes", "Bankrupt toggle", "Hint availability"],
    hostTools: ["Spin outcome", "Reveal letters", "Pass turn", "Lock final solve"],
    dataFields: ["puzzleText", "category", "hint", "difficulty", "groupTags"],
  },
  {
    id: "finish-the-lyric",
    title: "Finish the Lyric",
    tagline: "Continue the next line before the timer closes.",
    category: "Lyric",
    playerFormat: "Solo or Teams",
    layoutType: "prompt",
    description:
      "A lyric challenge that can run as multiple choice, typed answer, or timed host-judged response.",
    flow: ["Show lyric lead-in", "Start timer", "Collect answer", "Reveal continuation", "Track streak"],
    setupOptions: ["Answer style", "Hints", "Time limit", "Difficulty"],
    hostTools: ["Show hint", "Reveal continuation", "Give partial credit", "Skip lyric"],
    dataFields: ["lyricStart", "expectedContinuation", "songTitle", "groupName", "acceptableAnswers"],
  },
  {
    id: "emoji-song-guess",
    title: "Emoji Song Guess",
    tagline: "Decode the emoji chain into a song title.",
    category: "Party",
    playerFormat: "Solo or Teams",
    layoutType: "emoji",
    description:
      "A lighter party mode built around emoji clues, quick guesses, and easy audience participation.",
    flow: ["Show emoji clue", "Open guesses", "Reveal title", "Bonus explanation", "Next clue"],
    setupOptions: ["Clue difficulty", "Timed mode", "Typed or multiple choice", "Group filter"],
    hostTools: ["Reveal clue", "Show hint", "Accept funny alt answer", "Move on"],
    dataFields: ["emojiClue", "answer", "groupName", "difficulty"],
  },
  {
    id: "album-cover-zoom",
    title: "Album Cover Zoom-In",
    tagline: "Guess the album from a tiny crop.",
    category: "Visual",
    playerFormat: "Solo or Teams",
    layoutType: "visual",
    description:
      "A visual challenge that starts on a tight album crop and zooms out if players need help.",
    flow: ["Show crop", "Zoom out", "Lock answer", "Reveal cover", "Award points"],
    setupOptions: ["Crop size", "Zoom steps", "Album-only scoring", "Group fallback scoring"],
    hostTools: ["Zoom out", "Reveal full cover", "Accept album answer", "Next round"],
    dataFields: ["albumName", "groupName", "coverImageUrl", "cropVariants", "difficulty"],
  },
  {
    id: "lightstick-silhouette-guess",
    title: "Lightstick Silhouette Guess",
    tagline: "Name the fandom icon from the outline alone.",
    category: "Visual",
    playerFormat: "Solo or Teams",
    layoutType: "visual",
    description:
      "A strong visual-recognition mode for mixed-group play, especially when silhouettes are cropped or rotated.",
    flow: ["Show silhouette", "Optional rotation", "Lock guess", "Reveal lightstick", "Score result"],
    setupOptions: ["Crop level", "Rotation", "Mixed or filtered groups", "Difficulty"],
    hostTools: ["Rotate silhouette", "Reveal full stick", "Open steal", "Next prompt"],
    dataFields: ["groupName", "silhouetteImageUrl", "difficulty"],
  },
];

export const featuredGameModeIds = [
  "main-game",
  "jeopardy",
  "wheel-of-fortune",
  "finish-the-lyric",
  "emoji-song-guess",
  "album-cover-zoom",
];

export const featuredGameModes = featuredGameModeIds
  .map((id) => gameModes.find((mode) => mode.id === id))
  .filter(Boolean);

export const gameModeMap = Object.fromEntries(gameModes.map((mode) => [mode.id, mode]));

export function getGameModeById(modeId) {
  return gameModeMap[modeId] ?? null;
}
