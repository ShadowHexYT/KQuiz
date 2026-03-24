// Favorites and bias picks are seeded defaults for v1 and can be customized later.
function getStableHash(value) {
  return Array.from(value).reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function getShuffledChoices(choices, seed) {
  return [...choices].sort((left, right) => {
    const leftScore = getStableHash(`${seed}-${left}`);
    const rightScore = getStableHash(`${seed}-${right}`);
    return leftScore - rightScore;
  });
}

const rounds = [
  {
    id: "lesserafim",
    groupName: "LE SSERAFIM",
    groupChoices: ["LE SSERAFIM", "IVE", "NewJeans", "aespa"],
    members: [
      { name: "Chaewon", image: "/quiz-media/image24.jpg" },
      { name: "Kazuha", image: "/quiz-media/image5.jpg" },
      { name: "Yunjin", image: "/quiz-media/image11.jpg" },
      { name: "Eunchae", image: "/quiz-media/image19.jpg" },
      { name: "Sakura", image: "/quiz-media/image7.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "ANTIFRAGILE",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Le_Sserafim_-_Antifragile.png/250px-Le_Sserafim_-_Antifragile.png",
        sampleVideoId: "pyf8cbqyfPs",
        choices: ["ANTIFRAGILE", "Perfect Night", "Smart", "EASY"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Chaewon",
        choices: ["Chaewon", "Sakura", "Yunjin", "Kazuha"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Eunchae",
        choices: ["Eunchae", "Kazuha", "Chaewon", "Yunjin"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Chaewon",
        choices: ["Chaewon", "Sakura", "Yunjin", "Kazuha"],
      },
    ],
  },
  {
    id: "ive",
    groupName: "IVE",
    groupChoices: ["IVE", "ITZY", "STAYC", "NMIXX"],
    members: [
      { name: "Leeseo", image: "/quiz-media/image20.jpg" },
      { name: "Wonyoung", image: "/quiz-media/image9.jpg" },
      { name: "Rei", image: "/quiz-media/image23.jpg" },
      { name: "Yujin", image: "/quiz-media/image2.jpg" },
      { name: "Liz", image: "/quiz-media/image3.jpg" },
      { name: "Gaeul", image: "/quiz-media/image1.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "I AM",
        coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Ive_-_I%27ve_Ive.png/250px-Ive_-_I%27ve_Ive.png",
        sampleVideoId: "6ZUIwj3FgUY",
        choices: ["I AM", "LOVE DIVE", "HEYA", "After LIKE"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Yujin",
        choices: ["Yujin", "Wonyoung", "Rei", "Liz"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Leeseo",
        choices: ["Leeseo", "Liz", "Gaeul", "Yujin"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Wonyoung",
        choices: ["Wonyoung", "Leeseo", "Yujin", "Rei"],
      },
    ],
  },
  {
    id: "nmixx",
    groupName: "NMIXX",
    groupChoices: ["NMIXX", "ITZY", "Kiss of Life", "STAYC"],
    members: [
      { name: "Sullyoon", image: "/quiz-media/image4.jpg" },
      { name: "Haewon", image: "/quiz-media/image27.jpg" },
      { name: "Bae", image: "/quiz-media/image41.jpg" },
      { name: "Lily", image: "/quiz-media/image6.jpg" },
      { name: "Kyujin", image: "/quiz-media/image10.jpg" },
      { name: "Jiwoo", image: "/quiz-media/image22.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "DASH",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/a/aa/Nmixx_Fe3O4_Break.jpg/250px-Nmixx_Fe3O4_Break.jpg",
        sampleVideoId: "7UecFm_bSTU",
        choices: ["DASH", "Love Me Like This", "See that?", "O.O"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Haewon",
        choices: ["Haewon", "Lily", "Sullyoon", "Bae"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Kyujin",
        choices: ["Kyujin", "Jiwoo", "Bae", "Sullyoon"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Sullyoon",
        choices: ["Sullyoon", "Haewon", "Lily", "Bae"],
      },
    ],
  },
  {
    id: "itzy",
    groupName: "ITZY",
    groupChoices: ["ITZY", "TWICE", "IVE", "LE SSERAFIM"],
    members: [
      { name: "Ryujin", image: "/quiz-media/image28.jpg" },
      { name: "Chaeryeong", image: "/quiz-media/image26.jpg" },
      { name: "Yuna", image: "/quiz-media/image14.jpg" },
      { name: "Yeji", image: "/quiz-media/image12.jpg" },
      { name: "Lia", image: "/quiz-media/image30.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "WANNABE",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/6/62/Itz_me_-_wannabe_ver.png/250px-Itz_me_-_wannabe_ver.png",
        sampleVideoId: "fE2h3lGlOsk",
        choices: ["WANNABE", "UNTOUCHABLE", "DALLA DALLA", "LOCO"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Yeji",
        choices: ["Yeji", "Ryujin", "Lia", "Yuna"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Yuna",
        choices: ["Yuna", "Chaeryeong", "Lia", "Yeji"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Ryujin",
        choices: ["Ryujin", "Yeji", "Yuna", "Chaeryeong"],
      },
    ],
  },
  {
    id: "stayc",
    groupName: "STAYC",
    groupChoices: ["STAYC", "IVE", "KATSEYE", "NMIXX"],
    members: [
      { name: "J", image: "/quiz-media/image29.jpg" },
      { name: "Seeun", image: "/quiz-media/image35.jpg" },
      { name: "Sumin", image: "/quiz-media/image15.jpg" },
      { name: "Isa", image: "/quiz-media/image40.jpg" },
      { name: "Sieun", image: "/quiz-media/image13.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "RUN2U",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/STAYC_%E2%80%93_Young-Luv_com.jpg/250px-STAYC_%E2%80%93_Young-Luv_com.jpg",
        sampleVideoId: "h4WKrPMazRI",
        choices: ["RUN2U", "ASAP", "Teddy Bear", "Bubble"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Sumin",
        choices: ["Sumin", "Sieun", "Isa", "J"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "J",
        choices: ["J", "Seeun", "Sieun", "Sumin"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Isa",
        choices: ["Isa", "J", "Sumin", "Sieun"],
      },
    ],
  },
  {
    id: "katseye",
    groupName: "KATSEYE",
    groupChoices: ["KATSEYE", "VIVIZ", "NewJeans", "BabyMonster"],
    members: [
      { name: "Manon", image: "/quiz-media/image18.png" },
      { name: "Sophia", image: "/quiz-media/image16.jpg" },
      { name: "Yoonchae", image: "/quiz-media/image17.jpg" },
      { name: "Lara", image: "/quiz-media/image33.jpg" },
      { name: "Megan", image: "/quiz-media/image36.jpg" },
      { name: "Daniela", image: "/quiz-media/image31.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Touch",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/5/55/Katseye_-_SIS_%28Soft_Is_Strong%29.jpeg/250px-Katseye_-_SIS_%28Soft_Is_Strong%29.jpeg",
        sampleVideoId: "l9CZykYZkOQ",
        choices: ["Touch", "Debut", "My Way", "Gnarly"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Sophia",
        choices: ["Sophia", "Lara", "Manon", "Daniela"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Yoonchae",
        choices: ["Yoonchae", "Megan", "Sophia", "Lara"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Sophia",
        choices: ["Sophia", "Manon", "Daniela", "Lara"],
      },
    ],
  },
  {
    id: "aespa",
    groupName: "aespa",
    groupChoices: ["aespa", "IVE", "NewJeans", "ITZY"],
    members: [
      { name: "Giselle", image: "/quiz-media/image42.jpg" },
      { name: "Winter", image: "/quiz-media/image32.jpg" },
      { name: "Karina", image: "/quiz-media/image45.jpg" },
      { name: "Ningning", image: "/quiz-media/image25.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Drama",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/Aespa_-_Drama_%28sped_up%29.png/250px-Aespa_-_Drama_%28sped_up%29.png",
        sampleVideoId: "D8VEhcPeSlc",
        choices: ["Drama", "Supernova", "Savage", "Spicy"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Karina",
        choices: ["Karina", "Winter", "Giselle", "Ningning"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Ningning",
        choices: ["Ningning", "Winter", "Karina", "Giselle"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Karina",
        choices: ["Karina", "Giselle", "Winter", "Ningning"],
      },
    ],
  },
  {
    id: "newjeans",
    groupName: "NewJeans",
    groupChoices: ["NewJeans", "LE SSERAFIM", "aespa", "KATSEYE"],
    members: [
      { name: "Hanni", image: "/quiz-media/image34.jpg" },
      { name: "Danielle", image: "/quiz-media/image43.jpg" },
      { name: "Minji", image: "/quiz-media/image37.jpg" },
      { name: "Haerin", image: "/quiz-media/image56.jpg" },
      { name: "Hyein", image: "/quiz-media/image55.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Ditto",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/NewJeans_-_Ditto.png/250px-NewJeans_-_Ditto.png",
        sampleVideoId: "pSUydWEqKwE",
        choices: ["Ditto", "Super Shy", "ETA", "OMG"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "No official leader",
        choices: ["No official leader", "Minji", "Hanni", "Danielle"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Hyein",
        choices: ["Hyein", "Haerin", "Minji", "Danielle"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Hanni",
        choices: ["Hanni", "Haerin", "Minji", "Danielle"],
      },
    ],
  },
  {
    id: "gidle",
    groupName: "G-(I)DLE",
    groupChoices: ["G-(I)DLE", "Kiss of Life", "STAYC", "IVE"],
    members: [
      { name: "Yuqi", image: "/quiz-media/image71.jpg" },
      { name: "Miyeon", image: "/quiz-media/image57.jpg" },
      { name: "Soyeon", image: "/quiz-media/image53.jpg" },
      { name: "Minnie", image: "/quiz-media/image39.jpg" },
      { name: "Shuhua", image: "/quiz-media/image59.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Queencard",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/%28G%29I-dle%E2%80%93Queencard.jpg/250px-%28G%29I-dle%E2%80%93Queencard.jpg",
        sampleVideoId: "7HDeem-JaSY",
        choices: ["Queencard", "TOMBOY", "Super Lady", "Nxde"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Soyeon",
        choices: ["Soyeon", "Yuqi", "Miyeon", "Minnie"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Shuhua",
        choices: ["Shuhua", "Miyeon", "Yuqi", "Minnie"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Yuqi",
        choices: ["Yuqi", "Miyeon", "Soyeon", "Minnie"],
      },
    ],
  },
  {
    id: "kiss-of-life",
    groupName: "Kiss of Life",
    groupChoices: ["Kiss of Life", "VIVIZ", "NMIXX", "STAYC"],
    members: [
      { name: "Belle", image: "/quiz-media/image52.jpg" },
      { name: "Natty", image: "/quiz-media/image66.jpg" },
      { name: "Julie", image: "/quiz-media/image38.jpg" },
      { name: "Haneul", image: "/quiz-media/image63.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Midas Touch",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/7/75/Midas_Touch_cover.jpg/250px-Midas_Touch_cover.jpg",
        sampleVideoId: "oKVYm8mIUdo",
        choices: ["Midas Touch", "Sticky", "Nobody Knows", "Shhh"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Julie",
        choices: ["Julie", "Belle", "Natty", "Haneul"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Haneul",
        choices: ["Haneul", "Belle", "Natty", "Julie"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Natty",
        choices: ["Natty", "Belle", "Julie", "Haneul"],
      },
    ],
  },
  {
    id: "viviz",
    groupName: "VIVIZ",
    groupChoices: ["VIVIZ", "KATSEYE", "BabyMonster", "aespa"],
    members: [
      { name: "Umji", image: "/quiz-media/image70.jpg" },
      { name: "Eunha", image: "/quiz-media/image47.jpg" },
      { name: "SinB", image: "/quiz-media/image44.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "MANIAC",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Viviz_-_Versus.jpg/250px-Viviz_-_Versus.jpg",
        sampleVideoId: "9JFi7MmjtGA",
        choices: ["MANIAC", "BOP BOP!", "Pull Up", "Untie"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Eunha",
        choices: ["Eunha", "SinB", "Umji", "No official leader"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Umji",
        choices: ["Umji", "SinB", "Eunha", "No maknae"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "SinB",
        choices: ["SinB", "Eunha", "Umji", "No answer"],
      },
    ],
  },
  {
    id: "babymonster",
    groupName: "BabyMonster",
    groupChoices: ["BabyMonster", "KATSEYE", "Kiss of Life", "NewJeans"],
    members: [
      { name: "Ahyeon", image: "/quiz-media/image58.jpg" },
      { name: "Rami", image: "/quiz-media/image46.jpg" },
      { name: "Rora", image: "/quiz-media/image48.jpg" },
      { name: "Chiquita", image: "/quiz-media/image62.jpg" },
      { name: "Ruka", image: "/quiz-media/image49.jpg" },
      { name: "Pharita", image: "/quiz-media/image68.jpg" },
      { name: "Asa", image: "/quiz-media/image67.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "SHEESH",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/BabyMonster_-_BabyMons7er.jpg/250px-BabyMonster_-_BabyMons7er.jpg",
        sampleVideoId: "2wA_b6YHjqQ",
        choices: ["SHEESH", "DRIP", "BATTER UP", "FOREVER"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "No official leader",
        choices: ["No official leader", "Ahyeon", "Ruka", "Rami"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Chiquita",
        choices: ["Chiquita", "Rora", "Asa", "Pharita"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Ahyeon",
        choices: ["Ahyeon", "Rami", "Ruka", "Chiquita"],
      },
    ],
  },
  {
    id: "twice",
    groupName: "TWICE",
    groupChoices: ["TWICE", "ITZY", "IVE", "STAYC"],
    members: [
      { name: "Sana", image: "/quiz-media/image64.jpg" },
      { name: "Jihyo", image: "/quiz-media/image75.jpg" },
      { name: "Nayeon", image: "/quiz-media/image73.jpg" },
      { name: "Momo", image: "/quiz-media/image50.jpg" },
      { name: "Mina", image: "/quiz-media/image60.jpg" },
      { name: "Dahyun", image: "/quiz-media/image51.jpg" },
      { name: "Chaeyoung", image: "/quiz-media/image72.jpg" },
      { name: "Jeongyeon", image: "/quiz-media/image54.jpg" },
      { name: "Tzuyu", image: "/quiz-media/image74.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Feel Special",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Twice_-_Feel_Special.png/250px-Twice_-_Feel_Special.png",
        sampleVideoId: "3ymwOvzhwHs",
        choices: ["Feel Special", "TT", "What is Love?", "Talk that Talk"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Jihyo",
        choices: ["Jihyo", "Nayeon", "Jeongyeon", "Sana"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Tzuyu",
        choices: ["Tzuyu", "Chaeyoung", "Dahyun", "Mina"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Sana",
        choices: ["Sana", "Jihyo", "Momo", "Nayeon"],
      },
    ],
  },
];

export const mainQuizRounds = rounds.map((round) => {
  const allGroupNames = rounds.map((item) => item.groupName);
  const memberNames = round.members.map((member) => member.name);

  return {
    ...round,
    groupChoices: getShuffledChoices(allGroupNames, `${round.id}-groups`),
    extras: round.extras.map((extra) => {
      if (["leader", "maknae", "bias"].includes(extra.key)) {
        const includesSpecialAnswer = !memberNames.includes(extra.answer);

        return {
          ...extra,
          choices: includesSpecialAnswer ? [extra.answer, ...memberNames] : memberNames,
        };
      }

      return extra;
    }),
  };
});
