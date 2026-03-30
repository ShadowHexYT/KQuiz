import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { groupQuizzes } from "../src/data/groupQuizzes.js";
import { mainQuizRounds } from "../src/data/mainQuizRounds.js";
import { idolBirthdaySeeds } from "../src/data/calendarEvents.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(__dirname, "../src/data/idolRepository.generated.js");

const GROUP_SOURCE_MAP = {
  TWICE: {
    kpoppingSlug: "TWICE",
    kprofilesUrl: "https://kprofiles.com/twice-members-profile/",
  },
  "LE SSERAFIM": {
    kpoppingSlug: "LE-SSERAFIM",
    kprofilesUrl: "https://kprofiles.com/le-sserafim-members-profile/",
  },
  NewJeans: {
    kpoppingSlug: "NewJeans",
    kprofilesUrl: "https://kprofiles.com/newjeans-members-profile/",
  },
  IVE: {
    kpoppingSlug: "IVE",
    kprofilesUrl: "https://kprofiles.com/ive-members-profile/",
  },
  aespa: {
    kpoppingSlug: "aespa",
    kprofilesUrl: "https://kprofiles.com/aespa-members-profile/",
  },
  NMIXX: {
    kpoppingSlug: "NMIXX",
    kprofilesUrl: "https://kprofiles.com/nmixx-profile/",
  },
  STAYC: {
    kpoppingSlug: "STAYC",
    kprofilesUrl: "https://kprofiles.com/stayc-members-profile/",
  },
  ILLIT: {
    kpoppingSlug: "ILLIT",
    kprofilesUrl: "https://kprofiles.com/illit-members-profile/",
  },
  KATSEYE: {
    kpoppingSlug: "KATSEYE",
    kprofilesUrl: "https://kprofiles.com/katseye-members-profile/",
  },
  KiiiKiii: {
    kpoppingSlug: "KiiiKiii",
    kprofilesUrl: "https://kprofiles.com/kiiikiii-members-profile/",
  },
  Meovv: {
    kpoppingSlug: "MEOVV",
    kprofilesUrl: "https://kprofiles.com/meovv-members-profile/",
  },
  Hearts2Hearts: {
    kpoppingSlug: "Hearts2Hearts",
    kprofilesUrl: "https://kprofiles.com/hearts2hearts-members-profile/",
  },
  XG: {
    kpoppingSlug: "XG",
    kprofilesUrl: "https://kprofiles.com/xg-members-profile/",
  },
  ITZY: {
    kpoppingSlug: "ITZY",
    kprofilesUrl: "https://kprofiles.com/itzy-members-profile/",
  },
  "G-(I)DLE": {
    kpoppingSlug: "i-dle",
    kprofilesUrl: "https://kprofiles.com/g-idle-members-profile/",
  },
  "Baby DONT Cry": {
    kpoppingSlug: "Baby-DONT-Cry",
    kprofilesUrl: "https://kprofiles.com/baby-dont-cry-members-profile/",
  },
  VIVIZ: {
    kpoppingSlug: "VIVIZ",
    kprofilesUrl: "https://kprofiles.com/viviz-members-profile/",
  },
  BabyMonster: {
    kpoppingSlug: "BABYMONSTER",
    kprofilesUrl: "https://kprofiles.com/babymonster-members-profile/",
  },
  KPDH: {
    kpoppingSlug: "KPop-Demon-Hunters",
    kprofilesUrl: "https://kprofiles.com/?s=KPop+Demon+Hunters",
  },
  Girlset: {
    kpoppingSlug: "Girlset",
    kprofilesUrl: "https://kprofiles.com/?s=Girlset",
  },
  "Kiss of Life": {
    kpoppingSlug: "KISS-OF-LIFE",
    kprofilesUrl: "https://kprofiles.com/kiss-of-life-members-profile/",
  },
};

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function getLastNameToken(value) {
  return String(value)
    .split(/\s+/)
    .filter(Boolean)
    .at(-1)
    ?.toLowerCase();
}

function decodeValue(value) {
  return String(value)
    .replace(/\\"/g, '"')
    .replace(/\\u0026/g, "&")
    .replace(/\\u0027/g, "'")
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">");
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }

  return response.text();
}

