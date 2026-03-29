import { BaseSourceAdapter } from "./baseAdapter.js";

export class KpoppingAdapter extends BaseSourceAdapter {
  constructor() {
    super({ sourceName: "kpopping" });
  }

  supports(request) {
    return Boolean(request?.sources?.kpopping?.payload);
  }

  async fetchArtistPayload(request) {
    return request.sources.kpopping.payload;
  }

  parseArtistPayload(payload) {
    return {
      fields: {
        artistName: payload.artistName ?? null,
        aliases: payload.aliases ?? [],
        company: payload.company ?? null,
        debutDate: payload.debutDate ?? null,
        debutSong: payload.debutSong ?? null,
        nameMeaning: payload.nameMeaning ?? null,
        originStory: payload.originStory ?? null,
        fandomName: payload.fandomName ?? null,
        members: payload.members ?? [],
        discography: payload.discography ?? [],
        eras: payload.eras ?? [],
        notableFacts: payload.notableFacts ?? [],
      },
      raw: payload,
    };
  }
}
