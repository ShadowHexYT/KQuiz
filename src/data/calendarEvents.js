const HUNTER_BIAS_KEYS = new Set([
  "LE SSERAFIM::Chaewon",
  "IVE::Wonyoung",
  "NMIXX::Sullyoon",
]);

const SPOTLIGHT_GROUPS = new Set(["LE SSERAFIM", "IVE", "NMIXX"]);
export const LOCAL_MARKET = "Chicago, IL";
export const CALENDAR_REFRESH_DAYS = 31;
export const CALENDAR_WINDOW_MONTHS = 3;

export const idolBirthdaySeeds = [
  { groupName: "LE SSERAFIM", idolName: "Sakura", month: 3, day: 19, birthplace: "Kagoshima City, Japan", representativeColor: "Pink", representativeSymbol: "Pink Diamond" },
  { groupName: "LE SSERAFIM", idolName: "Chaewon", month: 8, day: 1, birthplace: "Seoul, South Korea", representativeColor: "Silver", representativeSymbol: "Diamond" },
  { groupName: "LE SSERAFIM", idolName: "Yunjin", month: 10, day: 8, birthplace: "Seoul, South Korea / New York, USA", representativeColor: "Green", representativeSymbol: "Emerald" },
  { groupName: "LE SSERAFIM", idolName: "Kazuha", month: 8, day: 9, birthplace: "Kochi, Japan", representativeColor: "Blue", representativeSymbol: "Sapphire" },
  { groupName: "LE SSERAFIM", idolName: "Eunchae", month: 11, day: 10, birthplace: "Seoul, South Korea", representativeColor: "Red", representativeSymbol: "Ruby" },
  { groupName: "IVE", idolName: "Yujin", month: 9, day: 1, birthplace: "Daejeon, South Korea", representativeColor: "Magenta", representativeSymbol: "Dog" },
  { groupName: "IVE", idolName: "Gaeul", month: 9, day: 24, birthplace: "Incheon, South Korea", representativeColor: "Dark Blue", representativeSymbol: "Squirrel" },
  { groupName: "IVE", idolName: "Rei", month: 2, day: 3, birthplace: "Nagoya, Japan", representativeColor: "Green", representativeSymbol: "Butterfly / Chick" },
  { groupName: "IVE", idolName: "Wonyoung", month: 8, day: 31, birthplace: "Seoul, South Korea", representativeColor: "Red", representativeSymbol: "Bunny" },
  { groupName: "IVE", idolName: "Liz", month: 11, day: 21, birthplace: "Jeju, South Korea", representativeColor: "Cyan", representativeSymbol: "Black Cat" },
  { groupName: "IVE", idolName: "Leeseo", month: 2, day: 21, birthplace: "Seoul, South Korea", representativeColor: "Blue", representativeSymbol: "Tiger" },
  { groupName: "NMIXX", idolName: "Haewon", month: 2, day: 25, birthplace: "Incheon, South Korea", representativeColor: "White", representativeSymbol: "Bear" },
  { groupName: "NMIXX", idolName: "Lily", month: 10, day: 17, birthplace: "Marysville, Victoria, Australia", representativeColor: "Baby Blue", representativeSymbol: "Koala" },
  { groupName: "NMIXX", idolName: "Sullyoon", month: 1, day: 26, birthplace: "Daejeon, South Korea", representativeColor: "Dark Blue", representativeSymbol: "Bunny" },
  { groupName: "NMIXX", idolName: "Bae", month: 12, day: 28, birthplace: "Yangsan, South Korea", representativeColor: "Yellow", representativeSymbol: "Chick" },
  { groupName: "NMIXX", idolName: "Jiwoo", month: 4, day: 13, birthplace: "Namyangju, South Korea", representativeColor: "Red", representativeSymbol: "Puppy" },
  { groupName: "NMIXX", idolName: "Kyujin", month: 5, day: 26, birthplace: "Seongnam, South Korea", representativeColor: "Pink", representativeSymbol: "Cat" },
].map((entry) => ({
  ...entry,
  type: "birthday",
  isRecurringAnnual: true,
  isHunterBias: HUNTER_BIAS_KEYS.has(`${entry.groupName}::${entry.idolName}`),
  isSpotlight: SPOTLIGHT_GROUPS.has(entry.groupName),
  source:
    entry.groupName === "LE SSERAFIM"
      ? "https://kprofiles.com/le-sserafim-members-profile/"
      : entry.groupName === "IVE"
        ? "https://kprofiles.com/ive-members-profile/"
        : "https://kprofiles.com/nmixx-profile/",
}));

