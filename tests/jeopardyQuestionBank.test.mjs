import test from "node:test";
import assert from "node:assert/strict";

import { buildJeopardyBoard, jeopardyCategoryPool } from "../src/data/jeopardyQuestionBank.js";

const bannedPromptPatterns = [
  /your bias/i,
  /favorites list/i,
  /name one/i,
  /main-game round/i,
  /pick another real member/i,
  /which group do these questions belong/i,
];

test("jeopardy clue bank avoids subjective or ambiguous prompt wording", () => {
  const badPrompts = jeopardyCategoryPool.flatMap((category) =>
    category.questions
      .filter((question) => bannedPromptPatterns.some((pattern) => pattern.test(question.prompt)))
      .map((question) => ({ category: category.title, prompt: question.prompt })),
  );

  assert.deepEqual(badPrompts, []);
});

test("jeopardy board builds five cohesive categories with five clues each", () => {
  const board = buildJeopardyBoard(4);

  assert.equal(board.length, 5);
  board.forEach((category) => {
    assert.equal(category.boardQuestions.length, 5);
    category.boardQuestions.forEach((question) => {
      assert.ok(question.prompt);
      assert.ok(question.answer);
    });
  });
});

test("jeopardy includes the new meme, album, and cover categories with playable data", () => {
  const memeCategory = jeopardyCategoryPool.find((category) => category.id === "meme-moments");
  const albumCategory = jeopardyCategoryPool.find((category) => category.id === "whose-album-is-this");
  const coverCategory = jeopardyCategoryPool.find((category) => category.id === "who-covered");

  assert.ok(memeCategory);
  assert.ok(albumCategory);
  assert.ok(coverCategory);

  assert.ok(memeCategory.questions.length >= 5);
  assert.ok(albumCategory.questions.some((question) => question.image && question.imageStyle));
  assert.ok(
    coverCategory.questions.every(
      (question) => question.answer && Array.isArray(question.choices) && question.choices.length >= 2,
    ),
  );
});
