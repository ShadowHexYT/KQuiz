import { getRepoCatalogArtistNames } from "../ingestion/repoCatalogAdapter.js";
import { buildGroupQuizProfile } from "./buildGroupQuizProfile.js";
import { generateIndividualQuizMode } from "./generateIndividualQuizQuestions.js";

export function buildAllIndividualQuizProfiles() {
  return getRepoCatalogArtistNames().map((groupName) => buildGroupQuizProfile(groupName));
}

export function buildIndividualQuizForGroup(groupName) {
  const allProfiles = buildAllIndividualQuizProfiles();
  const targetProfile = allProfiles.find((profile) => profile.groupName === groupName);

  if (!targetProfile) {
    return {
      groupName,
      rounds: [],
      questionPools: {},
      reviewQueue: [
        {
          field: "groupName",
          reason: "unknown_group",
          groupName,
        },
      ],
      coverage: {},
    };
  }

  return generateIndividualQuizMode(targetProfile, allProfiles);
}
