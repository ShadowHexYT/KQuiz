import { BaseSourceAdapter } from "./baseAdapter.js";

export class OfficialMetadataAdapter extends BaseSourceAdapter {
  constructor() {
    super({ sourceName: "official" });
  }

  supports(request) {
    return Boolean(request?.sources?.official?.payload);
  }

  async fetchArtistPayload(request) {
    return request.sources.official.payload;
  }

  parseArtistPayload(payload) {
    return {
      fields: {
        artistName: payload.artistName ?? null,
        aliases: payload.aliases ?? [],
        description: payload.description ?? null,
        company: payload.company ?? null,
        debutDate: payload.debutDate ?? null,
        debutSong: payload.debutSong ?? null,
        nameMeaning: payload.nameMeaning ?? null,
        originStory: payload.originStory ?? null,
        varietySeries: payload.varietySeries ?? null,
        fandomName: payload.fandomName ?? null,
        lightstick: payload.lightstick ?? null,
        members: payload.members ?? [],
        discography: payload.discography ?? [],
        lyricMaterial: payload.lyricMaterial ?? [],
        eras: payload.eras ?? [],
        notableFacts: payload.notableFacts ?? [],
      },
      raw: payload,
    };
  }
}
