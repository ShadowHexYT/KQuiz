import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedContent from "./AnimatedContent";
import Counter from "./Counter";
import GameSetupModal from "./GameSetupModal";
import { mainQuizRounds } from "../data/mainQuizRounds";
import { createEmptyScores, normalizeScores } from "../data/scoreModel";
import { buildGameEntities } from "../data/teamModeHelpers";

const ANSWER_OVERRIDES_STORAGE_KEY = "kpop-quiz-main-answer-overrides-v1";

function getStableHash(value) {
  return Array.from(String(value)).reduce(
    (hash, char) => ((hash * 33) ^ char.charCodeAt(0)) >>> 0,
    5381,
  );
}

function shuffleWithSeed(values, seed) {
  return [...values].sort((left, right) => {
    const leftScore = getStableHash(`${seed}-${left}`);
    const rightScore = getStableHash(`${seed}-${right}`);
    if (leftScore !== rightScore) return leftScore - rightScore;
    return String(left).localeCompare(String(right));
  });
}

function playerCanScore(player, hostGetsScore, hostId) {
  if (player.id !== hostId) return true;
  return hostGetsScore;
}

function getAnswerOverrideStorageKey(round, step) {
  if (!round || !step) return null;

  if (step.type === "member" && step.image) {
    return `member-photo:${step.image}`;
  }

  if (step.type === "group") {
    const collageSources = round.members.map((member) => member.image).filter(Boolean).join("|");
    return `group-collage:${collageSources}`;
  }

  if (step.type === "extra") {
    if (step.image) {
      return `extra-photo:${step.image}`;
    }

    if (step.coverImage) {
      return `extra-cover:${step.key ?? step.label}:${step.coverImage}`;
    }

    const collageSources = round.members.map((member) => member.image).filter(Boolean).join("|");
    return `extra-collage:${step.key ?? step.label}:${collageSources}`;
  }

  return `step-id:${step.id}`;
}

