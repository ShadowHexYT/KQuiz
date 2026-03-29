import test from "node:test";
import assert from "node:assert/strict";

import { buildIndividualQuizForGroup } from "../../src/lib/individualQuiz/index.js";

test("individual group quiz builds long-form easy medium and hard pools", () => {
  const quiz = buildIndividualQuizForGroup("TWICE");

  assert.equal(quiz.coverage.easy, 25);
  assert.equal(quiz.coverage.medium, 25);
  assert.equal(quiz.coverage.hard, 25);
});

test("individual group quiz does not reuse blocked main-game template families", () => {
  const quiz = buildIndividualQuizForGroup("LE SSERAFIM");
  const allQuestions = Object.values(quiz.questionPools).flat();

  assert.ok(allQuestions.length > 0);
  assert.ok(allQuestions.every((question) => question.overlapRisk === "safe"));
  assert.ok(allQuestions.every((question) => question.templateFamily !== "guess-the-group"));
  assert.ok(allQuestions.every((question) => !question.prompt.includes("Which group is this round built around?")));
});

test("individual group quiz keeps a varied template mix instead of one dominant pattern", () => {
  const quiz = buildIndividualQuizForGroup("Girlset");

  Object.values(quiz.questionPools).forEach((questions) => {
    const familyCounts = questions.reduce((accumulator, question) => {
      accumulator[question.templateFamily] = (accumulator[question.templateFamily] ?? 0) + 1;
      return accumulator;
    }, {});

    const uniqueFamilyCount = Object.keys(familyCounts).length;
    const maxFamilyCount = Math.max(...Object.values(familyCounts));

    assert.ok(uniqueFamilyCount >= 10);
    assert.ok(maxFamilyCount <= 6);
  });
});
