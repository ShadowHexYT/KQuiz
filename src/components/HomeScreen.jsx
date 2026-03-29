import { useEffect, useState } from "react";
import { HOST_ID } from "../App";
import { modeSupportsGroupFocus } from "../data/gameModeCatalog";
import { groupQuizzes } from "../data/groupQuizzes";
import { playlistGroupOptions } from "../data/playlistGamePacks";
import AnimatedContent from "./AnimatedContent";
import AnimatedList from "./AnimatedList";
import Carousel from "./Carousel";

const backgroundImages = [
  "/quiz-media/image1.jpg",
  "/quiz-media/image10.jpg",
  "/quiz-media/image18.png",
  "/quiz-media/image31.jpg",
  "/quiz-media/image45.jpg",
  "/quiz-media/image53.jpg",
  "/quiz-media/image67.jpg",
  "/quiz-media/image75.jpg",
];

const floatingKpopTags = [
  "TWICE",
  "LE SSERAFIM",
  "NewJeans",
  "IVE",
  "aespa",
  "NMIXX",
  "Kiss of Life",
  "Bias Pick",
  "Comeback",
  "♪",
  "★",
];

const floatingKpopDecor = [
  { label: "TWICE", type: "logo" },
  { label: "LE SSERAFIM", type: "logo" },
  { label: "NewJeans", type: "logo" },
  { label: "IVE", type: "logo" },
  { label: "aespa", type: "logo" },
  { label: "NMIXX", type: "logo" },
  { label: "KISS OF LIFE", type: "logo" },
  { label: "COMEBACK", type: "tag" },
  { label: "BIAS PICK", type: "tag" },
  { label: "STAGE MODE", type: "tag" },
  { label: "♥", type: "icon" },
  { label: "♡", type: "icon" },
  { label: "✦", type: "icon" },
  { label: "♪", type: "icon" },
  { label: "♫", type: "icon" },
];