export const scheduledEventSeeds = [
  {
    id: "nmixx-brooklyn-2026",
    type: "concert",
    title: "NMIXX 1ST WORLD TOUR [EPISODE 1: ZERO FRONTIER] IN BROOKLYN",
    groupName: "NMIXX",
    startDate: "2026-03-31",
    endDate: null,
    location: "Brooklyn, NY",
    venue: "Brooklyn Paramount",
    localMarket: false,
    isSpotlight: true,
    isHunterBias: true,
    source: "https://www.ticketmaster.com/nmixx-tickets/artist/2968285",
  },
  {
    id: "nmixx-national-harbor-2026",
    type: "concert",
    title: "NMIXX 1ST WORLD TOUR [EPISODE 1: ZERO FRONTIER] IN NATIONAL HARBOR",
    groupName: "NMIXX",
    startDate: "2026-04-02",
    endDate: null,
    location: "National Harbor, MD",
    venue: "The Theater at MGM National Harbor",
    localMarket: false,
    isSpotlight: true,
    isHunterBias: true,
    source: "https://www.ticketmaster.com/nmixx-tickets/artist/2968285",
  },
  {
    id: "ive-newark-2026",
    type: "concert",
    title: "IVE WORLD TOUR <SHOW WHAT I AM> IN NEWARK",
    groupName: "IVE",
    startDate: "2026-07-25",
    endDate: null,
    location: "Newark, NJ",
    venue: "Prudential Center",
    localMarket: false,
    isSpotlight: true,
    isHunterBias: true,
    source: "https://www.ticketmaster.com/ive-tickets/artist/2860741",
  },
  {
    id: "ive-austin-2026",
    type: "concert",
    title: "IVE WORLD TOUR <SHOW WHAT I AM> IN AUSTIN",
    groupName: "IVE",
    startDate: "2026-07-29",
    endDate: null,
    location: "Austin, TX",
    venue: "Moody Center ATX",
    localMarket: false,
    isSpotlight: true,
    isHunterBias: true,
    source: "https://www.ticketmaster.com/ive-tickets/artist/2860741",
  },
  {
    id: "ive-la-2026",
    type: "concert",
    title: "IVE WORLD TOUR <SHOW WHAT I AM> IN LOS ANGELES",
    groupName: "IVE",
    startDate: "2026-08-01",
    endDate: null,
    location: "Inglewood, CA",
    venue: "Kia Forum",
    localMarket: false,
    isSpotlight: true,
    isHunterBias: true,
    source: "https://www.ticketmaster.com/ive-tickets/artist/2860741",
  },
  {
    id: "lesserafim-summersonic-2026",
    type: "festival",
    title: "SUMMER SONIC 2026 lineup appearance",
    groupName: "LE SSERAFIM",
    startDate: "2026-08-14",
    endDate: "2026-08-16",
    location: "Tokyo / Osaka, Japan",
    venue: "SUMMER SONIC",
    localMarket: false,
    isSpotlight: true,
    isHunterBias: true,
    source: "https://www.summersonic.com/en/news/26-02-02/",
  },
];

function toDateParts(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
}

function getNextBirthdayDate(month, day, today) {
  const currentYear = today.getFullYear();
  const candidate = new Date(Date.UTC(currentYear, month - 1, day));
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  if (candidate < todayUtc) {
    return new Date(Date.UTC(currentYear + 1, month - 1, day));
  }

  return candidate;
}

function addMonths(date, months) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()));
}

function createWindowBounds(today = new Date(), monthsAhead = CALENDAR_WINDOW_MONTHS) {
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const windowEnd = addMonths(todayUtc, monthsAhead);
  return { todayUtc, windowEnd };
}

function isEventInsideWindow(eventTimestamp, todayUtc, windowEnd) {
  return eventTimestamp >= todayUtc.getTime() && eventTimestamp <= windowEnd.getTime();
}

export function getCalendarFeed(today = new Date(), options = {}) {
  const monthsAhead = options.monthsAhead ?? CALENDAR_WINDOW_MONTHS;
  const { todayUtc, windowEnd } = createWindowBounds(today, monthsAhead);
  const generatedAt = todayUtc.toISOString().slice(0, 10);
  const refreshAfterDate = addMonths(todayUtc, 1);

  const birthdayEvents = idolBirthdaySeeds.map((entry) => {
    const nextDate = getNextBirthdayDate(entry.month, entry.day, today);
    return {
      ...entry,
      id: `${slugify(`${entry.groupName}-${entry.idolName}`)}-${nextDate.getUTCFullYear()}`,
      startDate: nextDate.toISOString().slice(0, 10),
      endDate: null,
      dateLabel: `${entry.month}/${entry.day}`,
    };
  });

  const allEvents = [...birthdayEvents, ...scheduledEventSeeds]
    .map((event) => {
      const { year, month, day } = toDateParts(event.startDate);
      return {
        ...event,
        timestamp: Date.UTC(year, month - 1, day),
      };
    })
    .filter((event) => isEventInsideWindow(event.timestamp, todayUtc, windowEnd))
    .sort((left, right) => left.timestamp - right.timestamp);

  return {
    generatedAt,
    refreshAfter: refreshAfterDate.toISOString().slice(0, 10),
    windowStart: generatedAt,
    windowEnd: windowEnd.toISOString().slice(0, 10),
    monthsAhead,
    localMarket: LOCAL_MARKET,
    biases: [...HUNTER_BIAS_KEYS],
    spotlightGroups: [...SPOTLIGHT_GROUPS],
    events: allEvents,
  };
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