function extractEscapedMembersArray(groupHtml) {
  const match = groupHtml.match(/\\"members\\":(\[[\s\S]*?\]),\\"formerMembers\\"/);
  if (!match) {
    throw new Error("Could not locate members array on kpopping group page");
  }

  return JSON.parse(match[1].replace(/\\"/g, '"'));
}

function extractField(segment, field) {
  const stringMatch = segment.match(new RegExp(`"${field}":"([^"]*)"`, "i"));
  if (stringMatch) {
    return decodeValue(stringMatch[1]);
  }

  const numberMatch = segment.match(new RegExp(`"${field}":(\\d+)`, "i"));
  if (numberMatch) {
    return Number(numberMatch[1]);
  }

  return null;
}

function extractJsonObjectAfterNeedle(input, needle) {
  const startNeedle = input.indexOf(needle);
  if (startNeedle === -1) {
    return null;
  }

  const normalizedChunk = input.slice(startNeedle).replace(/\\"/g, '"');
  const startIndex = normalizedChunk.indexOf("{");
  if (startIndex === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = startIndex; index < normalizedChunk.length; index += 1) {
    const char = normalizedChunk[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return normalizedChunk.slice(startIndex, index + 1);
      }
    }
  }

  return null;
}

function extractMemberSegment(memberHtml, memberSlug) {
  const normalizedHtml = memberHtml.replace(/\\"/g, '"');
  const startIndex = normalizedHtml.indexOf(`"slug":"${memberSlug}"`);
  if (startIndex === -1) {
    return null;
  }

  const candidateEndTokens = ['"allGroups"', '"categories"', '"recommendations"', '"signature"']
    .map((token) => normalizedHtml.indexOf(token, startIndex))
    .filter((index) => index !== -1)
    .sort((left, right) => left - right);
  const endIndex = candidateEndTokens[0] ?? startIndex + 5000;

  return normalizedHtml.slice(startIndex, endIndex);
}

function getSupplementalBirthdaySeed(groupName, idolName) {
  return idolBirthdaySeeds.find(
    (entry) => entry.groupName === groupName && entry.idolName.toLowerCase() === idolName.toLowerCase(),
  );
}

function getLocalQuizMediaPath(idolName, groupName) {
  if (groupName === "Hearts2Hearts" && idolName === "Jiwoo") {
    return "/quiz-media/Jiwoo_h2h.jpg";
  }

  if (idolName === "Lara") {
    return "/quiz-media/Lara.png";
  }

  if (idolName === "Ningning") {
    return "/quiz-media/NingNing.jpg";
  }

  if (idolName === "Haneul") {
    return "/quiz-media/Hanuel.jpg";
  }

  return `/quiz-media/${idolName}.jpg`;
}

function matchSourceMember(siteMemberName, sourceMembers) {
  const normalizedSiteName = normalizeName(siteMemberName);
  const siteLastToken = getLastNameToken(siteMemberName);

  return (
    sourceMembers.find((member) => normalizeName(member.name) === normalizedSiteName) ??
    sourceMembers.find((member) => getLastNameToken(member.name) === siteLastToken) ??
    sourceMembers.find((member) => normalizeName(member.name).includes(normalizedSiteName)) ??
    sourceMembers.find((member) => normalizedSiteName.includes(normalizeName(member.name))) ??
    null
  );
}

async function buildGroupDirectory(group) {
  const sourceConfig = GROUP_SOURCE_MAP[group.label];
  if (!sourceConfig) {
    return {
      groupName: group.label,
      description: group.description,
      members: [],
      reviewIssues: ["Missing source configuration"],
    };
  }

  const round = mainQuizRounds.find((entry) => entry.groupName === group.label);
  if (!round?.members?.length) {
    return {
      groupName: group.label,
      description: group.description,
      members: [],
      reviewIssues: ["Missing local quiz member roster"],
    };
  }

  const kpoppingGroupUrl = `https://kpopping.com/profiles/group/${sourceConfig.kpoppingSlug}`;
  const groupHtml = await fetchHtml(kpoppingGroupUrl);
  const sourceMembers = extractEscapedMembersArray(groupHtml);
  const reviewIssues = [];

  const members = await Promise.all(
    round.members.map(async (siteMember) => {
      const sourceMember = matchSourceMember(siteMember.name, sourceMembers);

      if (!sourceMember) {
        reviewIssues.push(`No kpopping member match found for ${group.label} / ${siteMember.name}`);
        return {
          id: `${slugify(group.label)}-${slugify(siteMember.name)}`,
          displayName: siteMember.name,
          sourceName: null,
          groupName: group.label,
          image: getLocalQuizMediaPath(siteMember.name, group.label),
          kpoppingProfileUrl: kpoppingGroupUrl,
          kprofilesUrl: sourceConfig.kprofilesUrl,
          birthday: null,
          age: null,
          birthplace: null,
          positions: [],
          zodiac: null,
          height: null,
          weight: null,
          bloodType: null,
          mbti: null,
          country: null,
          fullName: null,
          koreanName: null,
          fandom: null,
          debutDate: null,
          representativeColor: null,
          representativeSymbol: null,
          sourceConfidence: "partial",
          sourceSummary: ["Local quiz media fallback only"],
        };
      }

      const memberHtml = await fetchHtml(`https://kpopping.com/profiles/idol/${sourceMember.slug}`);
      const memberSegment = extractMemberSegment(memberHtml, sourceMember.slug);

      if (!memberSegment) {
        reviewIssues.push(`No member detail segment found for ${group.label} / ${sourceMember.name}`);
      }

      const fallbackSeed = getSupplementalBirthdaySeed(group.label, siteMember.name);
      const positionValue = memberSegment ? extractField(memberSegment, "position") : sourceMember.position;
      const imageValue = memberSegment ? extractField(memberSegment, "image") : sourceMember.image;

      return {
        id: `${slugify(group.label)}-${slugify(siteMember.name)}`,
        displayName: siteMember.name,
        sourceName: sourceMember.name,
        groupName: group.label,
        image:
          imageValue ??
          sourceMember.image ??
          getLocalQuizMediaPath(siteMember.name, group.label) ??
          siteMember.image ??
          null,
        kpoppingProfileUrl: `https://kpopping.com/profiles/idol/${sourceMember.slug}`,
        kprofilesUrl: sourceConfig.kprofilesUrl,
        birthday: memberSegment ? extractField(memberSegment, "birthday") : sourceMember.birthday ?? null,
        age: memberSegment ? extractField(memberSegment, "age") : null,
        birthplace: memberSegment ? extractField(memberSegment, "birthplace") : fallbackSeed?.birthplace ?? null,
        positions: positionValue ? String(positionValue).split(",").map((value) => value.trim()).filter(Boolean) : [],
        zodiac: memberSegment ? extractField(memberSegment, "zodiac") : null,
        height: memberSegment ? extractField(memberSegment, "height") : null,
        weight: memberSegment ? extractField(memberSegment, "weight") : null,
        bloodType: memberSegment ? extractField(memberSegment, "bloodType") : null,
        mbti: memberSegment ? extractField(memberSegment, "mbti") : null,
        country: memberSegment ? extractField(memberSegment, "country") : null,
        fullName: memberSegment ? extractField(memberSegment, "fullName") : null,
        koreanName: memberSegment ? extractField(memberSegment, "koreanName") : sourceMember.koreanName ?? null,
        fandom: memberSegment ? extractField(memberSegment, "fandom") : null,
        debutDate: memberSegment ? extractField(memberSegment, "debutDate") : null,
        representativeColor: fallbackSeed?.representativeColor ?? null,
        representativeSymbol: fallbackSeed?.representativeSymbol ?? null,
        sourceConfidence: memberSegment && fallbackSeed ? "high" : memberSegment ? "high" : "medium",
        sourceSummary: fallbackSeed
          ? ["kpopping core profile", "kprofiles supplemental color/symbol"]
          : ["kpopping core profile"],
      };
    }),
  );

  return {
    groupName: group.label,
    description: group.description,
    coverImage: group.coverImage,
    kpoppingUrl: kpoppingGroupUrl,
    kprofilesUrl: sourceConfig.kprofilesUrl,
    members,
    reviewIssues,
  };
}

async function main() {
  const idolRepository = [];
  const reviewQueue = [];

  for (const group of groupQuizzes) {
    try {
      const groupDirectory = await buildGroupDirectory(group);
      idolRepository.push(groupDirectory);

      if (groupDirectory.reviewIssues.length) {
        reviewQueue.push({
          groupName: group.label,
          issues: groupDirectory.reviewIssues,
        });
      }
    } catch (error) {
      reviewQueue.push({
        groupName: group.label,
        issues: [error.message],
      });
    }
  }

  const fileContents = `export const idolRepository = ${JSON.stringify(idolRepository, null, 2)};\n\nexport const idolRepositoryReviewQueue = ${JSON.stringify(reviewQueue, null, 2)};\n`;
  await writeFile(OUTPUT_PATH, fileContents, "utf8");
  console.log(`Wrote idol repository for ${idolRepository.length} groups to ${OUTPUT_PATH}`);
  console.log(`Review queue entries: ${reviewQueue.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
