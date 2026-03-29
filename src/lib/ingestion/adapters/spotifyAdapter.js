import { BaseSourceAdapter } from "./baseAdapter.js";

export class SpotifyAdapter extends BaseSourceAdapter {
  constructor() {
    super({ sourceName: "spotify" });
  }

  supports(request) {
    return Boolean(request?.sources?.spotify?.payload);
  }

  async fetchArtistPayload(request) {
    return request.sources.spotify.payload;
  }

  parseArtistPayload(payload) {
    return {
      fields: {
        artistName: payload.artistName ?? null,
        discography: payload.discography ?? [],
        streamingLinks: payload.streamingLinks ?? {},
        notableFacts: payload.notableFacts ?? [],
      },
      raw: payload,
    };
  }
}
