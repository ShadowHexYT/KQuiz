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
    starterContent: [
      {
        title: "Current full gameshow round",
        detail: "Built around group recognition, member photos, favorite-song picks, and personal trivia.",
      },
      {
        title: "Best next content pass",
        detail: "Add bonus lightning rounds, team steal logic, and difficulty packs by era or group.",
      },
    ],
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
    starterContent: [
      {
        title: "Board pack: Debut songs",
        detail: "Clues about first title tracks, debut years, and launch-era concepts for major girl groups.",
      },
      {
        title: "Board pack: Member facts",
        detail: "Leader, maknae, bias, and recognizable role clues across mixed groups.",
      },
      {
        title: "Board pack: Albums and eras",
        detail: "Questions about comeback titles, album covers, and concept styling shifts.",
      },
    ],
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
    starterContent: [
      {
        title: "Prompt pack: Iconic choruses",
        detail: "Short chorus lead-ins from songs the room is likely to know before moving into tougher cuts.",
      },
      {
        title: "Prompt pack: B-sides",
        detail: "Deeper album lines that work better for tie-breakers or bonus points.",
      },
      {
        title: "Prompt pack: Group-only nights",
        detail: "Single-group lyric sets for TWICE, LE SSERAFIM, IVE, aespa, and NewJeans.",
      },
    ],
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
    starterContent: [
      {
        title: "Easy pack",
        detail: "Big title tracks translated into obvious emoji chains for quick warm-up rounds.",
      },
      {
        title: "Chaos pack",
        detail: "More misleading emoji combinations where players need to argue the meaning out loud.",
      },
      {
        title: "Bias pack",
        detail: "Emoji clues tied to member nicknames, fandom in-jokes, or visual concepts.",
      },
    ],
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
    starterContent: [
      {
        title: "Easy pack: Signature covers",
        detail: "Distinctive album art that most casual players can identify after one or two zoom steps.",
      },
      {
        title: "Hard pack: Minimal covers",
        detail: "Albums with similar palettes or simpler artwork that need tighter crop discipline.",
      },
      {
        title: "Group pack: Favorite-song albums",
        detail: "Uses the same album library already being built into the main gameshow favorite-song questions.",
      },
    ],
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
    starterContent: [
      {
        title: "Starter set",
        detail: "Recognizable top-group lightsticks that help players learn the game quickly.",
      },
      {
        title: "Decoy set",
        detail: "Similar round silhouettes placed together so shape details matter more than color memory.",
      },
      {
        title: "Final round set",
        detail: "Rare or less obvious designs for championship questions and steals.",
      },
    ],
  },
];

export const featuredGameModeIds = [
  "main-game",
  "jeopardy",
  "finish-the-lyric",
  "emoji-song-guess",
  "album-cover-zoom",
  "lightstick-silhouette-guess",
];

export const featuredGameModes = featuredGameModeIds
  .map((id) => gameModes.find((mode) => mode.id === id))
  .filter(Boolean);

export const gameModeMap = Object.fromEntries(gameModes.map((mode) => [mode.id, mode]));

export function getGameModeById(modeId) {
  return gameModeMap[modeId] ?? null;
}
