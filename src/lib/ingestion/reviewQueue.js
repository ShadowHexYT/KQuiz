export function addReviewItem(reviewQueue, item) {
  reviewQueue.push({
    field: item.field,
    reason: item.reason,
    sourcesChecked: item.sourcesChecked ?? [],
  });
}

export function addSkippedItem(skippedItems, item) {
  skippedItems.push({
    field: item.field,
    reason: item.reason,
    modeId: item.modeId ?? null,
    source: item.source ?? null,
  });
}
