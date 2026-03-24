import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedContent from "./AnimatedContent";
import Counter from "./Counter";
import GameSetupModal from "./GameSetupModal";
import StaggeredMenu from "./StaggeredMenu";
import { mainQuizRounds } from "../data/mainQuizRounds";
import { createEmptyScores, normalizeScores } from "../data/scoreModel";

function playerCanScore(player, hostGetsScore, hostId) {
  if (player.id !== hostId) return true;
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
  scoreKey,
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
  const [isAnswerTestMode, setIsAnswerTestMode] = useState(false);
  const [answerOverrides, setAnswerOverrides] = useState({});
  const [photoViewerIndex, setPhotoViewerIndex] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageCarouselPaused, setIsImageCarouselPaused] = useState(false);
  const [scoreRefreshTick, setScoreRefreshTick] = useState(0);
  const longPressRef = useRef({ timer: null, triggered: false });
  const imageDragRef = useRef({ startX: 0, active: false });
  const audioContextRef = useRef(null);
  const popResetTimerRef = useRef(null);

  const currentRound = mainQuizRounds[currentRoundIndex];
  const currentSteps = useMemo(() => buildRoundSteps(currentRound), [currentRound]);
  const currentStep = currentSteps[currentStepIndex];
  const resolvedAnswer = answerOverrides[currentStep.id] ?? currentStep.answer;
  const displayPlayers = useMemo(() => [hostProfile, ...players], [hostProfile, players]);
  const eligiblePlayers = useMemo(
    () => displayPlayers.filter((player) => playerCanScore(player, hostGetsScore, hostProfile.id)),
    [displayPlayers, hostGetsScore, hostProfile.id],
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
  const galleryImages = useMemo(() => {
    if (usesAlbumCover) {
      return [
        {
          src: currentStep.coverImage,
          alt: `${currentRound.groupName} ${resolvedAnswer} cover art`,
        },
      ];
    }

    return currentRound.members.map((member) => ({
      src: member.image,
      alt: `${member.name} from ${currentRound.groupName}`,
      name: member.name,
    }));
  }, [currentRound, currentStep.coverImage, currentRound.groupName, resolvedAnswer, usesAlbumCover]);
  const usesImageCarousel = usesGroupCollage && galleryImages.length > 1;
  const activeGalleryImage =
    photoViewerIndex !== null ? galleryImages[photoViewerIndex] ?? null : null;

  useEffect(() => {
    setActiveImageIndex(0);
    setIsImageCarouselPaused(false);
  }, [currentRound.id, currentStep.id]);

  useEffect(() => {
    if (!usesImageCarousel || isImageCarouselPaused || galleryImages.length <= 1) return undefined;

    const timer = window.setTimeout(() => {
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % galleryImages.length);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [galleryImages.length, isImageCarouselPaused, usesImageCarousel, activeImageIndex]);

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
    if (isAnswerTestMode) return;

    longPressRef.current.triggered = false;
    setHoldingOption(option);
    longPressRef.current.timer = window.setTimeout(() => {
      lockGuessForPreview(option);
      longPressRef.current.triggered = true;
      setHoldingOption(null);
    }, 450);
  }

  function handleChoicePointerUp() {
    if (isAnswerTestMode) return;

    if (longPressRef.current.timer) {
      window.clearTimeout(longPressRef.current.timer);
      longPressRef.current.timer = null;
    }
    setHoldingOption(null);
  }

  function handleChoiceClick(option) {
    if (isAnswerTestMode) {
      assignTestAnswer(option);
      return;
    }

    if (longPressRef.current.triggered) {
      longPressRef.current.triggered = false;
      return;
    }

    cyclePreviewPlayer(option);
  }

  function openPhotoViewer(index) {
    setPhotoViewerIndex(index);
  }

  function closePhotoViewer() {
    setPhotoViewerIndex(null);
  }

  function showPreviousPhoto() {
    if (photoViewerIndex === null || galleryImages.length <= 1) return;
    setPhotoViewerIndex((currentIndex) =>
      currentIndex === null ? 0 : (currentIndex - 1 + galleryImages.length) % galleryImages.length,
    );
  }

  function showNextPhoto() {
    if (photoViewerIndex === null || galleryImages.length <= 1) return;
    setPhotoViewerIndex((currentIndex) =>
      currentIndex === null ? 0 : (currentIndex + 1) % galleryImages.length,
    );
  }

  function showPreviousCarouselImage() {
    if (!galleryImages.length) return;
    setActiveImageIndex((currentIndex) => (currentIndex - 1 + galleryImages.length) % galleryImages.length);
  }

  function showNextCarouselImage() {
    if (!galleryImages.length) return;
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % galleryImages.length);
  }

  function handleImageCarouselWheel(event) {
    if (!usesImageCarousel) return;
    event.preventDefault();
    event.stopPropagation();
    setIsImageCarouselPaused(true);
    if (event.deltaY > 0 || event.deltaX > 0) {
      showNextCarouselImage();
    } else {
      showPreviousCarouselImage();
    }
  }

  function handleImageCarouselPointerDown(event) {
    if (!usesImageCarousel) return;
    imageDragRef.current = { startX: event.clientX, active: true };
    setIsImageCarouselPaused(true);
  }

  function handleImageCarouselPointerMove(event) {
    if (!usesImageCarousel || !imageDragRef.current.active) return;
    const deltaX = event.clientX - imageDragRef.current.startX;

    if (Math.abs(deltaX) < 40) return;

    imageDragRef.current.active = false;
    if (deltaX < 0) {
      showNextCarouselImage();
    } else {
      showPreviousCarouselImage();
    }
  }

  function handleImageCarouselPointerUp() {
    imageDragRef.current.active = false;
  }

  function assignTestAnswer(option) {
    setAnswerOverrides((currentOverrides) => ({
      ...currentOverrides,
      [currentStep.id]: option,
    }));
    playCelebrateSound();
    setRevealAnswers(false);
    setIsResultsOpen(false);
    setIsSampleOpen(false);
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
      const context = getAudioContext();
      if (!context) return;
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

  function getAudioContext() {
    if (!audioContextRef.current) {
      const ContextClass = window.AudioContext || window.webkitAudioContext;
      if (!ContextClass) return null;
      audioContextRef.current = new ContextClass();
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }

    return audioContextRef.current;
  }

  function playCelebrateSound() {
    try {
      const context = getAudioContext();
      if (!context) return;

      const now = context.currentTime;
      const frequencies = [523.25, 659.25, 783.99];

      frequencies.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(frequency, now + index * 0.03);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.08, now + 0.18 + index * 0.03);

        gain.gain.setValueAtTime(0.0001, now + index * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.09, now + 0.04 + index * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28 + index * 0.03);

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(now + index * 0.03);
        oscillator.stop(now + 0.3 + index * 0.03);
      });
    } catch {
      // Ignore audio errors so the UI keeps working even if autoplay is blocked.
    }
  }

  function playIncorrectBuzzer() {
    try {
      const context = getAudioContext();
      if (!context) return;

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(220, now);
      oscillator.frequency.exponentialRampToValueAtTime(140, now + 0.24);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(now);
      oscillator.stop(now + 0.28);
    } catch {
      // Ignore audio errors so the UI keeps working even if autoplay is blocked.
    }
  }

  function isAwarded(stepId, playerId) {
    return Boolean(awardedPoints[stepId]?.[playerId]);
  }

  function updateScoreForPlayer(playerId, amount) {
    if (playerId === hostProfile.id) {
      setHostProfile((currentHost) => ({
        ...currentHost,
        scores: {
          ...normalizeScores(currentHost.scores),
          [scoreKey]: (normalizeScores(currentHost.scores)[scoreKey] ?? 0) + amount,
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
                ...normalizeScores(player.scores),
                [scoreKey]: (normalizeScores(player.scores)[scoreKey] ?? 0) + amount,
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
        (player) => getAssignedOption(player.id) === resolvedAnswer,
      )
      .map((player) => player.id);

    if (!correctPlayerIds.length) return [];

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

    return correctPlayerIds;
  }

  function revealCurrentAnswer() {
    const correctPlayerIds = autoAwardCorrectGuesses();
    if (correctPlayerIds.length) {
      playCelebrateSound();
    } else if (eligiblePlayers.length) {
      playIncorrectBuzzer();
    }
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
        ...normalizeScores(currentHost.scores),
        [scoreKey]: 0,
      },
    }));
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        scores: {
          ...normalizeScores(player.scores),
          [scoreKey]: 0,
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
        ...normalizeScores(currentHost.scores),
        [scoreKey]: 0,
      },
    }));
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        scores: {
          ...normalizeScores(player.scores),
          [scoreKey]: 0,
        },
      })),
    );
    setScoreRefreshTick((value) => value + 1);
  }

  const menuActions = [
    { label: "Back Home", onClick: onBackHome },
    { label: "Reset Quiz", onClick: resetQuiz },
    { label: "Game Setup", onClick: () => setIsSetupOpen(true) },
    {
      label: isAnswerTestMode ? "Exit Test Mode" : "Test Answers",
      onClick: () => setIsAnswerTestMode((currentValue) => !currentValue),
    },
  ];

  const menuNavigation = [
    { label: "Top", ariaLabel: "Jump to the top of the gameshow", link: "#gameshow-top" },
    { label: "Scores", ariaLabel: "Jump to live scores", link: "#gameshow-scores" },
    { label: "Round", ariaLabel: "Jump to current round details", link: "#gameshow-round" },
    { label: "Choices", ariaLabel: "Jump to answer choices", link: "#gameshow-choices" },
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
        scores: createEmptyScores(),
      }));
      setPlayers((currentPlayers) => [
        ...currentPlayers.map((player) => ({ ...player, scores: createEmptyScores() })),
        ...extras,
      ]);
      setHostProfile((currentHost) => ({
        ...currentHost,
        scores: createEmptyScores(),
      }));
      return;
    }

    if (safeCount < players.length) {
      const remainingPlayers = players.slice(0, safeCount);
      setPlayers(remainingPlayers.map((player) => ({ ...player, scores: createEmptyScores() })));
      setHostProfile((currentHost) => ({
        ...currentHost,
        scores: createEmptyScores(),
      }));
    }
  }

  return (
    <div className="page-shell game-show-shell" id="gameshow-top">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <StaggeredMenu
        position="right"
        items={menuActions}
        socialItems={menuNavigation}
        itemSectionLabel="Main options"
        socialSectionLabel="Navigation"
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
                  const canScore = playerCanScore(player, hostGetsScore, hostProfile.id);
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
                          {player.id === hostProfile.id && !hostGetsScore
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
                  <h2>{resolvedAnswer}</h2>
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
                  title={`${resolvedAnswer} sample`}
                />
              </div>
            </section>
          </div>
        ) : null}

        {activeGalleryImage ? (
          <div className="modal-overlay results-overlay" onClick={closePhotoViewer}>
            <section
              className="setup-modal photo-viewer-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="setup-header">
                <div>
                  <p className="panel-label">Photo viewer</p>
                  <h2>{currentRound.groupName}</h2>
                </div>
                <button className="ghost-button" onClick={closePhotoViewer} type="button">
                  Close
                </button>
              </div>

              <div className="photo-viewer-shell">
                {galleryImages.length > 1 ? (
                  <button
                    aria-label="Previous photo"
                    className="ghost-button photo-viewer-arrow"
                    onClick={showPreviousPhoto}
                    type="button"
                  >
                    &lt;
                  </button>
                ) : null}

                <div className="photo-viewer-stage">
                  <img
                    alt={activeGalleryImage.alt}
                    className="photo-viewer-image"
                    src={activeGalleryImage.src}
                  />
                </div>

                {galleryImages.length > 1 ? (
                  <button
                    aria-label="Next photo"
                    className="ghost-button photo-viewer-arrow"
                    onClick={showNextPhoto}
                    type="button"
                  >
                    &gt;
                  </button>
                ) : null}
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
              delay={0.05}
            >
              <section className="score-strip-panel score-strip-panel-wide" id="gameshow-scores">
                <div className="score-strip-header">
                  <div>
                    <p className="panel-label">Live scores</p>
                    <div className="score-strip-title-row">
                      <h2>Current game</h2>
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
                    const isHost = player.id === hostProfile.id;
                    const isScoring = playerCanScore(player, hostGetsScore, hostProfile.id);

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
                            value={normalizeScores(player.scores)[scoreKey] ?? 0}
                          />
                        </div>
                      </div>
                    );
                  })}
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
              delay={0.08}
            >
              <section className="round-card" id="gameshow-round">
                <section className="round-game-section">
                  <div className="round-overview">
                  <div className="round-visual-column">
                    <div className="member-image-wrap">
                      <div className="image-question-bar">
                        <div className="image-question-copy">
                          <p className="flow-section-label">Group {currentRoundIndex + 1}</p>
                          <h2>{currentStep.label}</h2>
                        </div>
                      </div>
                      {usesGroupCollage ? (
                        <div
                          className="image-carousel-shell"
                          onMouseEnter={() => setIsImageCarouselPaused(true)}
                          onMouseLeave={() => setIsImageCarouselPaused(false)}
                          onPointerDown={handleImageCarouselPointerDown}
                          onPointerMove={handleImageCarouselPointerMove}
                          onPointerUp={handleImageCarouselPointerUp}
                          onPointerLeave={handleImageCarouselPointerUp}
                          onWheelCapture={handleImageCarouselWheel}
                          onWheel={handleImageCarouselWheel}
                        >
                          <div className="image-carousel-track">
                            {galleryImages.map((image, index) => {
                              const offset = index - activeImageIndex;
                              const isActive = index === activeImageIndex;

                              return (
                                <button
                                  className={`image-carousel-card ${isActive ? "is-active" : ""}`}
                                  key={image.src}
                                  onClick={() => openPhotoViewer(index)}
                                  style={{
                                    transform: `translate(calc(-50% + ${offset * 92}%), -50%) scale(${isActive ? 1 : 0.82})`,
                                    zIndex: galleryImages.length - Math.abs(offset),
                                    opacity: Math.abs(offset) > 1 ? 0 : 1,
                                    pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
                                  }}
                                  type="button"
                                >
                                  <img
                                    alt={image.alt}
                                    className="image-carousel-image"
                                    src={image.src}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : usesAlbumCover ? (
                        <button
                          className="member-image-stage image-viewer-trigger"
                          onClick={() => openPhotoViewer(0)}
                          type="button"
                        >
                          <img
                            alt={`${currentRound.groupName} ${resolvedAnswer} cover art`}
                            className="album-cover-image"
                            src={currentStep.coverImage}
                          />
                        </button>
                      ) : (
                        <button
                          className="member-image-stage image-viewer-trigger"
                          onClick={() =>
                            openPhotoViewer(
                              Math.max(
                                0,
                                currentRound.members.findIndex((member) => member.name === currentStep.answer),
                              ),
                            )
                          }
                          type="button"
                        >
                          <img
                            alt={`${resolvedAnswer} from ${currentRound.groupName}`}
                            className="member-image"
                            src={currentStep.image}
                          />
                        </button>
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
                    <div className="round-meta-top">
                      <p className="flow-section-label">Multiple Choice</p>
                      <div className="round-controls">
                        <div className="round-nav-pill">
                          <span className="round-nav-label">Group</span>
                          <button
                            aria-label="Previous group"
                            className="ghost-button round-nav-arrow"
                            disabled={currentRoundIndex === 0}
                            onClick={goToPreviousGroup}
                            type="button"
                          >
                            &lt;
                          </button>
                          <button
                            aria-label="Next group"
                            className="ghost-button round-nav-arrow"
                            disabled={currentRoundIndex === mainQuizRounds.length - 1}
                            onClick={goToNextGroup}
                            type="button"
                          >
                            &gt;
                          </button>
                        </div>
                        <div className="round-nav-pill">
                          <span className="round-nav-label">Question</span>
                          <button
                            aria-label="Previous question"
                            className="ghost-button round-nav-arrow"
                            disabled={currentRoundIndex === 0 && currentStepIndex === 0}
                            onClick={goToPrevious}
                            type="button"
                          >
                            &lt;
                          </button>
                          <button
                            aria-label="Next question"
                            className="ghost-button round-nav-arrow"
                            disabled={
                              currentRoundIndex === mainQuizRounds.length - 1 &&
                              currentStepIndex === currentSteps.length - 1
                            }
                            onClick={goToNext}
                            type="button"
                          >
                            &gt;
                          </button>
                        </div>
                      </div>
                    </div>
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
                        const isCorrect =
                          (revealAnswers || isAnswerTestMode) && resolvedAnswer === option;
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
