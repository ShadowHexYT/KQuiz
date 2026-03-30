import test from "node:test";
import assert from "node:assert/strict";

import { buildIndividualQuizForGroup } from "../../src/lib/individualQuiz/index.js";

test("individual group quiz keeps deep difficulty pools and builds one mixed playthrough", () => {
  const quiz = buildIndividualQuizForGroup("TWICE");

  assert.equal(quiz.coverage.easy, 25);
  assert.equal(quiz.coverage.medium, 25);
  assert.equal(quiz.coverage.hard, 25);
  assert.equal(quiz.rounds.length, 1);
  assert.ok(quiz.coverage.mixed >= 25);
  assert.ok(quiz.mixPlan.easy > quiz.mixPlan.hard);
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

test("individual group quiz surfaces deeper group-specific categories when verified facts exist", () => {
  const quiz = buildIndividualQuizForGroup("NewJeans");
  const mediumAndHardQuestions = [...quiz.questionPools.medium, ...quiz.questionPools.hard];

  assert.ok(
    mediumAndHardQuestions.some((question) => question.templateFamily === "member-credit-spotlight"),
  );
  assert.ok(
    mediumAndHardQuestions.some((question) => question.templateFamily === "member-credit-song-lock"),
  );
  assert.ok(
    mediumAndHardQuestions.some((question) => question.templateFamily === "video-clue-spotlight"),
  );
  assert.ok(
    mediumAndHardQuestions.some(
      (question) =>
        question.metadata?.sourceUrl === "https://en.wikipedia.org/wiki/Get_Up_(EP)",
    ),
  );
});

test("deeper verified facts can drive hard fan questions beyond the base main-game data", () => {
  const quiz = buildIndividualQuizForGroup("TWICE");
  const hardQuestions = quiz.questionPools.hard;

  assert.ok(
    hardQuestions.some((question) => question.templateFamily === "release-story-clue"),
  );
  assert.ok(
    hardQuestions.some((question) => question.templateFamily === "member-credit-era-clue"),
  );
  assert.ok(
    hardQuestions.some((question) => question.prompt.includes("Blame It on Me") || question.prompt.includes("Trouble")),
  );
});

test("mixed individual quiz run actually blends difficulties instead of staying in one tier", () => {
  const quiz = buildIndividualQuizForGroup("LE SSERAFIM");
  const mixedDifficulties = new Set(quiz.mixedQuestionPool.map((question) => question.difficulty));

  assert.ok(mixedDifficulties.has("easy"));
  assert.ok(mixedDifficulties.has("medium"));
  assert.ok(mixedDifficulties.has("hard"));
});

test("individual group quiz uses fuller answer pools so the correct option does not stand out", () => {
  const quiz = buildIndividualQuizForGroup("TWICE");
  const averageChoiceCount =
    quiz.mixedQuestionPool.reduce((sum, question) => sum + question.choices.length, 0) /
    quiz.mixedQuestionPool.length;

  assert.ok(averageChoiceCount >= 5.5);
  assert.ok(
    quiz.mixedQuestionPool.filter((question) => question.choices.length >= 6).length >=
      Math.floor(quiz.mixedQuestionPool.length * 0.75),
  );
});

test("individual group quiz favors deeper fandom and member content over surface song matching", () => {
  const quiz = buildIndividualQuizForGroup("NewJeans");
  const categoryCounts = quiz.mixedQuestionPool.reduce((accumulator, question) => {
    accumulator[question.category] = (accumulator[question.category] ?? 0) + 1;
    return accumulator;
  }, {});

  const deeperContentCount =
    (categoryCounts["fandom-knowledge"] ?? 0) +
    (categoryCounts["variety-iconic-moments"] ?? 0) +
    (categoryCounts["members"] ?? 0) +
    (categoryCounts["clue-based"] ?? 0) +
    (categoryCounts["true-vs-false"] ?? 0);
  const surfaceSongCount =
    (categoryCounts["discography"] ?? 0) +
    (categoryCounts["match-based"] ?? 0) +
    (categoryCounts["title-tracks"] ?? 0) +
    (categoryCounts["album-covers"] ?? 0) +
    (categoryCounts["lyrics"] ?? 0);

  assert.ok(deeperContentCount > surfaceSongCount);
});
