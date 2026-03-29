import { createEmptyKnowledgeProfile } from "./schema.js";
import { scoreFact } from "./factScoring.js";

function addFact(profile, fact) {
  profile.factPool.push(fact);
  fact.sources.forEach((source) => {
    profile.sourceSummary[source] = (profile.sourceSummary[source] ?? 0) + 1;
  });
}

function createFact({ id, groupName, type, category, label, value, sources, flags = {}, extra = {} }) {
  const scores = scoreFact({
    category,
    sources,
    isNotable: flags.isNotable,
    isBroadlyKnown: flags.isBroadlyKnown,
    supportsVisualPrompt: flags.supportsVisualPrompt,
    supportsAudioPrompt: flags.supportsAudioPrompt,
    hasCompliantSnippet: flags.hasCompliantSnippet,
  });

  return {
    id,
    groupName,
    type,
    category,
    label,
    value,
    sources,
    ...scores,
    ...extra,
  };
}

export function buildKnowledgeProfile(normalizedArtist) {
  const profile = createEmptyKnowledgeProfile(normalizedArtist.artistName);
  const groupName = normalizedArtist.artistName;

  addFact(
    profile,
    createFact({
      id: `${groupName}-identity`,
      groupName,
      type: "group_name",
      category: "group_identity",
      label: "Group identity",
      value: groupName,
      sources: ["repoCatalog"],
      flags: { isBroadlyKnown: true },
    }),
  );

  normalizedArtist.aliases.forEach((alias) =>
    addFact(
      profile,
      createFact({
        id: `${groupName}-alias-${alias}`,
        groupName,
        type: "alias",
        category: "group_identity",
        label: "Alias",
        value: alias,
        sources: ["repoCatalog"],
        flags: { isNotable: true },
      }),
    ),
  );

  if (normalizedArtist.fandomName) {
    addFact(
      profile,
      createFact({
        id: `${groupName}-fandom`,
        groupName,
        type: "fandom",
        category: "fandom",
        label: "Fandom name",
        value: normalizedArtist.fandomName,
        sources: normalizedArtist.sources.fandomName?.map((entry) => entry.source) ?? ["repoCatalog"],
        flags: { isBroadlyKnown: true },
      }),
    );
  }

  if (normalizedArtist.lightstick?.name) {
    addFact(
      profile,
      createFact({
        id: `${groupName}-lightstick`,
        groupName,
        type: "lightstick",
        category: "lightstick",
        label: "Lightstick",
        value: normalizedArtist.lightstick.name,
        sources: [normalizedArtist.lightstick.source ?? "repoCatalog"],
        flags: { isBroadlyKnown: true, supportsVisualPrompt: Boolean(normalizedArtist.lightstick.imageUrl) },
        extra: {
          imageUrl: normalizedArtist.lightstick.imageUrl ?? null,
        },
      }),
    );
  }

  normalizedArtist.members.forEach((member) => {
    addFact(
      profile,
      createFact({
        id: `${groupName}-member-${member.name}`,
        groupName,
        type: "member",
        category: "member_identity",
        label: "Member",
        value: member.name,
        sources: ["repoCatalog"],
        flags: { isBroadlyKnown: true, supportsVisualPrompt: Boolean(member.image) },
        extra: {
          image: member.image ?? null,
        },
      }),
    );

    if (member.roles.leader) {
      addFact(
        profile,
        createFact({
          id: `${groupName}-leader`,
          groupName,
          type: "leader",
          category: "member_role",
          label: "Leader",
          value: member.name,
          sources: ["repoCatalog"],
          flags: { isBroadlyKnown: true },
        }),
      );
    }

    if (member.roles.maknae) {
      addFact(
        profile,
        createFact({
          id: `${groupName}-maknae`,
          groupName,
          type: "maknae",
          category: "member_role",
          label: "Maknae",
          value: member.name,
          sources: ["repoCatalog"],
          flags: { isBroadlyKnown: true },
        }),
      );
    }

    if (member.roles.bias) {
      addFact(
        profile,
        createFact({
          id: `${groupName}-bias`,
          groupName,
          type: "bias",
          category: "member_role",
          label: "Bias pick",
          value: member.name,
          sources: ["repoCatalog"],
          flags: { isNotable: true },
        }),
      );
    }
  });

  normalizedArtist.discography.forEach((release, releaseIndex) => {
    addFact(
      profile,
      createFact({
        id: `${groupName}-album-${releaseIndex}`,
        groupName,
        type: "album",
        category: "album",
        label: "Album",
        value: release.title,
        sources: release.sources ?? ["repoCatalog"],
        flags: { isBroadlyKnown: releaseIndex < 2, supportsVisualPrompt: Boolean(release.albumCover) },
        extra: {
          albumCover: release.albumCover ?? null,
          releaseDate: release.releaseDate ?? null,
        },
      }),
    );

    release.titleTracks.forEach((songTitle, songIndex) => {
      addFact(
        profile,
        createFact({
          id: `${groupName}-title-track-${songTitle}`,
          groupName,
          type: "title_track",
          category: "title_track",
          label: "Title track",
          value: songTitle,
          sources: release.sources ?? ["repoCatalog"],
          flags: { isBroadlyKnown: songIndex < 2, supportsAudioPrompt: true },
          extra: {
            albumTitle: release.title,
            albumCover: release.albumCover ?? null,
            releaseDate: release.releaseDate ?? null,
          },
        }),
      );
    });

    release.notableBSides?.forEach((songTitle) => {
      addFact(
        profile,
        createFact({
          id: `${groupName}-bside-${songTitle}`,
          groupName,
          type: "b_side",
          category: "b_side",
          label: "Notable B-side",
          value: songTitle,
          sources: release.sources ?? ["repoCatalog"],
          flags: { isNotable: true, supportsAudioPrompt: true },
          extra: {
            albumTitle: release.title,
          },
        }),
      );
    });
  });

  normalizedArtist.lyricMaterial.forEach((lyric) => {
    addFact(
      profile,
      createFact({
        id: `${groupName}-lyric-${lyric.songTitle}`,
        groupName,
        type: "lyric",
        category: "lyric",
        label: "Lyric snippet",
        value: lyric.songTitle,
        sources: [lyric.source],
        flags: { hasCompliantSnippet: true },
        extra: {
          snippet: lyric.snippet,
        },
      }),
    );
  });

  if (normalizedArtist.debutSong) {
    addFact(
      profile,
      createFact({
        id: `${groupName}-debut-song`,
        groupName,
        type: "debut_song",
        category: "title_track",
        label: "Debut song",
        value: normalizedArtist.debutSong,
        sources: normalizedArtist.sources.debutSong?.map((entry) => entry.source) ?? ["repoCatalog"],
        flags: { isBroadlyKnown: true },
      }),
    );
  }

  [normalizedArtist.company, normalizedArtist.nameMeaning, normalizedArtist.originStory, normalizedArtist.varietySeries]
    .filter(Boolean)
    .forEach((value, index) => {
      addFact(
        profile,
        createFact({
          id: `${groupName}-community-${index}`,
          groupName,
          type: "community",
          category: "community",
          label: "Community / identity fact",
          value,
          sources: ["repoCatalog"],
          flags: { isNotable: true },
        }),
      );
    });

  normalizedArtist.notableFacts.forEach((fact, index) => {
    addFact(
      profile,
      createFact({
        id: `${groupName}-notable-${index}`,
        groupName,
        type: "notable_fact",
        category: "notable_fact",
        label: "Notable fact",
        value: fact.value,
        sources: [fact.source ?? "repoCatalog"],
        flags: { isNotable: true },
      }),
    );
  });

  return profile;
}
