import { groupQuizzes } from "../../data/groupQuizzes.js";

const EXCLUDED_GROUPS = new Set(["BLACKPINK"]);

export function getSupportedPlaylistGroups() {
  return groupQuizzes
    .map((group) => group.label)
    .filter(Boolean)
    .filter((groupName) => !EXCLUDED_GROUPS.has(groupName))
    .sort((left, right) => left.localeCompare(right));
}

export function isSupportedPlaylistGroup(groupName) {
  return getSupportedPlaylistGroups().includes(groupName);
}

export function buildSupportedGroupSet() {
  return new Set(getSupportedPlaylistGroups());
}