function loadStoredAnswerOverrides() {
  if (typeof window === "undefined") return {};

  try {
    const savedValue = window.localStorage.getItem(ANSWER_OVERRIDES_STORAGE_KEY);
    if (!savedValue) return {};

    const parsedValue = JSON.parse(savedValue);
    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch {
    return {};
  }
}

function buildRoundSteps(round, options = {}) {
  const { includeGroupGuess = true } = options;
  if (round.customSteps?.length) {
    return round.customSteps;
  }

  const memberNames = round.members.map((member) => member.name);

  return [
    ...(includeGroupGuess
      ? [
          {
            id: `${round.id}-group`,
            type: "group",
            label: "Guess the group",
            answer: round.groupName,
            choices: round.groupChoices,
            description: "Start each round by recognizing the group from the full member collage.",
          },
        ]
      : []),
    ...round.members.map((member, index) => ({
      id: `${round.id}-member-${index}`,
      type: "member",
      label: `Match member ${index + 1} of ${round.members.length}`,
      answer: member.name,
      choices: member.choices ?? memberNames,
      image: member.image,
      description: "Pick the correct member name for the photo shown.",
    })),
    ...round.extras.map((extra) => ({
      id: `${round.id}-${extra.key}`,
      type: "extra",
      key: extra.key,
      kind: extra.kind,
      label: extra.label,
      answer: extra.answer,
      answers: extra.answers,
      choices: extra.choices,
      coverImage:
        extra.coverImage ??
        extra.songChoices?.find((song) => song.title === extra.answer)?.coverImage ??
        null,
      songChoices: extra.songChoices,
      description: "Finish the round with the extra personal questions.",
    })),
  ];
}

export default function MainGameShow({
  players,
  setPlayers,
  hostProfile,
  setHostProfile,
  teams,
  teamsEnabled,
  hostGetsScore,
  setHostGetsScore,
  playerName,
  setPlayerName,
  newPlayerIcon,
  setNewPlayerIcon,
  playerIcons,
  desiredPlayerCount,
  setDesiredPlayerCount,
  addPlayer,
  removePlayer,
  scoreKey,
  rounds = mainQuizRounds,
  includeGroupGuess = true,
  heroEyebrow = "Headliner gameshow",
  heroTitle = "Are You Smarter Than a K-Popper?",
  heroText = "Each group now plays as a full round: group guess first, every member one by one, then the extra personal questions.",
  roundNavTitle = "Group",
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
  const [isAnswerTestMode, setIsAnswerTestMode] = useState(false);
  const [answerOverrides, setAnswerOverrides] = useState(() => loadStoredAnswerOverrides());
  const [photoViewerIndex, setPhotoViewerIndex] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageCarouselPaused, setIsImageCarouselPaused] = useState(false);
  const [scoreRefreshTick, setScoreRefreshTick] = useState(0);
  const [choiceShuffleSeed] = useState(() => Date.now());
  const longPressRef = useRef({ timer: null, triggered: false });
  const imageDragRef = useRef({ startX: 0, active: false });
  const audioContextRef = useRef(null);
  const popResetTimerRef = useRef(null);

  const quizRounds = rounds?.length ? rounds : mainQuizRounds;
  const currentRound = quizRounds[currentRoundIndex] ?? quizRounds[0];
  const currentSteps = useMemo(
    () => buildRoundSteps(currentRound, { includeGroupGuess }),
    [currentRound, includeGroupGuess],
  );
  const currentStep = currentSteps[currentStepIndex];
  const currentAnswerOverrideKey = useMemo(
    () => getAnswerOverrideStorageKey(currentRound, currentStep),
    [currentRound, currentStep],
  );
  const currentChoices = useMemo(
    () =>
      shuffleWithSeed(
        currentStep?.choices ?? [],
        `${choiceShuffleSeed}-${currentRound?.id ?? "round"}-${currentStep?.id ?? "step"}`,
      ),
    [choiceShuffleSeed, currentRound?.id, currentStep?.choices, currentStep?.id],
  );
  const resolvedAnswer =
    (currentAnswerOverrideKey ? answerOverrides[currentAnswerOverrideKey] : null) ??
    currentStep.answer;
  const resolvedAnswers = currentStep.answers ?? [resolvedAnswer];
  const displayPlayers = useMemo(
    () =>
      buildGameEntities({
        players,
        hostProfile,
        teams,
        teamsEnabled,
        hostGetsScore,
        scoreKey,
      }),
    [hostGetsScore, hostProfile, players, scoreKey, teams, teamsEnabled],
  );
  const eligiblePlayers = useMemo(
    () => displayPlayers.filter((player) => player.isScoring),
    [displayPlayers],
  );
  const isFavoriteSongStep =
    currentStep.type === "extra" &&
    (currentStep.kind === "favoriteSong" || currentStep.key.startsWith("favoriteSong"));
  const isTextOnlyExtra =
    currentStep.type === "extra" &&
    !currentStep.image &&
    !currentStep.coverImage &&
    (currentStep.songChoices?.length ?? 0) === 0;
  const usesGroupCollage =
    currentStep.type === "group" ||
    (currentStep.type === "extra" &&
      (["leader", "maknae", "bias"].includes(currentStep.key) || isTextOnlyExtra));
  const usesSongChoiceGallery = isFavoriteSongStep && (currentStep.songChoices?.length ?? 0) > 0;
  const usesAlbumCover = !usesSongChoiceGallery && Boolean(currentStep.coverImage);
  const currentRoundLabel = currentRound?.roundLabel ?? `Group ${currentRoundIndex + 1}`;
  const galleryImages = useMemo(() => {
    if (usesSongChoiceGallery) {
      const seenCovers = new Set();

      return currentStep.songChoices
        .filter((song) => {
          if (!song.coverImage || seenCovers.has(song.coverImage)) return false;
          seenCovers.add(song.coverImage);
          return true;
        })
        .map((song) => ({
          src: song.coverImage,
          alt: `${song.title} cover art`,
          name: song.title,
        }));
    }

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
  }, [
    currentRound,
    currentStep.coverImage,
    currentStep.songChoices,
    currentRound.groupName,
    resolvedAnswer,
    usesAlbumCover,
    usesSongChoiceGallery,
  ]);
  const usesImageCarousel = usesGroupCollage && galleryImages.length > 1;
  const wrappedGalleryImages = useMemo(() => {
    if (!usesImageCarousel || galleryImages.length <= 1) {
      return galleryImages.map((image, index) => ({
        ...image,
        index,
        offset: index - activeImageIndex,
      }));
    }

    return galleryImages.map((image, index) => {
      let offset = index - activeImageIndex;

      if (offset > galleryImages.length / 2) {
        offset -= galleryImages.length;
      } else if (offset < -galleryImages.length / 2) {
        offset += galleryImages.length;
      }

      return {
        ...image,
        index,
        offset,
      };
    });
  }, [activeImageIndex, galleryImages, usesImageCarousel]);
  const activeGalleryImage =
    photoViewerIndex !== null ? galleryImages[photoViewerIndex] ?? null : null;
  const activeGalleryOption = activeGalleryImage ? getImageOption(activeGalleryImage) : null;
  const activeGalleryAssignedPlayers = activeGalleryOption
    ? getPlayersForOption(activeGalleryOption)
    : [];

  useEffect(() => {
    setActiveImageIndex(0);
    setIsImageCarouselPaused(false);
  }, [currentRound.id, currentStep.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        ANSWER_OVERRIDES_STORAGE_KEY,
        JSON.stringify(answerOverrides),
      );
    } catch {
      // Ignore storage failures so editing answers still works in-memory.
    }
  }, [answerOverrides]);

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

  function getAssignedOptions(playerId) {
    const assignedValue = guessAssignments[currentStep.id]?.[playerId];

    if (isFavoriteSongStep) {
      return Array.isArray(assignedValue)
        ? assignedValue
        : assignedValue
          ? [assignedValue]
          : [];
    }

    return assignedValue ? [assignedValue] : [];
  }

  function getPlayersForOption(option) {
    return eligiblePlayers.filter((player) => getAssignedOptions(player.id).includes(option));
  }

  function getImageOption(image) {
    if (!image?.name) return null;
    return currentChoices.includes(image.name) ? image.name : null;
  }

  function getAvailablePlayersForOption(option) {
    if (isFavoriteSongStep) {
      return eligiblePlayers;
    }

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
        [previewPlayerId]: isFavoriteSongStep
          ? (() => {
              const currentSelections = currentAssignments[currentStep.id]?.[previewPlayerId];
              const nextSelections = Array.isArray(currentSelections)
                ? currentSelections
                : currentSelections
                  ? [currentSelections]
                  : [];

              return nextSelections.includes(option)
                ? nextSelections.filter((item) => item !== option)
                : [...nextSelections, option];
            })()
          : option,
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

  function lockGuessForPlayer(option, playerId) {
    if (!option || !playerId) return;

    setPreviewAssignments((currentAssignments) =>
      updatePreviewForOption(currentAssignments, option, playerId),
    );

    setGuessAssignments((currentAssignments) => ({
      ...currentAssignments,
      [currentStep.id]: {
        ...currentAssignments[currentStep.id],
        [playerId]: isFavoriteSongStep
          ? (() => {
              const currentSelections = currentAssignments[currentStep.id]?.[playerId];
              const nextSelections = Array.isArray(currentSelections)
                ? currentSelections
                : currentSelections
                  ? [currentSelections]
                  : [];

              return nextSelections.includes(option)
                ? nextSelections.filter((item) => item !== option)
                : [...nextSelections, option];
            })()
          : option,
      },
    }));

    playPopSound();
    triggerPopAnimation(option);
  }

  function openPhotoViewer(index) {
    setActiveImageIndex(index);
    setPhotoViewerIndex(index);
  }

  function closePhotoViewer() {
    setPhotoViewerIndex(null);
  }

  function showPreviousPhoto() {
    if (photoViewerIndex === null || galleryImages.length <= 1) return;
    setPhotoViewerIndex((currentIndex) => {
      const nextIndex =
        currentIndex === null ? 0 : (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setActiveImageIndex(nextIndex);
      return nextIndex;
    });
  }

  function showNextPhoto() {
    if (photoViewerIndex === null || galleryImages.length <= 1) return;
    setPhotoViewerIndex((currentIndex) => {
      const nextIndex = currentIndex === null ? 0 : (currentIndex + 1) % galleryImages.length;
      setActiveImageIndex(nextIndex);
      return nextIndex;
    });
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
    if (!currentAnswerOverrideKey) return;

    setAnswerOverrides((currentOverrides) => ({
      ...currentOverrides,
      [currentAnswerOverrideKey]: option,
    }));
    playCelebrateSound();
    setRevealAnswers(false);
    setIsResultsOpen(false);
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

  function isAwarded(stepId, playerId, optionKey = "__single") {
    return Boolean(awardedPoints[stepId]?.[playerId]?.[optionKey]);
  }

  function getAwardedCount(stepId, playerId) {
    return Object.values(awardedPoints[stepId]?.[playerId] ?? {}).filter(Boolean).length;
  }

  function updateScoreForPlayer(playerId, amount) {
    const scoreTargetId =
      displayPlayers.find((player) => player.id === playerId)?.representativeId ?? playerId;

    if (scoreTargetId === hostProfile.id) {
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
        player.id === scoreTargetId
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
    const awardedHits = [];

    setAwardedPoints((currentAwards) => {
      const currentStepAwards = currentAwards[stepId] ?? {};
      const nextStepAwards = { ...currentStepAwards };

      eligiblePlayers.forEach((player) => {
        const selectedOptions = getAssignedOptions(player.id);
        const correctOptions = isFavoriteSongStep
          ? selectedOptions.filter((option) => resolvedAnswers.includes(option))
          : selectedOptions.filter((option) => option === resolvedAnswer);

        if (!correctOptions.length) return;

        const playerAwards = { ...(nextStepAwards[player.id] ?? {}) };
        const optionKeys = isFavoriteSongStep ? correctOptions : ["__single"];
        let playerEarnedPoint = false;

        optionKeys.forEach((optionKey) => {
          if (playerAwards[optionKey]) return;
          playerAwards[optionKey] = true;
          awardedHits.push({ playerId: player.id, optionKey });
          playerEarnedPoint = true;
        });

        if (playerEarnedPoint) {
          nextStepAwards[player.id] = playerAwards;
        }
      });

      if (!awardedHits.length) {
        return currentAwards;
      }

      awardedHits.forEach(({ playerId }) => updateScoreForPlayer(playerId, 1));

      return {
        ...currentAwards,
        [stepId]: nextStepAwards,
      };
    });

    return awardedHits;
  }

  function revealCurrentAnswer() {
    const correctHits = autoAwardCorrectGuesses();
    if (correctHits.length) {
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
    if (isFavoriteSongStep) return;
    if (!revealAnswers) return;

    setAwardedPoints((currentAwards) => {
      const wasAwarded = Boolean(currentAwards[currentStep.id]?.[playerId]?.__single);
      const nextValue = !wasAwarded;

      updateScoreForPlayer(playerId, nextValue ? 1 : -1);

      return {
        ...currentAwards,
        [currentStep.id]: {
          ...currentAwards[currentStep.id],
          [playerId]: {
            ...(currentAwards[currentStep.id]?.[playerId] ?? {}),
            __single: nextValue,
          },
        },
      };
    });
  }

  function goToRound(index) {
    setCurrentRoundIndex(index);
    setCurrentStepIndex(0);
    setRevealAnswers(false);
    setIsResultsOpen(false);
  }

  function goToPrevious() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((index) => index - 1);
      setRevealAnswers(false);
      setIsResultsOpen(false);
      return;
    }

    if (currentRoundIndex > 0) {
      const previousRoundIndex = currentRoundIndex - 1;
      const previousRoundSteps = buildRoundSteps(quizRounds[previousRoundIndex], {
        includeGroupGuess,
      });
      setCurrentRoundIndex(previousRoundIndex);
      setCurrentStepIndex(previousRoundSteps.length - 1);
      setRevealAnswers(false);
      setIsResultsOpen(false);
    }
  }

  function goToNext() {
    if (currentStepIndex < currentSteps.length - 1) {
      setCurrentStepIndex((index) => index + 1);
      setRevealAnswers(false);
      setIsResultsOpen(false);
      return;
    }

    if (currentRoundIndex < quizRounds.length - 1) {
      setCurrentRoundIndex((index) => index + 1);
      setCurrentStepIndex(0);
      setRevealAnswers(false);
      setIsResultsOpen(false);
    }
  }

  function goToPreviousGroup() {
    if (currentRoundIndex === 0) return;
    goToRound(currentRoundIndex - 1);
  }

  function goToNextGroup() {
    if (currentRoundIndex === quizRounds.length - 1) return;
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
    { label: revealAnswers ? "Hide Results" : "Reveal Answer", onClick: revealAnswers ? hideRevealResults : revealCurrentAnswer },
    { label: "Refresh Scores", onClick: () => setScoreRefreshTick((value) => value + 1) },
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
    { label: "Results", ariaLabel: "Open question results", onClick: openResults },
    { label: "Next Question", ariaLabel: "Go to the next question", onClick: goToNext },
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

      <GameSetupModal
        isOpen={isSetupOpen}
        players={players}
        hostProfile={hostProfile}
        hostGetsScore={hostGetsScore}
        playerName={playerName}
        newPlayerIcon={newPlayerIcon}
        playerIcons={playerIcons}
        desiredPlayerCount={desiredPlayerCount}
        onClose={() => setIsSetupOpen(false)}
        onPlayerNameChange={setPlayerName}
        onNewPlayerIconChange={setNewPlayerIcon}
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
                  const canScore = player.isScoring;
                  const playerGuess = isFavoriteSongStep
                    ? getAssignedOptions(player.id)
                    : getAssignedOption(player.id);
                  const gotPoint = isFavoriteSongStep
                    ? getAwardedCount(currentStep.id, player.id) > 0
                    : isAwarded(currentStep.id, player.id);
                  const awardedCount = getAwardedCount(currentStep.id, player.id);

                  return (
                    <div className="results-player-row" key={player.id}>
                      <div>
                        <strong>
                          {player.icon ? `${player.icon} ` : ""}
                          {player.name}
                        </strong>
                        <p className="inline-score-meta">
                          {!player.isScoring
                            ? "Scoring disabled"
                            : player.kind === "team"
                              ? `Team members: ${player.memberNames.join(", ")}`
                              : player.id === hostProfile.id && !hostGetsScore
                                ? "Host scoring disabled"
                                : isFavoriteSongStep && Array.isArray(playerGuess) && playerGuess.length
                                  ? `Locked songs: ${playerGuess.join(", ")}`
                                  : playerGuess
                                    ? `Guess: ${playerGuess}`
                                    : "No guess locked"}
                        </p>
                      </div>

                      <div className="results-player-actions">
                        <span className={`results-status ${gotPoint ? "is-correct" : "is-missed"}`}>
                          {isFavoriteSongStep
                            ? gotPoint
                              ? `${awardedCount} point${awardedCount === 1 ? "" : "s"}`
                              : "No points"
                            : gotPoint
                              ? "Got point"
                              : "No point"}
                        </span>
                        {!isFavoriteSongStep ? (
                          <button
                            className={`score-toggle ${gotPoint ? "is-active" : ""}`}
                            disabled={!canScore}
                            onClick={() => togglePoint(player.id)}
                            type="button"
                          >
                            {gotPoint ? "Remove point" : "Give point"}
                          </button>
                        ) : null}
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

        {activeGalleryImage ? (
          <div className="modal-overlay results-overlay" onClick={closePhotoViewer}>
            <section
              className="setup-modal photo-viewer-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="setup-header">
                <div>
                  <p className="panel-label">Photo viewer</p>
                  {activeGalleryOption ? <h2>{activeGalleryOption}</h2> : null}
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

              {activeGalleryOption ? (
                <div className="photo-viewer-actions">
                  <div className="photo-viewer-actions-copy">
                    <p className="setup-help">
                      Choose a player below to lock in this photo as their answer.
                    </p>
                    {activeGalleryAssignedPlayers.length ? (
                      <p className="photo-viewer-status">
                        Locked by {activeGalleryAssignedPlayers.map((player) => player.name).join(", ")}
                      </p>
                    ) : (
                      <p className="photo-viewer-status">No one has locked this photo yet.</p>
                    )}
                  </div>
                  <div className="photo-viewer-player-grid">
                    {eligiblePlayers.map((player) => {
                      const isLockedToPhoto = activeGalleryAssignedPlayers.some(
                        (assignedPlayer) => assignedPlayer.id === player.id,
                      );
                      const currentPlayerOption = getAssignedOption(player.id);
                      const isLockedElsewhere =
                        !isFavoriteSongStep &&
                        currentPlayerOption &&
                        currentPlayerOption !== activeGalleryOption;

                      return (
                        <button
                          className={`choice-button photo-viewer-player-button ${isLockedToPhoto ? "is-active" : ""}`}
                          key={`photo-lock-${player.id}`}
                          onClick={() => lockGuessForPlayer(activeGalleryOption, player.id)}
                          type="button"
                        >
                          <strong>{player.icon ? `${player.icon} ` : ""}{player.name}</strong>
                          <span>
                            {isLockedToPhoto
                              ? "Locked on this photo"
                              : isLockedElsewhere
                                ? `Move from ${currentPlayerOption}`
                                : "Lock this answer"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
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
              <p className="eyebrow">{heroEyebrow}</p>
              <h1>{heroTitle}</h1>
              <p className="hero-text">{heroText}</p>
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
                    const isHost = !teamsEnabled && player.id === hostProfile.id;
                    const isScoring = player.isScoring;

                    return (
                      <div className={`score-strip-card ${isHost ? "is-host" : ""}`} key={player.id}>
                        <div>
                          <strong>
                            {player.icon ? `${player.icon} ` : ""}
                            {player.name}
                          </strong>
                          <p>
                            {player.kind === "team"
                              ? player.memberNames.join(", ")
                              : isHost
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
                            value={player.scoreTotal ?? 0}
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
                          <p className="flow-section-label">{currentRoundLabel}</p>
                          <h2>{currentStep.label}</h2>
                          {usesGroupCollage && galleryImages.some((image) => getImageOption(image)) ? (
                            <p className="image-selection-help">
                              Open a photo, then use the player buttons in the viewer to lock it in.
                            </p>
                          ) : null}
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
                            {wrappedGalleryImages.map((image) => {
                              const isActive = image.index === activeImageIndex;
                              const option = getImageOption(image);
                              const assignedPlayers = option ? getPlayersForOption(option) : [];
                              const isCorrect =
                                option &&
                                (revealAnswers || isAnswerTestMode) &&
                                (isFavoriteSongStep
                                  ? resolvedAnswers.includes(option)
                                  : resolvedAnswer === option);

                              return (
                                <button
                                  aria-pressed={option ? assignedPlayers.length > 0 : undefined}
                                  className={`image-carousel-card ${isActive ? "is-active" : ""} ${option ? "is-selectable" : ""} ${isCorrect ? "is-correct" : ""}`}
                                  key={image.src}
                                  onClick={() => openPhotoViewer(image.index)}
                                  style={{
                                    transform: `translate(calc(-50% + ${image.offset * 92}%), -50%) scale(${isActive ? 1 : 0.82})`,
                                    zIndex: galleryImages.length - Math.abs(image.offset),
                                    opacity: Math.abs(image.offset) > 1 ? 0 : 1,
                                    pointerEvents: Math.abs(image.offset) > 1 ? "none" : "auto",
                                  }}
                                  type="button"
                                >
                                  <img
                                    alt={image.alt}
                                    className="image-carousel-image"
                                    src={image.src}
                                  />
                                  {option ? (
                                    <span className="image-carousel-copy">
                                      {assignedPlayers.length ? (
                                        <span className="image-carousel-tags">
                                          {assignedPlayers.map((player) => (
                                            <span
                                              className="flow-choice-tag is-locked"
                                              key={`${option}-${player.id}-photo`}
                                            >
                                              {player.icon ? `${player.icon} ` : ""}
                                              {player.name}
                                            </span>
                                          ))}
                                        </span>
                                      ) : null}
                                      <span className="image-carousel-caption">
                                        {option}
                                      </span>
                                    </span>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : usesSongChoiceGallery ? (
                        <div className="song-cover-collage">
                          {galleryImages.map((image, index) => (
                            <button
                              className="song-cover-card image-viewer-trigger"
                              key={image.src}
                              onClick={() => openPhotoViewer(index)}
                              type="button"
                            >
                              <img
                                alt={image.alt}
                                className="song-cover-image"
                                src={image.src}
                              />
                            </button>
                          ))}
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

                    </div>

                    <div className="image-action-bar">
                      {usesGroupCollage ? (
                        <button
                          className="ghost-button"
                          onClick={() => openPhotoViewer(activeImageIndex)}
                          type="button"
                        >
                          View photo
                        </button>
                      ) : null}
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
                          <span className="round-nav-label">{roundNavTitle}</span>
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
                            disabled={currentRoundIndex === quizRounds.length - 1}
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
                              currentRoundIndex === quizRounds.length - 1 &&
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
                        currentChoices.length % 2 === 0 ? "is-even" : "is-odd"
                      }`}
                    >
                      {currentChoices.map((option) => {
                        const previewPlayerId = getPreviewPlayerId(option);
                        const previewPlayer = eligiblePlayers.find(
                          (player) => player.id === previewPlayerId,
                        );
                        const songChoice = currentStep.songChoices?.find((song) => song.title === option);
                        const assignedPlayers = getPlayersForOption(option);
                        const isCorrect =
                          (revealAnswers || isAnswerTestMode) &&
                          (isFavoriteSongStep ? resolvedAnswers.includes(option) : resolvedAnswer === option);
                        const shouldShowPreview =
                          previewPlayer &&
                          !assignedPlayers.some((player) => player.id === previewPlayer.id);

                        return (
                          <div className="flow-choice-wrap" key={option}>
                            <button
                              className={`choice-button flow-choice-button ${currentChoices.length % 2 !== 0 ? "is-list-view" : ""} ${isCorrect ? "is-correct" : ""} ${holdingOption === option ? "is-holding" : ""} ${poppingOption === option ? "is-popping" : ""}`}
                              onClick={() => handleChoiceClick(option)}
                              onPointerCancel={handleChoicePointerUp}
                              onPointerDown={() => handleChoicePointerDown(option)}
                              onPointerLeave={handleChoicePointerUp}
                              onPointerUp={handleChoicePointerUp}
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
                              {songChoice?.coverImage ? (
                                <span className="flow-choice-media">
                                  <img
                                    alt={`${option} cover`}
                                    className="flow-choice-cover"
                                    src={songChoice.coverImage}
                                  />
                                  <span className="flow-choice-label">{option}</span>
                                </span>
                              ) : (
                                <span className="flow-choice-label">{option}</span>
                              )}
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
