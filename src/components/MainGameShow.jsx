import { useMemo, useRef, useState } from "react";
import AnimatedContent from "./AnimatedContent";
import Counter from "./Counter";
import GameSetupModal from "./GameSetupModal";
import StaggeredMenu from "./StaggeredMenu";
import { mainQuizRounds } from "../data/mainQuizRounds";
import { HOST_ID } from "../App";

function playerCanScore(player, hostGetsScore) {
  if (player.id !== HOST_ID) return true;
  return hostGetsScore;
}

function buildRoundSteps(round) {
  const memberNames = round.members.map((member) => member.name);

  return [
    {
      id: `${round.id}-group`,
      type: "group",
      label: "Guess the group",
      answer: round.groupName,
      choices: round.groupChoices,
      description: "Start each round by recognizing the group from the full member collage.",
    },
    ...round.members.map((member, index) => ({
      id: `${round.id}-member-${index}`,
      type: "member",
      label: `Match member ${index + 1} of ${round.members.length}`,
      answer: member.name,
      choices: memberNames,
      image: member.image,
      description: "Pick the correct member name for the photo shown.",
    })),
    ...round.extras.map((extra) => ({
      id: `${round.id}-${extra.key}`,
      type: "extra",
      key: extra.key,
      label: extra.label,
      answer: extra.answer,
      choices: extra.choices,
      coverImage: extra.coverImage,
      sampleVideoId: extra.sampleVideoId,
      description: "Finish the round with the extra personal questions.",
    })),
  ];
}

