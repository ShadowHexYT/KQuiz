export const SOURCE_PRIORITY = {
  repoCatalog: 88,
  official: 100,
  officialStore: 95,
  officialStreaming: 90,
  spotify: 70,
  appleMusic: 68,
  kpopping: 55,
};

export function getSourcePriority(sourceName) {
  return SOURCE_PRIORITY[sourceName] ?? 0;
}

export function compareSourcePriority(leftSource, rightSource) {
  return getSourcePriority(rightSource) - getSourcePriority(leftSource);
}

export function sortSourcesByPriority(sources) {
  return [...sources].sort(
    (left, right) => getSourcePriority(right.source) - getSourcePriority(left.source),
  );
}
