import { SUPPORTED_INGESTION_GAME_MODES } from "./schema.js";

export function validateArtistData(normalizedArtist, requestedModes = SUPPORTED_INGESTION_GAME_MODES) {
  const errors = [];
  const warnings = [];
  const coverage = {};

  if (!normalizedArtist.artistName) {
    errors.push("artistName is required");
  }

  if (!normalizedArtist.members.length) {
    warnings.push("members are missing");
  }

  if (!normalizedArtist.discography.length) {
    warnings.push("discography is missing");
  }

  if (!normalizedArtist.fandomName) {
    warnings.push("fandom name is missing");
  }

  requestedModes.forEach((modeId) => {
    if (modeId === "main-game") {
      coverage[modeId] =
        normalizedArtist.members.length > 0 &&
        (Boolean(normalizedArtist.fandomName) ||
          Boolean(normalizedArtist.lightstick?.name) ||
          normalizedArtist.discography.length > 0);
      if (!coverage[modeId]) warnings.push("main-game lacks enough verified profile material");
      return;
    }

    if (modeId === "finish-the-lyric") {
      coverage[modeId] = normalizedArtist.lyricMaterial.length > 0;
      if (!coverage[modeId]) warnings.push("finish-the-lyric has no permitted lyric material");
      return;
    }

    if (modeId === "emoji-song-guess") {
      coverage[modeId] = normalizedArtist.discography.some(
        (release) => (release.titleTracks?.length ?? 0) > 0,
      );
      if (!coverage[modeId]) warnings.push("emoji-song-guess has no verified title tracks");
      return;
    }

    if (modeId === "album-cover-zoom") {
      coverage[modeId] = normalizedArtist.discography.some((release) => Boolean(release.albumCover));
      if (!coverage[modeId]) warnings.push("album-cover-zoom has no verified cover art");
      return;
    }

    if (modeId === "lightstick-silhouette-guess") {
      coverage[modeId] = Boolean(normalizedArtist.lightstick?.imageUrl);
      if (!coverage[modeId]) warnings.push("lightstick-silhouette-guess has no verified lightstick image");
      return;
    }

    if (modeId === "mixed-group") {
      coverage[modeId] = normalizedArtist.members.length > 0 || normalizedArtist.discography.length > 0;
    }
  });

  return {
    artistName: normalizedArtist.artistName,
    valid: errors.length === 0,
    errors,
    warnings,
    requestedModes,
    coverage,
    reviewQueue: normalizedArtist.reviewQueue,
    conflicts: normalizedArtist.conflicts,
  };
}
