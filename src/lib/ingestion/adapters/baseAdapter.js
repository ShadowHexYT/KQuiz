export class BaseSourceAdapter {
  constructor({ sourceName }) {
    this.sourceName = sourceName;
  }

  supports() {
    return true;
  }

  async fetchArtistPayload() {
    return null;
  }

  parseArtistPayload() {
    return null;
  }

  async collectArtistData(request, context = {}) {
    if (!this.supports(request)) {
      return {
        source: this.sourceName,
        status: "skipped",
        reason: "source_not_configured",
        fields: {},
      };
    }

    const payload = await this.fetchArtistPayload(request, context);
    if (!payload) {
      return {
        source: this.sourceName,
        status: "skipped",
        reason: "no_payload",
        fields: {},
      };
    }

    const parsed = this.parseArtistPayload(payload, request, context);
    return {
      source: this.sourceName,
      status: parsed ? "ok" : "skipped",
      reason: parsed ? null : "unparseable_payload",
      fields: parsed?.fields ?? {},
      raw: parsed?.raw ?? payload,
    };
  }
}