export default function MainGameShow({
  players,
  setPlayers,
  hostProfile,
  setHostProfile,
  hostGetsScore,
  setHostGetsScore,
  playerName,
  setPlayerName,
  desiredPlayerCount,
  setDesiredPlayerCount,
  addPlayer,
  removePlayer,
  onBackHome,
}) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [revealAnswers, setRevealAnswers] = useState(false);
  const [guessAssignments, setGuessAssignments] = useState({});
  const [previewAssignments, setPreviewAssignments] = useState({});
  const [awardedPoints, setAwardedPoints] = useState({});
  const [holdingOption, setHoldingOption] = useState(null);
  const [poppingOption, setPoppingOption] = useState(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [scoreRefreshTick, setScoreRefreshTick] = useState(0);
  const longPressRef = useRef({ timer: null, triggered: false });
  const audioContextRef = useRef(null);
  const popResetTimerRef = useRef(null);

  const currentRound = mainQuizRounds[currentRoundIndex];
  const currentSteps = useMemo(() => buildRoundSteps(currentRound), [currentRound]);
  const currentStep = currentSteps[currentStepIndex];
  const displayPlayers = useMemo(() => [hostProfile, ...players], [hostProfile, players]);
  const eligiblePlayers = useMemo(
    () => displayPlayers.filter((player) => playerCanScore(player, hostGetsScore)),
    [displayPlayers, hostGetsScore],
  );
  const usesGroupCollage =
    currentStep.type === "group" ||
    (currentStep.type === "extra" &&
      ["leader", "maknae", "bias"].includes(currentStep.key));
  const usesAlbumCover =
    currentStep.type === "extra" && currentStep.key === "favoriteSong" && currentStep.coverImage;
  const hasSongSample =
    currentStep.type === "extra" &&
    currentStep.key === "favoriteSong" &&
    currentStep.sampleVideoId;

  function getPreviewPlayerId(option) {
    return previewAssignments[currentStep.id]?.[option] ?? null;
  }

  function getAssignedOption(playerId) {
    return guessAssignments[currentStep.id]?.[playerId] ?? null;
  }

  function getPlayersForOption(option) {
    return eligiblePlayers.filter((player) => getAssignedOption(player.id) === option);
  }

  function getAvailablePlayersForOption(option) {
    return eligiblePlayers.filter((player) => {
      const assignedOption = getAssignedOption(player.id);
      return !assignedOption || assignedOption === option;
    });
  }

  function updatePreviewForOption(currentAssignments, option, playerId) {
    const stepAssignments = { ...(currentAssignments[currentStep.id] ?? {}) };

    Object.keys(stepAssignments).forEach((choice) => {
      if (choice !== option && stepAssignments[choice] === playerId) {
        delete stepAssignments[choice];
      }
    });

    stepAssignments[option] = playerId;

    return {
      ...currentAssignments,
      [currentStep.id]: stepAssignments,
    };
  }

  function cyclePreviewPlayer(option) {
    if (!eligiblePlayers.length) return;

    const availablePlayers = getAvailablePlayersForOption(option);
    if (!availablePlayers.length) return;

    const currentPreviewId = getPreviewPlayerId(option);
    const currentIndex = availablePlayers.findIndex((player) => player.id === currentPreviewId);
    const nextPlayer =
      currentIndex === -1
        ? availablePlayers[0]
        : availablePlayers[(currentIndex + 1 + availablePlayers.length) % availablePlayers.length];

    setPreviewAssignments((currentAssignments) => ({
      ...updatePreviewForOption(currentAssignments, option, nextPlayer.id),
    }));

    playPopSound();
    triggerPopAnimation(option);
  }

  function lockGuessForPreview(option) {
    const availablePlayers = getAvailablePlayersForOption(option);
    const previewPlayerId = getPreviewPlayerId(option) ?? availablePlayers[0]?.id ?? null;
    if (!previewPlayerId) return;

    setPreviewAssignments((currentAssignments) =>
      updatePreviewForOption(currentAssignments, option, previewPlayerId),
    );

    setGuessAssignments((currentAssignments) => ({
      ...currentAssignments,
      [currentStep.id]: {
        ...currentAssignments[currentStep.id],
        [previewPlayerId]: option,
      },
    }));
  }

  function handleChoicePointerDown(option) {
    longPressRef.current.triggered = false;
    setHoldingOption(option);
    longPressRef.current.timer = window.setTimeout(() => {
      lockGuessForPreview(option);
      longPressRef.current.triggered = true;
      setHoldingOption(null);
    }, 450);
  }

  function handleChoicePointerUp() {
    if (longPressRef.current.timer) {
      window.clearTimeout(longPressRef.current.timer);
      longPressRef.current.timer = null;
    }
    setHoldingOption(null);
  }

  function handleChoiceClick(option) {
    if (longPressRef.current.triggered) {
      longPressRef.current.triggered = false;
      return;
    }

    cyclePreviewPlayer(option);
  }

  function triggerPopAnimation(option) {
    setPoppingOption(option);

    if (popResetTimerRef.current) {
      window.clearTimeout(popResetTimerRef.current);
    }

    popResetTimerRef.current = window.setTimeout(() => {
      setPoppingOption(null);
      popResetTimerRef.current = null;
    }, 220);
  }

  function playPopSound() {
    try {
      if (!audioContextRef.current) {
        const ContextClass = window.AudioContext || window.webkitAudioContext;
        if (!ContextClass) return;
        audioContextRef.current = new ContextClass();
      }

      const context = audioContextRef.current;
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(520, now);
      oscillator.frequency.exponentialRampToValueAtTime(760, now + 0.05);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(now);
      oscillator.stop(now + 0.11);
    } catch {
      // Ignore audio errors so the UI keeps working even if autoplay is blocked.
    }
  }

  function isAwarded(stepId, playerId) {
    return Boolean(awardedPoints[stepId]?.[playerId]);
  }

  function updateScoreForPlayer(playerId, amount) {
    if (playerId === HOST_ID) {
      setHostProfile((currentHost) => ({
        ...currentHost,
        scores: {
          ...currentHost.scores,
          mainShow: currentHost.scores.mainShow + amount,
        },
      }));
      return;
    }

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === playerId
          ? {
              ...player,
              scores: {
                ...player.scores,
                mainShow: player.scores.mainShow + amount,
              },
            }
          : player,
      ),
    );
  }

  function autoAwardCorrectGuesses() {
    const stepId = currentStep.id;
    const correctPlayerIds = eligiblePlayers
      .filter(
        (player) => getAssignedOption(player.id) === currentStep.answer,
      )
      .map((player) => player.id);

    if (!correctPlayerIds.length) return;

    setAwardedPoints((currentAwards) => {
      const currentStepAwards = currentAwards[stepId] ?? {};
      const playerIdsToAdd = correctPlayerIds.filter((playerId) => !currentStepAwards[playerId]);

      if (!playerIdsToAdd.length) {
        return currentAwards;
      }

      playerIdsToAdd.forEach((playerId) => updateScoreForPlayer(playerId, 1));

      return {
        ...currentAwards,
        [stepId]: {
          ...currentStepAwards,
          ...Object.fromEntries(playerIdsToAdd.map((playerId) => [playerId, true])),
        },
      };
    });
  }

  function revealCurrentAnswer() {
    autoAwardCorrectGuesses();
    setRevealAnswers(true);
  }

  function openResults() {
    setIsResultsOpen(true);
  }

  function hideRevealResults() {
    setRevealAnswers(false);
    setIsResultsOpen(false);
  }

  function togglePoint(playerId) {
    if (!revealAnswers) return;

    setAwardedPoints((currentAwards) => {
      const wasAwarded = Boolean(currentAwards[currentStep.id]?.[playerId]);
      const nextValue = !wasAwarded;

      updateScoreForPlayer(playerId, nextValue ? 1 : -1);

      return {
        ...currentAwards,
        [currentStep.id]: {
          ...currentAwards[currentStep.id],
          [playerId]: nextValue,
        },
      };
    });
  }

  function goToRound(index) {
    setCurrentRoundIndex(index);
    setCurrentStepIndex(0);
    setRevealAnswers(false);
    setIsResultsOpen(false);
    setIsSampleOpen(false);
  }

  function goToPrevious() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((index) => index - 1);
      setRevealAnswers(false);
      setIsResultsOpen(false);
      setIsSampleOpen(false);
      return;
    }

    if (currentRoundIndex > 0) {
      const previousRoundIndex = currentRoundIndex - 1;
      const previousRoundSteps = buildRoundSteps(mainQuizRounds[previousRoundIndex]);
      setCurrentRoundIndex(previousRoundIndex);
      setCurrentStepIndex(previousRoundSteps.length - 1);
      setRevealAnswers(false);
      setIsResultsOpen(false);
      setIsSampleOpen(false);
    }
  }

  function goToNext() {
    if (currentStepIndex < currentSteps.length - 1) {
      setCurrentStepIndex((index) => index + 1);
      setRevealAnswers(false);
      setIsResultsOpen(false);
      setIsSampleOpen(false);
      return;
    }

    if (currentRoundIndex < mainQuizRounds.length - 1) {
      setCurrentRoundIndex((index) => index + 1);
      setCurrentStepIndex(0);
      setRevealAnswers(false);
      setIsResultsOpen(false);
      setIsSampleOpen(false);
    }
  }

  function goToPreviousGroup() {
    if (currentRoundIndex === 0) return;
    goToRound(currentRoundIndex - 1);
  }

  function goToNextGroup() {
    if (currentRoundIndex === mainQuizRounds.length - 1) return;
    goToRound(currentRoundIndex + 1);
  }

  function resetScores() {
    setHostProfile((currentHost) => ({
      ...currentHost,
      scores: {
        ...currentHost.scores,
        mainShow: 0,
      },
    }));
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        scores: {
          ...player.scores,
          mainShow: 0,
        },
      })),
    );

    setAwardedPoints({});
    setScoreRefreshTick((value) => value + 1);
  }

  function resetQuiz() {
    setCurrentRoundIndex(0);
    setCurrentStepIndex(0);
    setRevealAnswers(false);
    setGuessAssignments({});
    setPreviewAssignments({});
    setAwardedPoints({});
    setHoldingOption(null);
    setPoppingOption(null);
    setIsResultsOpen(false);
    setIsSampleOpen(false);
    setHostProfile((currentHost) => ({
      ...currentHost,
      scores: {
        ...currentHost.scores,
        mainShow: 0,
      },
    }));
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        scores: {
          ...player.scores,
          mainShow: 0,
        },
      })),
    );
    setScoreRefreshTick((value) => value + 1);
  }

  const menuItems = [
    { label: "Top", ariaLabel: "Jump to the top of the gameshow", link: "#gameshow-top" },
    { label: "Scores", ariaLabel: "Jump to live scores", link: "#gameshow-scores" },
    { label: "Round", ariaLabel: "Jump to current round details", link: "#gameshow-round" },
    { label: "Choices", ariaLabel: "Jump to answer choices", link: "#gameshow-choices" },
  ];

  const menuActions = [
    { label: "Back Home", onClick: onBackHome },
    { label: "Reset Quiz", onClick: resetQuiz },
    { label: "Game Setup", onClick: () => setIsSetupOpen(true) },
  ];

  function changeDesiredPlayerCount(nextValue) {
    const parsedValue = Number(nextValue);
    if (!Number.isFinite(parsedValue)) {
      setDesiredPlayerCount(nextValue);
      return;
    }

    const safeCount = Math.max(1, Math.min(12, parsedValue));
    setDesiredPlayerCount(safeCount);

    if (safeCount > players.length) {
      const extras = Array.from({ length: safeCount - players.length }, (_, index) => ({
        id: Date.now() + index,
        name: `Player ${players.length + index + 1}`,
        scores: { mainShow: 0 },
      }));
      setPlayers((currentPlayers) => [...currentPlayers, ...extras]);
      return;
    }

    if (safeCount < players.length) {
      const remainingPlayers = players.slice(0, safeCount);
      setPlayers(remainingPlayers);
    }
  }

  return (
    <div className="page-shell game-show-shell" id="gameshow-top">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={menuActions}
        displaySocials
        displayItemNumbering
        menuButtonColor="#fff8ef"
        openMenuButtonColor="#fff8ef"
        changeMenuColorOnOpen
        colors={["#ff8d66", "#ff5d8f"]}
        accentColor="#ff5d8f"
      />

      <GameSetupModal
        isOpen={isSetupOpen}
        players={players}
        hostProfile={hostProfile}
        hostGetsScore={hostGetsScore}
        playerName={playerName}
        desiredPlayerCount={desiredPlayerCount}
        onClose={() => setIsSetupOpen(false)}
        onPlayerNameChange={setPlayerName}
        onDesiredPlayerCountChange={changeDesiredPlayerCount}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onHostGetsScoreChange={setHostGetsScore}
      />

      <main className="app-frame game-show-frame">
        {isResultsOpen ? (
          <div className="modal-overlay results-overlay" onClick={() => setIsResultsOpen(false)}>
            <section
              className="setup-modal results-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="setup-header">
                <div>
                  <p className="panel-label">Question results</p>
                  <h2>{currentStep.label}</h2>
                  <p className="setup-help">
                    Look at results to see the current question and answers so everyone
                    can analyze or rethink their answers.
                  </p>
                </div>
                <button
                  className="ghost-button"
                  onClick={() => setIsResultsOpen(false)}
                  type="button"
                >
                  Close
                </button>
              </div>

              <div className="results-player-list">
                {displayPlayers.map((player) => {
                  const canScore = playerCanScore(player, hostGetsScore);
                  const playerGuess = getAssignedOption(player.id);
                  const gotPoint = isAwarded(currentStep.id, player.id);

                  return (
                    <div className="results-player-row" key={player.id}>
                      <div>
                        <strong>
                          {player.icon ? `${player.icon} ` : ""}
                          {player.name}
                        </strong>
                        <p className="inline-score-meta">
                          {player.id === HOST_ID && !hostGetsScore
                            ? "Host scoring disabled"
                            : playerGuess
                              ? `Guess: ${playerGuess}`
                              : "No guess locked"}
                        </p>
                      </div>

                      <div className="results-player-actions">
                        <span className={`results-status ${gotPoint ? "is-correct" : "is-missed"}`}>
                          {gotPoint ? "Got point" : "No point"}
                        </span>
                        <button
                          className={`score-toggle ${gotPoint ? "is-active" : ""}`}
                          disabled={!canScore}
                          onClick={() => togglePoint(player.id)}
                          type="button"
                        >
                          {gotPoint ? "Remove point" : "Give point"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="results-modal-actions">
                <button
                  className="ghost-button"
                  onClick={() => setIsResultsOpen(false)}
                  type="button"
                >
                  Look at results
                </button>
                <button className="primary-button" onClick={goToNext} type="button">
                  Go to next question
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {isSampleOpen && hasSongSample ? (
          <div className="modal-overlay results-overlay" onClick={() => setIsSampleOpen(false)}>
            <section
              className="setup-modal sample-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="setup-header">
                <div>
                  <p className="panel-label">Song sample</p>
                  <h2>{currentStep.answer}</h2>
                  <p className="setup-help">Listen to a short sample before guessing.</p>
                </div>
                <button
                  className="ghost-button"
                  onClick={() => setIsSampleOpen(false)}
                  type="button"
                >
                  Close
                </button>
              </div>

              <div className="sample-video-wrap">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="sample-video"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={`https://www.youtube.com/embed/${currentStep.sampleVideoId}?autoplay=1&start=30&end=50&rel=0`}
                  title={`${currentStep.answer} sample`}
                />
              </div>
            </section>
          </div>
        ) : null}

        <AnimatedContent
          distance={60}
          direction="vertical"
          reverse={false}
          duration={0.7}
          ease="cubic-bezier(0.22, 1, 0.36, 1)"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.1}
          delay={0}
        >
          <section className="game-show-hero">
            <div>
              <p className="eyebrow">Headliner gameshow</p>
              <h1>Are You Smarter Than a K-Popper?</h1>
              <p className="hero-text">
                Each group now plays as a full round: group guess first, every
                member one by one, then the extra personal questions.
              </p>
            </div>
          </section>
        </AnimatedContent>

        <AnimatedContent
          distance={60}
          direction="vertical"
          reverse={false}
          duration={0.75}
          ease="cubic-bezier(0.22, 1, 0.36, 1)"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.1}
          delay={0.05}
        >
          <section className="score-strip-panel" id="gameshow-scores">
            <div className="score-strip-header">
              <div>
                <p className="panel-label">Live scores</p>
                <div className="score-strip-title-row">
                  <h2>Visible while you play</h2>
                  <button
                    aria-label="Refresh score tally"
                    className="score-refresh-button"
                    onClick={() => setScoreRefreshTick((value) => value + 1)}
                    type="button"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path
                        d="M20 12a8 8 0 1 1-2.34-5.66"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M20 4v6h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label="Reset scores"
                    className="score-refresh-button score-reset-button"
                    onClick={resetScores}
                    type="button"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path
                        d="M3 6h18"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 6V4h8v2"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 6l1 14h10l1-14"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="score-strip">
              {displayPlayers.map((player) => {
                const isHost = player.id === HOST_ID;
                const isScoring = playerCanScore(player, hostGetsScore);

                return (
                  <div className={`score-strip-card ${isHost ? "is-host" : ""}`} key={player.id}>
                    <div>
                      <strong>
                        {player.icon ? `${player.icon} ` : ""}
                        {player.name}
                      </strong>
                      <p>
                        {isHost
                          ? hostGetsScore
                            ? "Host and player"
                            : "Host only"
                          : "Player"}
                      </p>
                    </div>
                    <div className={`score-badge ${!isScoring ? "is-muted" : ""}`}>
                      <Counter
                        digitPlaceHolders={false}
                        fontSize={34}
                        gap={2}
                        padding={0}
                        places={[100, 10, 1]}
                        textColor={!isScoring ? "rgba(255, 248, 239, 0.56)" : "#ffd978"}
                        trigger={scoreRefreshTick}
                        value={player.scores.mainShow}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </AnimatedContent>

        <section className="game-show-layout">
          <div className="game-board-column">
            <AnimatedContent
              distance={60}
              direction="vertical"
              reverse={false}
              duration={0.75}
              ease="cubic-bezier(0.22, 1, 0.36, 1)"
              initialOpacity={0}
              animateOpacity
              scale={0.99}
              threshold={0.1}
              delay={0.08}
            >
              <section className="round-card" id="gameshow-round">
                <section className="round-info-section">
                  <div className="question-header-block">
                    <span className="player-count">
                      Group {currentRoundIndex + 1} / {mainQuizRounds.length}
                    </span>
                    <p className="section-kicker">
                      {currentStep.type === "group" ? "????" : currentRound.groupName}
                    </p>
                    <h2>{currentStep.label}</h2>
                    <p className="round-step-copy">
                      Step {currentStepIndex + 1} of {currentSteps.length} in this round
                    </p>
                    <p className="round-step-description">{currentStep.description}</p>
                  </div>
                  <div className="round-controls">
                    <button
                      className="ghost-button"
                      disabled={currentRoundIndex === 0}
                      onClick={goToPreviousGroup}
                      type="button"
                    >
                      Previous group
                    </button>
                    <button
                      className="ghost-button"
                      disabled={currentRoundIndex === mainQuizRounds.length - 1}
                      onClick={goToNextGroup}
                      type="button"
                    >
                      Next group
                    </button>
                    <button
                      className="ghost-button"
                      disabled={currentRoundIndex === 0 && currentStepIndex === 0}
                      onClick={goToPrevious}
                      type="button"
                    >
                      Previous
                    </button>
                    <button
                      className="ghost-button"
                      disabled={
                        currentRoundIndex === mainQuizRounds.length - 1 &&
                        currentStepIndex === currentSteps.length - 1
                      }
                      onClick={goToNext}
                      type="button"
                    >
                      Next
                    </button>
                  </div>
                </section>

                <section className="round-game-section">
                  <div className="round-overview">
                  <div className="round-visual-column">
                    <div className="member-image-wrap">
                      {usesGroupCollage ? (
                        <div className="group-collage">
                          {currentRound.members.map((member) => (
                            <div className="group-collage-tile" key={member.name}>
                              <img
                                alt={`${member.name} from ${currentRound.groupName}`}
                                className="group-collage-image"
                                src={member.image}
                              />
                            </div>
                          ))}
                        </div>
                      ) : usesAlbumCover ? (
                        <div className="member-image-stage">
                          <img
                            alt={`${currentRound.groupName} ${currentStep.answer} cover art`}
                            className="album-cover-image"
                            src={currentStep.coverImage}
                          />
                        </div>
                      ) : (
                        <div className="member-image-stage">
                          <img
                            alt={`${currentStep.answer} from ${currentRound.groupName}`}
                            className="member-image"
                            src={currentStep.image}
                          />
                        </div>
                      )}

                      {hasSongSample ? (
                        <button
                          className="sample-audio-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setIsSampleOpen(true);
                          }}
                          type="button"
                        >
                          Listen to sample
                        </button>
                      ) : null}
                    </div>

                    <div className="image-action-bar">
                      <button
                        className="primary-button"
                        onClick={revealAnswers ? openResults : revealCurrentAnswer}
                        type="button"
                      >
                        {revealAnswers ? "Results" : "Reveal answer"}
                      </button>
                      {revealAnswers ? (
                        <button className="ghost-button" onClick={goToNext} type="button">
                          Next question
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="round-meta-card" id="gameshow-choices">
                    <p className="flow-section-label">Multiple Choice</p>
                    <div
                      className={`round-flow-choices ${
                        currentStep.choices.length % 2 === 0 ? "is-even" : "is-odd"
                      }`}
                    >
                      {currentStep.choices.map((option) => {
                        const previewPlayerId = getPreviewPlayerId(option);
                        const previewPlayer = eligiblePlayers.find(
                          (player) => player.id === previewPlayerId,
                        );
                        const assignedPlayers = getPlayersForOption(option);
                        const isCorrect = revealAnswers && currentStep.answer === option;
                        const shouldShowPreview =
                          previewPlayer &&
                          !assignedPlayers.some((player) => player.id === previewPlayer.id);

                        return (
                          <div className="flow-choice-wrap" key={option}>
                            <button
                              className={`choice-button flow-choice-button ${currentStep.choices.length % 2 !== 0 ? "is-list-view" : ""} ${isCorrect ? "is-correct" : ""} ${holdingOption === option ? "is-holding" : ""} ${poppingOption === option ? "is-popping" : ""}`}
                              onClick={() => handleChoiceClick(option)}
                              onMouseDown={() => handleChoicePointerDown(option)}
                              onMouseLeave={handleChoicePointerUp}
                              onMouseUp={handleChoicePointerUp}
                              type="button"
                            >
                              {(assignedPlayers.length || shouldShowPreview) ? (
                                <span className="flow-choice-tags">
                                  {assignedPlayers.map((player) => (
                                    <span
                                      className="flow-choice-tag is-locked"
                                      key={`${option}-${player.id}`}
                                    >
                                      {player.icon ? `${player.icon} ` : ""}
                                      {player.name}
                                    </span>
                                  ))}
                                  {shouldShowPreview ? (
                                    <span className="flow-choice-tag">
                                      {previewPlayer.icon ? `${previewPlayer.icon} ` : ""}
                                      {previewPlayer.name}
                                    </span>
                                  ) : null}
                                </span>
                              ) : null}
                              <span className="flow-choice-label">{option}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  </div>
                </section>

              </section>
            </AnimatedContent>
          </div>
        </section>
      </main>
    </div>
  );
}
