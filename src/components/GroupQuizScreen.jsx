import { useMemo } from "react";
import MainGameShow from "./MainGameShow";
import { buildIndividualQuizForGroup } from "../lib/individualQuiz/index.js";

export default function GroupQuizScreen({ routedGroup, ...mainGameProps }) {
  const routedGroupQuiz = useMemo(
    () => (routedGroup ? buildIndividualQuizForGroup(routedGroup.label) : null),
    [routedGroup],
  );
  const routedGroupRounds = routedGroupQuiz?.rounds ?? [];

  if (!routedGroup || !routedGroupRounds.length) {
    return null;
  }

  return (
    <MainGameShow
      {...mainGameProps}
      rounds={routedGroupRounds}
      includeGroupGuess={false}
      heroEyebrow="Individual group quiz"
      heroTitle={`${routedGroup.label} Quiz`}
      heroTitleClassName="group-quiz-title"
      heroText={routedGroup.description}
      roundNavTitle="Quiz"
      showRoundNav={false}
      showQuestionNav={false}
    />
  );
}
