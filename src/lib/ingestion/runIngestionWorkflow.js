import { OfficialMetadataAdapter } from "./adapters/officialMetadataAdapter.js";
import { KpoppingAdapter } from "./adapters/kpoppingAdapter.js";
import { SpotifyAdapter } from "./adapters/spotifyAdapter.js";
import { RepoCatalogAdapter, getRepoCatalogArtistNames } from "./repoCatalogAdapter.js";
import { normalizeArtistResults } from "./normalizeArtist.js";
import { validateArtistData } from "./validateArtistData.js";
import { generateQuizQuestionsForArtist } from "./generateQuizQuestions.js";
import { buildKnowledgeProfile } from "./buildKnowledgeProfile.js";
import { generateQuestionBank } from "./generateQuestionBank.js";
import { SUPPORTED_INGESTION_GAME_MODES } from "./schema.js";

export async function runIngestionWorkflow({
  artists,
  requestedModes = SUPPORTED_INGESTION_GAME_MODES,
  cacheApi = null,
}) {
  const adapters = [
    new RepoCatalogAdapter(),
    new OfficialMetadataAdapter(),
    new KpoppingAdapter(),
    new SpotifyAdapter(),
  ];

  const processedArtists = [];
  const requestedArtists =
    artists?.length
      ? artists
      : getRepoCatalogArtistNames().map((artistName) => ({
          artistName,
          sources: {},
        }));

  for (const artistRequest of requestedArtists) {
    const adapterResults = [];

    for (const adapter of adapters) {
      const cacheKey = `${artistRequest.artistName}-${adapter.sourceName}`;
      const cachedPayload = cacheApi ? await cacheApi.read(cacheKey) : null;
      if (cachedPayload) {
        adapterResults.push(cachedPayload);
        continue;
      }

      const result = await adapter.collectArtistData(artistRequest, {});
      adapterResults.push(result);
      if (cacheApi) {
        await cacheApi.write(cacheKey, result);
      }
    }

    const normalizedArtist = normalizeArtistResults(artistRequest, adapterResults);
    const validationReport = validateArtistData(normalizedArtist, requestedModes);
    const quizQuestionJson = generateQuizQuestionsForArtist(normalizedArtist, requestedModes);
    const knowledgeProfileJson = buildKnowledgeProfile(normalizedArtist);

    processedArtists.push({
      artistName: artistRequest.artistName,
      requestedModes,
      adapterResults,
      normalizedArtistJson: normalizedArtist,
      knowledgeProfileJson,
      quizQuestionJson,
      validationReport,
      skippedItemsReport: quizQuestionJson.skippedItems,
    });
  }

  const questionBankJson = generateQuestionBank(
    processedArtists.map((artistResult) => artistResult.knowledgeProfileJson),
  );

  return {
    requestedModes,
    processedArtists,
    questionBankJson,
  };
}
