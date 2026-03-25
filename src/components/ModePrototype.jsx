import { useMemo, useRef, useState } from "react";
import AnimatedContent from "./AnimatedContent";
import StaggeredMenu from "./StaggeredMenu";
import { getGameModeById } from "../data/gameModeCatalog";
import {
  albumCoverZoomQuestions,
  emojiSongGuessQuestions,
  finishTheLyricQuestions,
  playlistDifficultyOptions,
  playlistQuestionCountOptions,
} from "../data/playlistGamePacks";
import { buildJeopardyBoard, jeopardyBoardValues } from "../data/jeopardyQuestionBank";
import { normalizeScores } from "../data/scoreModel";

function getStableHash(value) {
  return Array.from(value).reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function sortWithSeed(values, seed) {
  return [...values].sort((left, right) => {
    const leftScore = getStableHash(`${seed}-${left.id ?? left}`);
    const rightScore = getStableHash(`${seed}-${right.id ?? right}`);
    return leftScore - rightScore;
  });
}

function buildQuestionSet(allQuestions, count, seed) {
  return sortWithSeed(allQuestions, seed).slice(0, Math.min(count, allQuestions.length));
}

function getAvailableQuestionCounts(totalCount) {
  const presetCounts = playlistQuestionCountOptions.filter((option) => option <= totalCount);

  if (presetCounts.length) {
    return presetCounts;
  }

  return totalCount > 0 ? [totalCount] : [];
}

function getPlaylistQuestionsForMode(modeId) {
  if (modeId === "emoji-song-guess") return emojiSongGuessQuestions;
  if (modeId === "album-cover-zoom") return albumCoverZoomQuestions;
  if (modeId === "finish-the-lyric") return finishTheLyricQuestions;
  return [];
}

function playerCanScore(player, hostGetsScore, hostId) {
  if (player.id !== hostId) return true;
  return hostGetsScore;
}

function PlaylistModeGame({
  mode,
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
}) {
  const sourceQuestions = useMemo(() => getPlaylistQuestionsForMode(mode.id), [mode.id]);
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCount, setQuestionCount] = useState(10);
  const [isSetupOpen, setIsSetupOpen] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionSeed, setSessionSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [guessAssignments, setGuessAssignments] = useState({});
  const [previewAssignments, setPreviewAssignments] = useState({});
  const [awardedPoints, setAwardedPoints] = useState({});
  const [holdingOption, setHoldingOption] = useState(null);
  const longPressRef = useRef({ timer: null, triggered: false });
  const filteredQuestions = useMemo(
    () => sourceQuestions.filter((question) => question.difficulty === difficulty),
    [difficulty, sourceQuestions],
  );
  const availableQuestionCounts = useMemo(
    () => getAvailableQuestionCounts(filteredQuestions.length),
    [filteredQuestions.length],
  );

  const activeQuestions = useMemo(
    () =>
      buildQuestionSet(
        filteredQuestions,
        Math.min(questionCount, filteredQuestions.length),
        `${mode.id}-${difficulty}-${sessionSeed}`,
      ),
    [difficulty, filteredQuestions, mode.id, questionCount, sessionSeed],
  );
  const currentQuestion = activeQuestions[currentIndex] ?? null;
  const stepId = currentQuestion?.id ?? null;
  const isLastQuestion = currentIndex >= activeQuestions.length - 1;
  const promptHeading =
    mode.id === "album-cover-zoom"
      ? "Guess the album"
      : currentQuestion?.title ?? "Waiting for setup";
  const displayPlayers = useMemo(() => [hostProfile, ...players], [hostProfile, players]);
  const lineupPlayers = useMemo(() => [hostProfile, ...players], [hostProfile, players]);
  const playerSlotCount = Math.max(7, Number(desiredPlayerCount) || 0, lineupPlayers.length + 1);
  const playerSlots = useMemo(
    () => Array.from({ length: playerSlotCount }, (_, index) => lineupPlayers[index] ?? null),
    [lineupPlayers, playerSlotCount],
  );
  const eligiblePlayers = useMemo(
    () => displayPlayers.filter((player) => playerCanScore(player, hostGetsScore, hostProfile.id)),
    [displayPlayers, hostGetsScore, hostProfile.id],
  );
  const visibleChoices = useMemo(
    () =>
      currentQuestion
        ? sortWithSeed(
            currentQuestion.choices,
            `${mode.id}-${difficulty}-${sessionSeed}-${currentQuestion.id}`,
          )
        : [],
    [currentQuestion, difficulty, mode.id, sessionSeed],
  );

  function getPlayerSubtitle(player) {
    if (player.id === hostProfile.id) {
      return hostGetsScore ? "Host and player" : "Host";
    }

    return "Player";
  }

  function resetRoundState() {
    setCurrentIndex(0);
    setRevealed(false);
    setSelectedChoice(null);
    setZoomLevel(0);
    setGuessAssignments({});
    setPreviewAssignments({});
    setAwardedPoints({});
  }

  function restartGame(nextSeed = sessionSeed) {
    setSessionSeed(nextSeed);
    resetRoundState();
  }

  function handleQuestionCountChange(nextValue) {
    setQuestionCount(nextValue);
    resetRoundState();
  }

  function handleDifficultyChange(nextDifficulty) {
    setDifficulty(nextDifficulty);
    resetRoundState();
  }

  function handleStartGame() {
    const safeQuestionCount = Math.min(questionCount, filteredQuestions.length || questionCount);
    setQuestionCount(safeQuestionCount);
    resetRoundState();
    setHasStarted(true);
    setIsSetupOpen(false);
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

  function getPreviewPlayerId(option) {
    return previewAssignments[stepId]?.[option] ?? null;
  }

  function getAssignedOption(playerId) {
    return guessAssignments[stepId]?.[playerId] ?? null;
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
    const stepAssignments = { ...(currentAssignments[stepId] ?? {}) };

    Object.keys(stepAssignments).forEach((choice) => {
      if (choice !== option && stepAssignments[choice] === playerId) {
        delete stepAssignments[choice];
      }
    });

    stepAssignments[option] = playerId;

    return {
      ...currentAssignments,
      [stepId]: stepAssignments,
    };
  }

  function cyclePreviewPlayer(option) {
    if (!stepId || !eligiblePlayers.length) return;

    const availablePlayers = getAvailablePlayersForOption(option);
    if (!availablePlayers.length) return;

    const currentPreviewId = getPreviewPlayerId(option);
    const currentIndexForPreview = availablePlayers.findIndex(
      (player) => player.id === currentPreviewId,
    );
    const nextPlayer =
      currentIndexForPreview === -1
        ? availablePlayers[0]
        : availablePlayers[
            (currentIndexForPreview + 1 + availablePlayers.length) % availablePlayers.length
          ];

    setPreviewAssignments((currentAssignments) => ({
      ...updatePreviewForOption(currentAssignments, option, nextPlayer.id),
    }));
  }

  function lockGuessForPreview(option) {
    const availablePlayers = getAvailablePlayersForOption(option);
    const previewPlayerId = getPreviewPlayerId(option) ?? availablePlayers[0]?.id ?? null;
    if (!previewPlayerId || !stepId) return;

    setPreviewAssignments((currentAssignments) =>
      updatePreviewForOption(currentAssignments, option, previewPlayerId),
    );

    setGuessAssignments((currentAssignments) => ({
      ...currentAssignments,
      [stepId]: {
        ...currentAssignments[stepId],
        [previewPlayerId]: option,
      },
    }));
  }

  function handleChoicePointerDown(option) {
    if (revealed) return;

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

  function handleChoiceClick(choice) {
    if (!currentQuestion || revealed) return;

    if (longPressRef.current.triggered) {
      longPressRef.current.triggered = false;
      return;
    }

    cyclePreviewPlayer(choice);
  }

  function autoAwardCorrectGuesses() {
    if (!stepId || !currentQuestion) return [];

    const awardedHits = [];

    setAwardedPoints((currentAwards) => {
      const currentStepAwards = currentAwards[stepId] ?? {};
      const nextStepAwards = { ...currentStepAwards };

      eligiblePlayers.forEach((player) => {
        const selectedOption = getAssignedOption(player.id);
        if (selectedOption !== currentQuestion.answer) return;
        if (nextStepAwards[player.id]?.__single) return;

        nextStepAwards[player.id] = {
          ...(nextStepAwards[player.id] ?? {}),
          __single: true,
        };
        awardedHits.push({ playerId: player.id });
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

  function revealAnswer() {
    if (!currentQuestion || revealed) return;

    setSelectedChoice(currentQuestion.answer);
    autoAwardCorrectGuesses();
    setRevealed(true);
  }

  function handleNextQuestion() {
    if (!currentQuestion) return;

    if (isLastQuestion) {
      restartGame(sessionSeed + 1);
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedChoice(null);
    setRevealed(false);
    setZoomLevel(0);
  }

  function renderPrompt() {
    if (!currentQuestion) {
      return (
        <div className="mode-live-card">
          <p className="panel-label">No questions loaded</p>
          <p>This playlist pack is empty right now.</p>
        </div>
      );
    }

    if (mode.id === "emoji-song-guess") {
      return (
        <div className="playlist-prompt-shell">
          <p className="panel-label">Emoji clue</p>
          <div className="playlist-emoji-prompt">{currentQuestion.prompt}</div>
          <p className="playlist-meta-line">
            Click to preview a player on an answer, then hold to lock it in.
          </p>
        </div>
      );
    }

    if (mode.id === "finish-the-lyric") {
      return (
        <div className="playlist-prompt-shell">
          <p className="panel-label">Finish the lyric</p>
          <blockquote className="playlist-lyric-card">
            "{currentQuestion.lyricLeadIn}..."
          </blockquote>
          <p className="playlist-meta-line">
            Song: {currentQuestion.title} by {currentQuestion.artist}
          </p>
        </div>
      );
    }

    return (
      <div className="playlist-prompt-shell">
        <div className="playlist-cover-frame">
          <img
            alt={`${currentQuestion.title} album cover`}
            className={`playlist-cover-image ${revealed ? "is-revealed" : ""}`}
            src={currentQuestion.coverImage}
            style={{
              transform: revealed
                ? "scale(1)"
                : `scale(${[3.8, 2.8, 1.95][zoomLevel] ?? 1.95})`,
              transformOrigin: `${currentQuestion.focusX}% ${currentQuestion.focusY}%`,
            }}
          />
        </div>
        <div className="playlist-cover-actions">
          <p className="panel-label">Album cover zoom</p>
          <p className="playlist-meta-line">
            Hold a choice to lock a player in after you zoom out as needed.
          </p>
          <button
            className="ghost-button"
            disabled={revealed || zoomLevel >= 2}
            onClick={() => setZoomLevel((value) => Math.min(2, value + 1))}
            type="button"
          >
            Zoom out
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="playlist-mode-screen">
      <div className="mode-live-hero">
        <p className="eyebrow">{mode.category}</p>
        <h1>{mode.title}</h1>
        <p className="hero-text">{mode.description}</p>
      </div>

      {isSetupOpen ? (
        <div className="modal-overlay" role="presentation">
          <section
            className="setup-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="playlist-setup-title"
          >
            <div className="setup-header">
              <div>
                <p className="panel-label">{mode.title}</p>
                <h2 id="playlist-setup-title">Party setup</h2>
              </div>
              {hasStarted ? (
                <button className="ghost-button" onClick={() => setIsSetupOpen(false)} type="button">
                  Close
                </button>
              ) : null}
            </div>

            <section className="party-lineup-section playlist-setup-lineup">
              <aside className="player-slots-panel player-lineup-wide">
                <div className="host-panel-header">
                  <div>
                    <p className="panel-label">Party lineup</p>
                    <h2>Current players</h2>
                  </div>
                  <span className="player-count">{lineupPlayers.length} total</span>
                </div>

                <div className="player-slot-grid player-slot-grid-wide">
                  {playerSlots.slice(0, 7).map((player, index) =>
                    player ? (
                      <div
                        className={`player-slot-card is-filled ${player.id === hostProfile.id ? "is-host" : ""}`}
                        key={player.id}
                      >
                        <div className="player-slot-top">
                          <span className="player-slot-icon">{player.icon}</span>
                          <div>
                            <strong>{player.name}</strong>
                            <p>{getPlayerSubtitle(player)}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="player-slot-card is-empty" key={`empty-${index}`}>
                        <span className="player-slot-icon">+</span>
                        <strong>Open slot</strong>
                        <p>Add a player from the home screen lineup</p>
                      </div>
                    ),
                  )}
                </div>
              </aside>
            </section>

            <div className="setup-grid">
              <div className="party-setting-card">
                <label className="setup-label" htmlFor={`${mode.id}-difficulty`}>
                  Difficulty
                </label>
                <select
                  id={`${mode.id}-difficulty`}
                  className="setup-input"
                  value={difficulty}
                  onChange={(event) => handleDifficultyChange(event.target.value)}
                >
                  {playlistDifficultyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option[0].toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="setup-help">Pool size: {filteredQuestions.length} questions.</p>
              </div>

              <div className="party-setting-card">
                <label className="setup-label" htmlFor={`${mode.id}-question-count`}>
                  Questions for the group
                </label>
                <select
                  id={`${mode.id}-question-count`}
                  className="setup-input"
                  value={Math.min(questionCount, filteredQuestions.length || questionCount)}
                  onChange={(event) => handleQuestionCountChange(Number(event.target.value))}
                >
                  {availableQuestionCounts.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <p className="setup-help">Choose how many prompts this round will use.</p>
              </div>

              <div className="party-setting-card">
                <label className="setup-label">Host</label>
                <div className="setup-input host-fixed-input">
                  {hostProfile.icon} {hostProfile.name}
                </div>
                <label className="toggle-row compact-toggle toggle-card">
                  <input
                    checked={hostGetsScore}
                    type="checkbox"
                    onChange={(event) => setHostGetsScore(event.target.checked)}
                  />
                  <span className={`toggle-switch ${hostGetsScore ? "is-active" : ""}`} aria-hidden="true">
                    <span className="toggle-knob" />
                  </span>
                  <span>Host gets score</span>
                </label>
              </div>

              <div className="party-setting-card">
                <label className="setup-label" htmlFor={`${mode.id}-player-count`}>
                  Lineup size
                </label>
                <input
                  id={`${mode.id}-player-count`}
                  className="setup-input"
                  min="1"
                  type="number"
                  value={desiredPlayerCount}
                  onChange={(event) => setDesiredPlayerCount(event.target.value)}
                />
                <p className="setup-help">This mirrors the home-screen party setup.</p>
              </div>
            </div>

            <div className="playlist-setup-actions">
              <button
                className="primary-button"
                disabled={!filteredQuestions.length}
                onClick={handleStartGame}
                type="button"
              >
                {hasStarted ? "Restart With These Settings" : "Start Game"}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <section className="score-strip-panel score-strip-panel-wide">
        <div className="score-strip-header">
          <div>
            <p className="panel-label">Live scores</p>
            <div className="score-strip-title-row">
              <h2>Current game</h2>
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
                    {isHost ? (hostGetsScore ? "Host and player" : "Host only") : "Player"}
                  </p>
                </div>
                <div className={`score-badge ${!isScoring ? "is-muted" : ""}`}>
                  {normalizeScores(player.scores)[scoreKey] ?? 0}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="round-card">
        <section className="round-game-section">
          <div className="round-overview">
            <div className="round-visual-column">
              <div className="member-image-wrap">
                <div className="image-question-bar">
                  <div className="image-question-copy">
                    <p className="flow-section-label">{mode.title}</p>
                    <h2>{promptHeading}</h2>
                  </div>
                </div>
                <div className="playlist-prompt-shell">
                  {renderPrompt()}
                </div>
              </div>

              <div className="image-action-bar">
                <button
                  className="ghost-button"
                  onClick={() => setIsSetupOpen(true)}
                  type="button"
                >
                  Game Setup
                </button>
                <button
                  className="ghost-button"
                  onClick={() => restartGame(sessionSeed + 1)}
                  type="button"
                >
                  Shuffle Set
                </button>
                <button
                  className="primary-button"
                  disabled={!currentQuestion || revealed}
                  onClick={revealAnswer}
                  type="button"
                >
                  Reveal answer
                </button>
                <button
                  className="ghost-button"
                  disabled={!currentQuestion}
                  onClick={handleNextQuestion}
                  type="button"
                >
                  {isLastQuestion ? "Restart set" : "Next question"}
                </button>
              </div>
            </div>

            <div className="round-meta-card">
              <div className="round-meta-top">
                <p className="flow-section-label">Multiple Choice</p>
                <div className="round-controls">
                  <div className="round-nav-pill">
                    <span className="round-nav-label">Difficulty</span>
                    <span className="playlist-nav-value">
                      {difficulty[0].toUpperCase() + difficulty.slice(1)}
                    </span>
                  </div>
                  <div className="round-nav-pill">
                    <span className="round-nav-label">Questions</span>
                    <span className="playlist-nav-value">{activeQuestions.length}</span>
                  </div>
                </div>
              </div>

              <div className={`round-flow-choices ${visibleChoices.length % 2 === 0 ? "is-even" : "is-odd"}`}>
                {visibleChoices.map((choice) => {
                  const isCorrect = revealed && choice === currentQuestion?.answer;
                  const isWrongPick = revealed && selectedChoice === choice && choice !== currentQuestion?.answer;
                  const playersOnChoice = getPlayersForOption(choice);
                  const previewPlayerId = getPreviewPlayerId(choice);
                  const previewPlayer = eligiblePlayers.find((player) => player.id === previewPlayerId);
                  const shouldShowPreview =
                    previewPlayer &&
                    !playersOnChoice.some((player) => player.id === previewPlayer.id);

                  return (
                    <div className="flow-choice-wrap" key={choice}>
                      <button
                        className={`choice-button flow-choice-button ${visibleChoices.length % 2 !== 0 ? "is-list-view" : ""} ${isCorrect ? "is-correct" : ""} ${holdingOption === choice ? "is-holding" : ""} ${isWrongPick ? "is-popping" : ""}`}
                        disabled={revealed}
                        onClick={() => handleChoiceClick(choice)}
                        onMouseDown={() => handleChoicePointerDown(choice)}
                        onMouseLeave={handleChoicePointerUp}
                        onMouseUp={handleChoicePointerUp}
                        type="button"
                      >
                        {(playersOnChoice.length || shouldShowPreview) ? (
                          <span className="flow-choice-tags">
                            {playersOnChoice.map((player) => (
                              <span className="flow-choice-tag is-locked" key={`${choice}-${player.id}`}>
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
                        <span className="flow-choice-label">{choice}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}

function JeopardyModeGame({
  mode,
  players,
  setPlayers,
  hostProfile,
  setHostProfile,
  hostGetsScore,
  scoreKey,
}) {
  const [boardSeed, setBoardSeed] = useState(0);
  const [activeClueId, setActiveClueId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [usedClues, setUsedClues] = useState({});
  const [clueAwards, setClueAwards] = useState({});
  const board = useMemo(() => buildJeopardyBoard(boardSeed), [boardSeed]);
  const displayPlayers = useMemo(
    () => (hostGetsScore ? [hostProfile, ...players] : players),
    [hostGetsScore, hostProfile, players],
  );

  const activeClue = useMemo(() => {
    if (!activeClueId) return null;

    return (
      board
        .flatMap((category) =>
          category.boardQuestions.map((question) => ({
            ...question,
            categoryTitle: category.title,
          })),
        )
        .find((question) => question.id === activeClueId) ?? null
    );
  }, [activeClueId, board]);

  function updateScoreForPlayer(playerId, amount) {
    if (!amount) return;

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

  function setClueAward(playerId, nextAmount) {
    if (!activeClue) return;

    setClueAwards((currentAwards) => {
      const clueEntry = currentAwards[activeClue.id] ?? {};
      const previousAmount = clueEntry[playerId] ?? 0;
      const delta = nextAmount - previousAmount;

      updateScoreForPlayer(playerId, delta);

      return {
        ...currentAwards,
        [activeClue.id]: {
          ...clueEntry,
          [playerId]: nextAmount,
        },
      };
    });
  }

  function openClue(questionId) {
    if (usedClues[questionId]) return;
    setActiveClueId(questionId);
    setRevealed(false);
  }

  function closeClue(markUsed = true) {
    if (markUsed && activeClueId) {
      setUsedClues((current) => ({
        ...current,
        [activeClueId]: true,
      }));
    }

    setActiveClueId(null);
    setRevealed(false);
  }

  function shuffleBoard() {
    setBoardSeed((value) => value + 1);
    setActiveClueId(null);
    setRevealed(false);
    setUsedClues({});
  }

  return (
      <section className="jeopardy-screen">
        <div className="jeopardy-topbar">
          <div>
            <h1>K-pop Jeopardy</h1>
          </div>
        <div className="jeopardy-host-stack">
          <div className="jeopardy-host-pill">
            <span className="jeopardy-host-label">Host</span>
            <strong>
              {hostProfile.icon ? `${hostProfile.icon} ` : ""}
              {hostProfile.name}
            </strong>
          </div>
          <button className="ghost-button" onClick={shuffleBoard} type="button">
            Shuffle Board
          </button>
        </div>
      </div>

      <div className="jeopardy-board">
        <div className="jeopardy-board-header">
          {board.map((category) => (
            <div className="jeopardy-category" key={category.id}>
              {category.title}
            </div>
          ))}
        </div>

        <div className="jeopardy-board-grid">
          {jeopardyBoardValues.flatMap((value) =>
            board.map((category) => {
              const clue = category.boardQuestions.find((question) => question.value === value);
              const isUsed = clue ? usedClues[clue.id] : true;

              return (
                <button
                  className={`jeopardy-tile ${isUsed ? "is-used" : ""}`}
                  disabled={!clue || isUsed}
                  key={`${category.id}-${value}`}
                  onClick={() => openClue(clue.id)}
                  type="button"
                >
                  {isUsed ? "DONE" : value}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <div className="jeopardy-player-strip">
        {displayPlayers.map((player) => {
          const isHost = player.id === hostProfile.id;

          return (
            <div className={`jeopardy-player-card ${isHost ? "is-host" : ""}`} key={player.id}>
              <div>
                <strong>
                  {player.icon ? `${player.icon} ` : ""}
                  {player.name}
                </strong>
                <p>{isHost ? "Host" : "Player"}</p>
              </div>
              <div className="jeopardy-player-score">
                {normalizeScores(player.scores)[scoreKey] ?? 0}
              </div>
            </div>
          );
        })}
      </div>

      {activeClue ? (
        <div className="modal-overlay" role="presentation">
          <section className="setup-modal jeopardy-clue-modal" role="dialog" aria-modal="true">
            <div className="setup-header">
              <div>
                <p className="panel-label">{activeClue.categoryTitle}</p>
                <h2>{activeClue.value}</h2>
              </div>
              <button className="ghost-button" onClick={() => closeClue(false)} type="button">
                Close
              </button>
            </div>

            <div className="jeopardy-clue-body">
              <div className="jeopardy-clue-value">{activeClue.value}</div>
              {activeClue.image ? (
                <img
                  alt={activeClue.answer}
                  className="jeopardy-clue-image"
                  src={activeClue.image}
                />
              ) : null}
              <div className={`jeopardy-clue-prompt ${activeClue.promptType === "emoji" ? "is-emoji" : ""}`}>
                {activeClue.prompt}
              </div>
              {activeClue.note ? <p className="playlist-meta-line">{activeClue.note}</p> : null}
              {revealed ? (
                <div className="playlist-answer-panel">
                  <p className="panel-label">Answer</p>
                  <strong>{activeClue.answer}</strong>
                </div>
              ) : null}

              <div className="jeopardy-clue-player-strip">
                {displayPlayers.map((player) => {
                  const currentAward = clueAwards[activeClue.id]?.[player.id] ?? 0;

                  return (
                    <div
                      className={`jeopardy-clue-player-card ${player.id === hostProfile.id ? "is-host" : ""}`}
                      key={`${activeClue.id}-${player.id}`}
                    >
                      <div>
                        <strong>
                          {player.icon ? `${player.icon} ` : ""}
                          {player.name}
                        </strong>
                        <p>{player.id === hostProfile.id ? "Host" : "Player"}</p>
                      </div>
                      <div className="jeopardy-clue-player-actions">
                        <button
                          className={`ghost-button score-toggle ${currentAward === activeClue.value ? "is-awarded" : ""}`}
                          onClick={() =>
                            setClueAward(
                              player.id,
                              currentAward === activeClue.value ? 0 : activeClue.value,
                            )
                          }
                          type="button"
                        >
                          Correct +{activeClue.value}
                        </button>
                        <button
                          className={`ghost-button score-toggle is-negative ${currentAward === -activeClue.value ? "is-awarded" : ""}`}
                          onClick={() =>
                            setClueAward(
                              player.id,
                              currentAward === -activeClue.value ? 0 : -activeClue.value,
                            )
                          }
                          type="button"
                        >
                          Wrong -{activeClue.value}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="image-action-bar">
              <button className="primary-button" onClick={() => setRevealed(true)} type="button">
                Reveal Answer
              </button>
              <button className="ghost-button" onClick={() => closeClue(true)} type="button">
                Mark Used
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function renderModeSurface(mode, modeProps) {
  if (
    mode.id === "emoji-song-guess" ||
    mode.id === "album-cover-zoom" ||
    mode.id === "finish-the-lyric"
  ) {
    return <PlaylistModeGame mode={mode} {...modeProps} />;
  }

  if (mode.id === "jeopardy") {
    return <JeopardyModeGame mode={mode} {...modeProps} />;
  }

  return (
    <section className="mode-live-screen">
      <div className="mode-live-hero">
        <p className="eyebrow">{mode.category}</p>
        <h1>{mode.title}</h1>
        <p className="hero-text">{mode.description}</p>
      </div>

      <div className="mode-live-card-grid">
        <div className="mode-live-card">
          <p className="panel-label">Game flow</p>
          {mode.flow.map((item, index) => (
            <div className="mode-flow-step compact" key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>

        <div className="mode-live-card">
          <p className="panel-label">Ready for content</p>
          <p>
            This mode is set up as a normal game page now. Add your own prompts,
            images, rounds, or clues next.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ModePrototype({
  modeId,
  onBackHome,
  onOpenModeHub,
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
}) {
  const mode = useMemo(() => getGameModeById(modeId), [modeId]);

  if (!mode) {
    return (
      <div className="page-shell">
        <main className="app-frame">
          <section className="game-show-hero">
            <div>
              <p className="eyebrow">Mode missing</p>
              <h1>This game was not found.</h1>
            </div>
            <div className="mode-hub-actions">
              <button className="ghost-button" onClick={onBackHome} type="button">
                Back home
              </button>
              <button className="primary-button" onClick={onOpenModeHub} type="button">
                View all games
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell" id="top">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <StaggeredMenu
        position="right"
        items={[
          { label: "Home", ariaLabel: "Return home", link: "#top" },
          { label: "Game", ariaLabel: "Jump to game screen", link: "#mode-game" },
          { label: "All Games", ariaLabel: "Open all games", onClick: onOpenModeHub },
        ]}
        socialItems={[
          { label: "Back Home", onClick: onBackHome },
          { label: "All Games", onClick: onOpenModeHub },
          { label: "Top", link: "#top" },
        ]}
        itemSectionLabel="Game menu"
        socialSectionLabel="Navigation"
        displaySocials
        displayItemNumbering
        menuButtonColor="#fff8ef"
        openMenuButtonColor="#fff8ef"
        changeMenuColorOnOpen
        colors={["#ff8d66", "#ff5d8f"]}
        accentColor="#ff5d8f"
      />

      <main className="app-frame">
        <AnimatedContent
          distance={70}
          direction="vertical"
          reverse={false}
          duration={0.72}
          ease="cubic-bezier(0.22, 1, 0.36, 1)"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.1}
          delay={0}
        >
          <section className="mode-game-shell" id="mode-game">
            {renderModeSurface(mode, {
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
            })}
          </section>
        </AnimatedContent>
      </main>
    </div>
  );
}