function pickRandomBackgroundSet() {
  const shuffled = [...backgroundImages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

function getDifficultyOptionsForMode(modeId) {
  if (modeId === "main-game") {
    return ["Party", "Standard", "Chaos"];
  }

  if (modeId === "jeopardy") {
    return ["Easy", "Medium", "Hard"];
  }

  if (modeId === "finish-the-lyric") {
    return ["Easy", "Medium", "Hard"];
  }

  if (modeId === "emoji-song-guess") {
    return ["Easy", "Medium", "Hard"];
  }

  if (modeId === "album-cover-zoom") {
    return ["Easy", "Medium", "Hard"];
  }

  if (modeId === "lightstick-silhouette-guess") {
    return ["Easy", "Medium", "Hard"];
  }

  return ["Standard"];
}

const TEAM_ACCENTS = [
  {
    border: "rgba(255, 108, 152, 0.62)",
    glow: "rgba(255, 108, 152, 0.18)",
    wash: "rgba(255, 108, 152, 0.1)",
  },
  {
    border: "rgba(142, 240, 186, 0.56)",
    glow: "rgba(142, 240, 186, 0.18)",
    wash: "rgba(97, 220, 155, 0.1)",
  },
  {
    border: "rgba(137, 225, 255, 0.56)",
    glow: "rgba(137, 225, 255, 0.18)",
    wash: "rgba(88, 204, 255, 0.08)",
  },
  {
    border: "rgba(255, 141, 102, 0.56)",
    glow: "rgba(255, 141, 102, 0.18)",
    wash: "rgba(255, 141, 102, 0.08)",
  },
];

export default function HomeScreen({
  players,
  hostProfile,
  hostGetsScore,
  selectedGroup,
  selectedLaunchTarget,
  modeGroupFilters,
  playerName,
  newPlayerIcon,
  teams,
  teamsEnabled,
  newPlayerTeamId,
  playerIcons,
  onHostGetsScoreChange,
  onAddPlayer,
  onRemovePlayer,
  onPlayerNameChange,
  onNewPlayerIconChange,
  onNewPlayerTeamChange,
  onPlayerUpdate,
  onHostUpdate,
  onAssignPlayerAsHost,
  onRestoreDefaultHost,
  onTeamCountChange,
  onTeamRename,
  onTeamsEnabledChange,
  onMovePlayerToLineupSlot,
  modeOptions,
  onSelectLaunchTarget,
  onModeGroupFilterChange,
  onOpenModeHub,
  onOpenMode,
  onStartGroupQuiz,
  onLaunchGroupQuiz,
  onStartMainShow,
}) {
  const [carouselModeIndex, setCarouselModeIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [openEmojiMenuFor, setOpenEmojiMenuFor] = useState(null);
  const [draggedLineupPlayerId, setDraggedLineupPlayerId] = useState(null);
  const [activeTeamDropZoneId, setActiveTeamDropZoneId] = useState(null);
  const [swapAnimation, setSwapAnimation] = useState(null);
  const [backgroundSet, setBackgroundSet] = useState(() => pickRandomBackgroundSet());
  const [activeTeamEditorId, setActiveTeamEditorId] = useState("team-1");
  const [modeDifficulties, setModeDifficulties] = useState(() =>
    Object.fromEntries(modeOptions.map((mode) => [mode.id, getDifficultyOptionsForMode(mode.id)[0]])),
  );
  const displayedTeams = teams.slice(0, 3);
  const fixedTeamSlotTeams = [
    displayedTeams[0] ?? null,
    displayedTeams[1] ?? null,
    displayedTeams[0] ?? null,
    displayedTeams[1] ?? null,
    displayedTeams[2] ?? null,
    displayedTeams[2] ?? null,
  ];
  const selectedModeIndex = (() => {
    if (selectedLaunchTarget?.type !== "mode") return null;
    const matchedIndex = modeOptions.findIndex((mode) => mode.id === selectedLaunchTarget.id);
    return matchedIndex >= 0 ? matchedIndex : null;
  })();
  const previewMode = modeOptions[carouselModeIndex] ?? modeOptions[0];
  const activeMode =
    selectedModeIndex === null ? null : (modeOptions[selectedModeIndex] ?? null);
  const difficultyMode = activeMode ?? previewMode;
  const hasSelectedMode = selectedModeIndex !== null;
  const hasSelectedGroup = selectedLaunchTarget?.type === "group";
  const isAdvertisedGroupSelected = hasSelectedGroup && selectedLaunchTarget.id === selectedGroup.label;
  const canLaunchActiveMode = Boolean(activeMode && !activeMode.comingSoon);
  const hasPlayableModeSelected = selectedLaunchTarget?.type === "mode" && canLaunchActiveMode;
  const canLaunchSelectedTarget = hasPlayableModeSelected || hasSelectedGroup;
  const isPreviewModeSelected = hasSelectedMode && previewMode?.id === activeMode?.id;
  const activeDifficultyOptions = getDifficultyOptionsForMode(difficultyMode?.id);
  const activeDifficulty =
    (difficultyMode?.id ? modeDifficulties[difficultyMode.id] : null) ?? activeDifficultyOptions[0];
  const showModeGroupFilter = Boolean(difficultyMode?.id && modeSupportsGroupFocus(difficultyMode.id));
  const activeModeGroupFilter = difficultyMode?.id
    ? (modeGroupFilters?.[difficultyMode.id] ?? "All groups")
    : "All groups";
  const lineupPlayers = [hostProfile, ...players];
  const playerSlotCount = Math.max(7, lineupPlayers.length + 1);
  const playerSlots = Array.from({ length: playerSlotCount }, (_, index) => lineupPlayers[index] ?? null);
  const slottedPlayers = players
    .map((player, index) => ({
      ...player,
      resolvedLineupSlot: player.lineupSlot ?? index + 1,
    }))
    .sort((leftPlayer, rightPlayer) => leftPlayer.resolvedLineupSlot - rightPlayer.resolvedLineupSlot);
  const visibleTeamSlots = Array.from({ length: 6 }, (_, index) => {
    const slotNumber = index + 1;
    return slottedPlayers.find((player) => player.resolvedLineupSlot === slotNumber) ?? null;
  });
  const activeEditorTeam =
    displayedTeams.find((team) => team.id === activeTeamEditorId) ?? displayedTeams[0] ?? null;
  const launchActiveMode = () => {
    if (!activeMode || activeMode.comingSoon) return;

    if (activeMode.id === "main-game") {
      onStartMainShow();
      return;
    }

    onOpenMode(activeMode.id);
  };
  const launchSelectedTarget = () => {
    if (hasSelectedGroup) {
      onLaunchGroupQuiz?.(selectedGroup);
      return;
    }

    launchActiveMode();
  };
  const launchButtonLabel = activeMode?.comingSoon
    ? `${activeMode.title} Coming Soon`
    : activeMode
      ? `Launch ${activeMode.title}`
      : hasSelectedGroup
        ? `Launch ${selectedLaunchTarget.id} Quiz`
        : "Select a game or group";
  const currentPlayersLabel = `Current Players: ${lineupPlayers.length}`;
  const formatLabel = teamsEnabled ? `${teams.length} teams` : "Free-for-all";

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setBackgroundSet(pickRandomBackgroundSet());
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (teamsEnabled && teams.length !== 3) {
      onTeamCountChange("3");
    }
  }, [onTeamCountChange, teams.length, teamsEnabled]);

  useEffect(() => {
    if (!displayedTeams.length) return;

    const hasActiveTeam = displayedTeams.some((team) => team.id === activeTeamEditorId);
    if (!hasActiveTeam) {
      setActiveTeamEditorId(displayedTeams[0].id);
    }
  }, [activeTeamEditorId, displayedTeams]);

  function getTeamName(teamId) {
    return teams.find((team) => team.id === teamId)?.name ?? "Unassigned";
  }

  function getPlayerSubtitle(player) {
    if (player.id === hostProfile.id) {
      return "Host";
    }

    if (teamsEnabled && player.teamId) {
      return getTeamName(player.teamId);
    }

    return "";
  }

  function getTeamAccent(teamId) {
    const teamIndex = displayedTeams.findIndex((team) => team?.id === teamId);
    return TEAM_ACCENTS[teamIndex] ?? TEAM_ACCENTS[0];
  }

  function updatePlayerIcon(player, icon) {
    if (player.id === hostProfile.id) {
      onHostUpdate({ icon });
    } else {
      onPlayerUpdate(player.id, { icon });
    }

    setOpenEmojiMenuFor(null);
  }

  function handleTeamsEnabledChange(isEnabled) {
    onTeamsEnabledChange(isEnabled);
  }

  function handleDifficultyChange(option) {
    if (!difficultyMode?.id) return;

    setModeDifficulties((currentValues) => ({
      ...currentValues,
      [difficultyMode.id]: option,
    }));
  }

  function handleTeamCountSelect(count) {
    onTeamCountChange(String(count));
  }

  function handleLineupDrop(targetSlotNumber) {
    if (!draggedLineupPlayerId) return;
    onMovePlayerToLineupSlot?.(draggedLineupPlayerId, targetSlotNumber);
    setDraggedLineupPlayerId(null);
    setActiveTeamDropZoneId(null);
  }

  function handleLineupDragStart(playerId) {
    setDraggedLineupPlayerId(playerId);
    setOpenEmojiMenuFor(null);
  }

  function handleLineupDragEnd() {
    setDraggedLineupPlayerId(null);
    setActiveTeamDropZoneId(null);
  }

  useEffect(() => {
    if (!swapAnimation) return undefined;

    const timer = window.setTimeout(() => {
      setSwapAnimation(null);
    }, 380);

    return () => window.clearTimeout(timer);
  }, [swapAnimation]);

  return (
    <div className="page-shell" id="top">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <div className="kpop-background-layer" aria-hidden="true">
        <div className="kpop-background-grid">
          {backgroundSet.map((imagePath, index) => (
            <div className={`kpop-background-card kpop-background-card-${index + 1}`} key={`${imagePath}-${index}`}>
              <img alt="" className="kpop-background-image" src={imagePath} />
            </div>
          ))}
        </div>

        <div className="kpop-floating-tags">
          {floatingKpopDecor.map((item, index) => (
            <span
              className={`kpop-floating-tag kpop-floating-tag-${(index % 12) + 1} kpop-floating-tag-${item.type}`}
              key={`${item.label}-${index}`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <main className="app-frame">
        <section className="hero-showcase hero-showcase-banner">
          <AnimatedContent
            distance={100}
            direction="vertical"
            reverse={false}
            duration={0.8}
            ease="cubic-bezier(0.22, 1, 0.36, 1)"
            initialOpacity={0}
            animateOpacity
            scale={0.98}
            threshold={0.1}
            delay={0}
          >
            <section className="hero-card hero-card-banner">
              <div className="hero-copy">
                <div className="hero-brand" aria-label="Kpop Quiz Games">
                  <span className="hero-brand-mark" aria-hidden="true">
                    <span className="hero-brand-icon">🫰</span>
                  </span>
                  <div className="hero-brand-title">
                    <h1>KQuiz Games</h1>
                    <span className="hero-brand-byline">by Hunter</span>
                  </div>
                </div>

                <div className="hero-lineup-panel" id="party-lineup">
                  <div className="hero-lineup-header">
                    <div className="hero-lineup-title">
                      <h2>Party</h2>
                    </div>
                    <span className="player-count">{currentPlayersLabel}</span>
                  </div>

                <div className="hero-lineup-grid">
                  {lineupPlayers[0] ? (
                    <div
                      className={`hero-lineup-chip ${lineupPlayers[0].id === hostProfile.id ? "is-host" : ""} ${
                        teamsEnabled && hostProfile.teamId ? "has-team-outline" : ""
                      }`}
                      key={lineupPlayers[0].id}
                      style={
                        teamsEnabled && hostProfile.teamId
                          ? {
                              "--team-outline": getTeamAccent(hostProfile.teamId).border,
                              "--team-glow": getTeamAccent(hostProfile.teamId).glow,
                              "--team-wash": getTeamAccent(hostProfile.teamId).wash,
                            }
                          : undefined
                      }
                    >
                      <span className="hero-lineup-icon">{lineupPlayers[0].icon}</span>
                      <div className="hero-lineup-copy">
                        <strong>{lineupPlayers[0].name}</strong>
                        {getPlayerSubtitle(lineupPlayers[0]) ? <p>{getPlayerSubtitle(lineupPlayers[0])}</p> : null}
                      </div>
                      {teamsEnabled && hostGetsScore ? (
                        <label className="hero-host-team-picker">
                          <select
                            className="hero-host-team-select"
                            value={hostProfile.teamId ?? displayedTeams[0]?.id ?? ""}
                            onChange={(event) => onHostUpdate({ teamId: event.target.value })}
                          >
                            {displayedTeams.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}
                    </div>
                  ) : null}

                  {visibleTeamSlots.map((player, index) => {
                    const slotNumber = index + 1;
                    const slotTeam = teamsEnabled ? fixedTeamSlotTeams[index] : null;
                    const slotAccent = slotTeam ? getTeamAccent(slotTeam.id) : null;
                    const activeDropKey = `slot-${slotNumber}`;

                    return player ? (
                      <div
                        className={`hero-lineup-chip ${player.id === hostProfile.id ? "is-host" : ""} ${
                          teamsEnabled && slotTeam ? "has-team-outline" : ""
                        } ${draggedLineupPlayerId === player.id ? "is-dragging" : ""} ${
                          activeTeamDropZoneId === activeDropKey ? "is-drop-target" : ""
                        }`}
                        key={player.id}
                        draggable={teamsEnabled}
                        onDragEnd={handleLineupDragEnd}
                        onDragStart={() => handleLineupDragStart(player.id)}
                        onDragOver={(event) => {
                          if (!teamsEnabled) return;
                          event.preventDefault();
                          setActiveTeamDropZoneId(activeDropKey);
                        }}
                        onDragLeave={() => {
                          setActiveTeamDropZoneId((currentValue) =>
                            currentValue === activeDropKey ? null : currentValue,
                          );
                        }}
                        onDrop={(event) => {
                          if (!teamsEnabled) return;
                          event.preventDefault();
                          handleLineupDrop(slotNumber);
                        }}
                        style={
                          teamsEnabled && slotAccent
                            ? {
                                "--team-outline": slotAccent.border,
                                "--team-glow": slotAccent.glow,
                                "--team-wash": slotAccent.wash,
                              }
                            : undefined
                        }
                      >
                        <span className="hero-lineup-icon">{player.icon}</span>
                        <div>
                          <strong>{player.name}</strong>
                          {teamsEnabled && slotTeam ? (
                            <p>{slotTeam.name}</p>
                          ) : getPlayerSubtitle(player) ? (
                            <p>{getPlayerSubtitle(player)}</p>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`hero-lineup-chip is-empty ${
                          activeTeamDropZoneId === activeDropKey ? "is-drop-target" : ""
                        } ${teamsEnabled && slotTeam ? "has-team-outline" : ""}`}
                        key={`hero-empty-${index}`}
                        onDragOver={(event) => {
                          if (!teamsEnabled) return;
                          event.preventDefault();
                          setActiveTeamDropZoneId(activeDropKey);
                        }}
                        onDragLeave={() => {
                          setActiveTeamDropZoneId((currentValue) =>
                            currentValue === activeDropKey ? null : currentValue,
                          );
                        }}
                        onDrop={(event) => {
                          if (!teamsEnabled) return;
                          event.preventDefault();
                          handleLineupDrop(slotNumber);
                        }}
                        style={
                          teamsEnabled && slotAccent
                            ? {
                                "--team-outline": slotAccent.border,
                                "--team-glow": slotAccent.glow,
                                "--team-wash": slotAccent.wash,
                              }
                            : undefined
                        }
                      >
                        <span className="hero-lineup-icon">+</span>
                        <div>
                          <strong>Open slot</strong>
                          <p>{teamsEnabled && slotTeam ? slotTeam.name : "Add a player"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                  <div className="hero-actions">
                    <button
                      className={`primary-button ${canLaunchSelectedTarget ? "is-play-selected" : ""}`}
                      disabled={!canLaunchSelectedTarget}
                      onClick={launchSelectedTarget}
                      type="button"
                    >
                      {launchButtonLabel}
                    </button>
                  </div>
                </div>
              </div>

              <aside className="hero-setup-panel" id="party-setup">
                <div className="host-panel-header">
                  <div>
                    <h2>Party Setup</h2>
                  </div>
                </div>

                <form className="player-form" onSubmit={onAddPlayer}>
                  <label htmlFor="playerName">Add player</label>
                  <div className="player-form-stack">
                    <div className="player-icon-menu-wrap player-form-icon-wrap">
                      <button
                        aria-label="Choose emoji for new player"
                        className="player-icon-select"
                        onClick={() =>
                          setOpenEmojiMenuFor((currentValue) =>
                            currentValue === "new-player" ? null : "new-player",
                          )
                        }
                        type="button"
                      >
                        <span className="player-slot-icon">{newPlayerIcon}</span>
                        <span className="player-icon-caret">⌄</span>
                      </button>

                      {openEmojiMenuFor === "new-player" ? (
                        <div className="player-icon-menu player-icon-menu-wide">
                          {playerIcons.map((icon) => (
                            <button
                              className={`player-icon-option ${newPlayerIcon === icon ? "is-active" : ""}`}
                              key={`new-player-${icon}`}
                              onClick={() => {
                                onNewPlayerIconChange(icon);
                                setOpenEmojiMenuFor(null);
                              }}
                              type="button"
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <input
                      className="player-text-input"
                      id="playerName"
                      type="text"
                      placeholder="Enter a name"
                      value={playerName}
                      onChange={(event) => onPlayerNameChange(event.target.value)}
                    />
                    <button
                      aria-label="Add player"
                      className="primary-button player-add-button"
                      type="submit"
                    >
                      Add
                    </button>
                  </div>
                </form>

                {teamsEnabled ? (
                  <div className="party-settings-grid is-team-naming">
                    <div className="party-team-name-card">
                      {activeEditorTeam ? (
                        <>
                          <label className="party-team-editor-picker">
                            <select
                              className="party-team-editor-select"
                              value={activeEditorTeam.id}
                              onChange={(event) => setActiveTeamEditorId(event.target.value)}
                            >
                              {displayedTeams.map((team) => (
                                <option key={team.id} value={team.id}>
                                  Team {team.id.replace("team-", "")}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label
                            className="party-team-name-field is-single-editor"
                            style={{
                              "--team-outline": getTeamAccent(activeEditorTeam.id).border,
                              "--team-glow": getTeamAccent(activeEditorTeam.id).glow,
                              "--team-wash": getTeamAccent(activeEditorTeam.id).wash,
                            }}
                          >
                            <input
                              className="player-text-input hero-team-name-input"
                              type="text"
                              value={activeEditorTeam.name}
                              onChange={(event) => onTeamRename(activeEditorTeam.id, event.target.value)}
                            />
                          </label>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <div className="party-controls-panel">
                  <div className="party-control-group">
                    <span className="panel-label">Team structure</span>
                    <div className="party-segmented-row">
                      {[2, 3, 4].map((count) => (
                        <button
                          className={`ghost-button party-segment-button ${teams.length === count ? "is-active" : ""}`}
                          disabled={!teamsEnabled}
                          key={count}
                          onClick={() => handleTeamCountSelect(count)}
                          type="button"
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="party-control-group">
                    <span className="panel-label">Difficulty</span>
                    <div className="party-segmented-row">
                      {activeDifficultyOptions.map((option) => (
                        <button
                          className={`ghost-button party-segment-button ${activeDifficulty === option ? "is-active" : ""}`}
                          key={option}
                          onClick={() => handleDifficultyChange(option)}
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {showModeGroupFilter ? (
                    <div className="party-control-group">
                      <label className="panel-label" htmlFor="party-mode-group-focus">
                        Group focus
                      </label>
                      <select
                        id="party-mode-group-focus"
                        className="player-select-input party-group-focus-select"
                        value={activeModeGroupFilter}
                        onChange={(event) =>
                          onModeGroupFilterChange?.(difficultyMode.id, event.target.value)
                        }
                      >
                        <option value="All groups">All groups</option>
                        {playlistGroupOptions.map((groupName) => (
                          <option key={groupName} value={groupName}>
                            {groupName}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div className="party-control-group party-toggle-group">
                    <span className="panel-label">Toggles</span>
                    <div className="party-toggle-row">
                      <label className="party-toggle-pill" htmlFor="hostGetsScore">
                        <span>Host scoring</span>
                        <span className={`toggle-switch ${hostGetsScore ? "is-active" : ""}`} aria-hidden="true">
                          <span className="toggle-knob" />
                        </span>
                        <input
                          id="hostGetsScore"
                          checked={hostGetsScore}
                          type="checkbox"
                          onChange={(event) => onHostGetsScoreChange(event.target.checked)}
                        />
                      </label>

                      <label className="party-toggle-pill" htmlFor="teamsEnabled">
                        <span>Teams</span>
                        <span className={`toggle-switch ${teamsEnabled ? "is-active" : ""}`} aria-hidden="true">
                          <span className="toggle-knob" />
                        </span>
                        <input
                          id="teamsEnabled"
                          checked={teamsEnabled}
                          type="checkbox"
                          onChange={(event) => handleTeamsEnabledChange(event.target.checked)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </aside>
            </section>
          </AnimatedContent>
        </section>

        <AnimatedContent
          distance={80}
          direction="vertical"
          reverse={false}
          duration={0.8}
          ease="cubic-bezier(0.22, 1, 0.36, 1)"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.1}
          delay={0.08}
        >
          <section className="mode-section mode-section-top" id="modes">
            <div className="mode-layout">
              <aside className="mode-instructions-card">
                <p className="panel-label">How to start</p>
                <h2>Choose your game mode</h2>
                <p className="mode-instructions-text">
                  Browse the carousel, lock in the mode you want, and launch it from
                  the party lineup above when your group is ready.
                </p>
                <div className="mode-instruction-list">
                  <div className="mode-instruction-item">
                    <strong>1</strong>
                    <span>Watch the carousel or click a card to jump straight to it.</span>
                  </div>
                  <div className="mode-instruction-item">
                    <strong>2</strong>
                    <span>The selected card becomes your active mode.</span>
                  </div>
                  <div className="mode-instruction-item">
                    <strong>3</strong>
                    <span>Launch the selected game from the party lineup section.</span>
                  </div>
                </div>
              </aside>

              <div className="mode-carousel-column">
                <div
                  className="mode-carousel-wrap"
                  onMouseEnter={() => setIsCarouselHovered(true)}
                  onMouseLeave={() => setIsCarouselHovered(false)}
                >
                  <Carousel
                    activeIndex={carouselModeIndex}
                    autoplay={!hasSelectedMode}
                    autoplayDelay={5000}
                    baseWidth={280}
                    isPaused={isCarouselHovered}
                    items={modeOptions}
                    loop
                    selectedIndex={selectedModeIndex ?? -1}
                    onSelect={setCarouselModeIndex}
                    pauseOnHover
                    round={false}
                  />
                </div>

                <div className="mode-play-row">
                  <button
                    className={`primary-button ${isPreviewModeSelected ? "is-mode-selected" : ""}`}
                    disabled={!previewMode || previewMode.comingSoon || isPreviewModeSelected}
                    onClick={() => {
                      onSelectLaunchTarget?.({ type: "mode", id: previewMode.id });
                      setCarouselModeIndex(carouselModeIndex);
                    }}
                    type="button"
                  >
                    {previewMode?.comingSoon
                      ? "Coming Soon"
                      : isPreviewModeSelected
                        ? "Mode selected"
                        : `Select ${previewMode?.title ?? "Game"}`}
                  </button>
                  <button className="ghost-button" onClick={onOpenModeHub} type="button">
                    View all games
                  </button>
                </div>
              </div>
            </div>
          </section>
        </AnimatedContent>

        <AnimatedContent
          distance={80}
          direction="vertical"
          reverse={false}
          duration={0.8}
          ease="cubic-bezier(0.22, 1, 0.36, 1)"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.1}
          delay={0.12}
        >
          <section className="party-lineup-section">
            <aside className="player-slots-panel player-lineup-wide">
              <div className="host-panel-header">
                <div>
                  <p className="panel-label">Party</p>
                  <h2>Party</h2>
                </div>
                <span className="player-count">{lineupPlayers.length} total</span>
              </div>

              <div className="player-slot-grid player-slot-grid-wide">
                {playerSlots.map((player, index) =>
                  player ? (
                    <div
                      className={`player-slot-card is-filled ${player.id === hostProfile.id ? "is-host" : ""}`}
                      key={player.id}
                    >
                      <div className="player-slot-top">
                        <div className="player-icon-menu-wrap">
                          <button
                            aria-expanded={openEmojiMenuFor === player.id}
                            aria-label={`Change emoji for ${player.name}`}
                            className="player-icon-select"
                            onClick={() =>
                              setOpenEmojiMenuFor((currentValue) =>
                                currentValue === player.id ? null : player.id,
                              )
                            }
                            type="button"
                          >
                            <span className="player-slot-icon">{player.icon}</span>
                            <span className="player-icon-caret">⌄</span>
                          </button>

                          {openEmojiMenuFor === player.id ? (
                            <div className="player-icon-menu">
                              {playerIcons.map((icon) => (
                                <button
                                  className={`player-icon-option ${player.icon === icon ? "is-active" : ""}`}
                                  key={icon}
                                  onClick={() => updatePlayerIcon(player, icon)}
                                  type="button"
                                >
                                  {icon}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <div>
                          <strong>{player.name}</strong>
                          {getPlayerSubtitle(player) ? <p>{getPlayerSubtitle(player)}</p> : null}
                        </div>
                      </div>

                      <div className="player-slot-actions">
                        {player.id === hostProfile.id ? (
                          <>
                            <span className="host-pill">
                              {hostProfile.id === HOST_ID ? "Default host" : "Current host"}
                            </span>
                            {hostProfile.id !== HOST_ID ? (
                              <button
                                className="ghost-button player-slot-action"
                                onClick={onRestoreDefaultHost}
                                type="button"
                              >
                                Make player
                              </button>
                            ) : null}
                            <label className="toggle-row compact-toggle toggle-card">
                              <input
                                checked={hostGetsScore}
                                type="checkbox"
                                onChange={(event) => onHostGetsScoreChange(event.target.checked)}
                              />
                              <span className={`toggle-switch ${hostGetsScore ? "is-active" : ""}`} aria-hidden="true">
                                <span className="toggle-knob" />
                              </span>
                              <span>Score</span>
                            </label>
                          </>
                        ) : (
                          <>
                            <button
                              className="ghost-button player-slot-action"
                              onClick={() => onAssignPlayerAsHost(player.id)}
                              type="button"
                            >
                              Make host
                            </button>
                            <button
                              className="ghost-button player-slot-action"
                              onClick={() => onRemovePlayer(player.id)}
                              type="button"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="player-slot-card is-empty" key={`empty-${index}`}>
                      <span className="player-slot-icon">+</span>
                      <strong>Empty player</strong>
                      <p>Add a player in setup to fill this slot</p>
                    </div>
                  ),
                )}
              </div>
            </aside>
          </section>
        </AnimatedContent>

        <AnimatedContent
          distance={80}
          direction="vertical"
          reverse={false}
          duration={0.8}
          ease="cubic-bezier(0.22, 1, 0.36, 1)"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.1}
          delay={0.15}
        >
          <section className="group-section" id="groups">
            <div className="group-showcase">
              <div
                className={`group-feature-card ${isAdvertisedGroupSelected ? "is-selected" : ""}`}
                style={{
                  "--group-cover-image": selectedGroup.coverImage
                    ? `url("${selectedGroup.coverImage}")`
                    : "none",
                }}
              >
                <AnimatedContent
                  animateKey={selectedGroup.label}
                  className="group-feature-body"
                  delay={0}
                  direction="vertical"
                  distance={220}
                  duration={1.2}
                  ease="cubic-bezier(0.22, 1, 0.36, 1)"
                  initialOpacity={0}
                  reverse={false}
                  scale={1}
                  threshold={0.1}
                  animateOpacity
                >
                  <p className="panel-label">Individual quizzes</p>
                  <h3>{selectedGroup.label}</h3>
                  <p>{selectedGroup.description}</p>
                  <button
                    className={`group-start-button ${isAdvertisedGroupSelected ? "is-selected" : ""}`}
                    onClick={() => onStartGroupQuiz(selectedGroup)}
                    type="button"
                  >
                    {isAdvertisedGroupSelected
                      ? `${selectedGroup.label} Selected`
                      : `Select ${selectedGroup.label}`}
                  </button>
                </AnimatedContent>
              </div>

              <AnimatedList
                items={groupQuizzes}
                onItemSelect={(item) => onStartGroupQuiz(item, { silent: true })}
                onActiveItemChange={(item) => onStartGroupQuiz(item, { silent: true })}
                autoplay={!hasSelectedGroup}
                selectedItemLabel={hasSelectedGroup ? selectedLaunchTarget.id : null}
                showGradients={false}
                enableArrowNavigation
                displayScrollbar={false}
              />
            </div>
          </section>
        </AnimatedContent>
      </main>
    </div>
  );
}
