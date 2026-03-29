import { BaseSourceAdapter } from "./adapters/baseAdapter.js";
import { mainQuizRounds, getSongMeta } from "../../data/mainQuizRounds.js";
import { groupQuizzes } from "../../data/groupQuizzes.js";
import { playlistSongs, lyricPrompts } from "../../data/playlistGamePacks.js";
import { groupVerifiedFacts } from "../../data/groupVerifiedFacts.js";

function dedupe(values) {
  return [...new Set(values.filter(Boolean))];
}

function groupBy(values, getKey) {
  return values.reduce((accumulator, value) => {
    const key = getKey(value);
    if (!accumulator[key]) accumulator[key] = [];
    accumulator[key].push(value);
    return accumulator;
  }, {});
}

function buildMembers(round) {
  if (!round) return [];

  const leader = round.extras.find((extra) => extra.key === "leader")?.answer ?? null;
  const maknae = round.extras.find((extra) => extra.key === "maknae")?.answer ?? null;
  const bias = round.extras.find((extra) => extra.key === "bias")?.answer ?? null;

  return round.members.map((member) => ({
    name: member.name,
    image: member.image ?? null,
    roles: {
      leader: member.name === leader,
      maknae: member.name === maknae,
      bias: member.name === bias,
    },
  }));
}

function buildDiscography(artistName) {
  const songs = playlistSongs.filter((song) => song.artist === artistName);
  const songsByAlbum = groupBy(songs, (song) => song.album);

  return Object.entries(songsByAlbum).map(([albumTitle, albumSongs]) => {
    const firstSong = albumSongs[0];
    const songMeta = getSongMeta(firstSong.artist, firstSong.title);

    return {
      title: albumTitle,
      type: albumTitle?.includes("Single") ? "single" : "album",
      releaseDate: null,
      era: null,
      albumCover: songMeta.coverImage ?? null,
      titleTracks: dedupe(albumSongs.map((song) => song.title)),
      notableBSides: [],
      trackTitles: dedupe(albumSongs.map((song) => song.title)),
      streamingLinks: {},
    };
  });
}

function buildLyricMaterial(artistName) {
  return lyricPrompts
    .filter((prompt) => prompt.artist === artistName)
    .map((prompt) => ({
      songTitle: prompt.title,
      snippet: prompt.lyricLeadIn,
      isPermitted: true,
    }));
}

export class RepoCatalogAdapter extends BaseSourceAdapter {
  constructor() {
    super({ sourceName: "repoCatalog" });
  }

  supports(request) {
    const artistName = request?.artistName;
    return Boolean(
      artistName &&
        (groupQuizzes.some((group) => group.label === artistName) ||
          mainQuizRounds.some((round) => round.groupName === artistName) ||
          groupVerifiedFacts[artistName]),
    );
  }

  async fetchArtistPayload(request) {
    const artistName = request.artistName;
    const groupQuiz = groupQuizzes.find((group) => group.label === artistName) ?? null;
    const round = mainQuizRounds.find((entry) => entry.groupName === artistName) ?? null;
    const reference = groupVerifiedFacts[artistName] ?? {};

    return {
      artistName,
      aliases: reference.aliases ?? [],
      description: groupQuiz?.description ?? null,
      fandomName: reference.fandom ?? null,
      company: reference.company ?? null,
      debutDate: reference.debutDate ?? null,
      debutSong: reference.debutSong ?? null,
      nameMeaning: reference.nameMeaning ?? null,
      originStory: reference.originStory ?? null,
      varietySeries: reference.varietySeries ?? null,
      members: buildMembers(round),
      lightstick: reference.lightstick
        ? {
            name: reference.lightstick,
            imageUrl: null,
            source: "repoCatalog",
          }
        : null,
      discography: buildDiscography(artistName),
      lyricMaterial: buildLyricMaterial(artistName),
      eras: [],
      notableFacts: dedupe([reference.achievementAnswer, reference.varietySeries, reference.nameMeaning]).map(
        (value) => ({ value }),
      ),
    };
  }

  parseArtistPayload(payload) {
    return {
      fields: {
        artistName: payload.artistName ?? null,
        aliases: payload.aliases ?? [],
        description: payload.description ?? null,
        fandomName: payload.fandomName ?? null,
        company: payload.company ?? null,
        debutDate: payload.debutDate ?? null,
        debutSong: payload.debutSong ?? null,
        nameMeaning: payload.nameMeaning ?? null,
        originStory: payload.originStory ?? null,
        varietySeries: payload.varietySeries ?? null,
        members: payload.members ?? [],
        lightstick: payload.lightstick ?? null,
        discography: payload.discography ?? [],
        lyricMaterial: payload.lyricMaterial ?? [],
        eras: payload.eras ?? [],
        notableFacts: payload.notableFacts ?? [],
      },
      raw: payload,
    };
  }
}

export function getRepoCatalogArtistNames() {
  return dedupe([
    ...groupQuizzes.map((group) => group.label),
    ...mainQuizRounds.map((round) => round.groupName),
    ...Object.keys(groupVerifiedFacts),
  ]).sort((left, right) => left.localeCompare(right));
}
