import { useEffect, useState } from "react";
import { HOST_ID } from "../App";
import AnimatedContent from "./AnimatedContent";
import AnimatedList from "./AnimatedList";
import Carousel from "./Carousel";
import StaggeredMenu from "./StaggeredMenu";

const groupQuizzes = [
  {
    label: "TWICE",
    description: "Title tracks, choreography highlights, and member trivia.",
  },
  {
    label: "LE SSERAFIM",
    description: "Fearless concepts, choreography moments, member visuals, and comeback rounds.",
  },
  {
    label: "NewJeans",
    description: "Debut-era details, visuals, styling, and song recognition.",
  },
  {
    label: "IVE",
    description: "Concepts, catchy hooks, member facts, and comeback rounds.",
  },
  {
    label: "aespa",
    description: "Virtual-era concepts, standout visuals, and song recognition rounds.",
  },
  {
    label: "NMIXX",
    description: "Member recognition, bold title tracks, and vocal-heavy quiz moments.",
  },
  {
    label: "ILLIT",
    description: "Cherish (My Love), dreamy member trivia, maknae picks, and bias rounds.",
  },
  {
    label: "KiiiKiii",
    description: "404 (New Era), member recognition, leader picks, and bias trivia.",
  },
  {
    label: "Meovv",
    description: "Burning Up, member visuals, maknae trivia, and bias picks.",
  },
  {
    label: "Hearts2Hearts",
    description: "Rude!, large-group member trivia, leader picks, and bias rounds.",
  },
  {
    label: "XG",
    description: "Hypnotize, standout member recognition, leader trivia, and bias picks.",
  },
  {
    label: "Baby DONT Cry",
    description: "I Dont Care, member recognition, leader trivia, and bias rounds.",
  },
  {
    label: "KPDH",
    description: "Fictional trio member trivia with leader, maknae, and bias picks.",
  },
  {
    label: "Kiss of Life",
    description: "Performance charisma, member trivia, and recent comeback questions.",
  },
];

const menuItems = [
  { label: "Home", ariaLabel: "Jump to the top of the page", link: "#top" },
  { label: "Setup", ariaLabel: "Jump to the player setup area", link: "#party-setup" },
  { label: "Party Lineup", ariaLabel: "Jump to party lineup", link: "#party-lineup" },
  { label: "Main Modes", ariaLabel: "Jump to main quiz modes", link: "#modes" },
  { label: "Groups", ariaLabel: "Jump to group specific quizzes", link: "#groups" },
];

const socialItems = [
  { label: "Main Gameshow", link: "#modes" },
  { label: "Game Lab", link: "#modes" },
  { label: "Random Group", link: "#groups" },
  { label: "Party Lineup", link: "#party-lineup" },
  { label: "Top Modes", link: "#modes" },
];

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

export default function HomeScreen({
  players,
  hostProfile,
  hostGetsScore,
  selectedGroup,
  launchMessage,
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
  modeOptions,
  onOpenModeHub,
  onOpenMode,
  onStartGroupQuiz,
  onStartMainShow,
}) {
  const [carouselModeIndex, setCarouselModeIndex] = useState(0);
  const [selectedModeIndex, setSelectedModeIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [openEmojiMenuFor, setOpenEmojiMenuFor] = useState(null);
  const [backgroundSet, setBackgroundSet] = useState(() => pickRandomBackgroundSet());
  const [modeDifficulties, setModeDifficulties] = useState(() =>
    Object.fromEntries(modeOptions.map((mode) => [mode.id, getDifficultyOptionsForMode(mode.id)[0]])),
  );
  const previewMode = modeOptions[carouselModeIndex] ?? modeOptions[0];
  const activeMode = modeOptions[selectedModeIndex] ?? modeOptions[0];
  const canLaunchActiveMode = activeMode && !activeMode.comingSoon;
  const isPreviewModeSelected = previewMode?.id === activeMode?.id;
  const activeDifficultyOptions = getDifficultyOptionsForMode(activeMode?.id);
  const activeDifficulty =
    (activeMode?.id ? modeDifficulties[activeMode.id] : null) ?? activeDifficultyOptions[0];
  const lineupPlayers = [hostProfile, ...players];
  const playerSlotCount = Math.max(7, lineupPlayers.length + 1);
  const playerSlots = Array.from({ length: playerSlotCount }, (_, index) => lineupPlayers[index] ?? null);
  const launchActiveMode = () => {
    if (!activeMode || activeMode.comingSoon) return;

    if (activeMode.id === "main-game") {
      onStartMainShow();
      return;
    }

    onOpenMode(activeMode.id);
  };
  const launchButtonLabel = activeMode?.comingSoon
    ? `${activeMode.title} Coming Soon`
    : `Launch ${activeMode?.title ?? "Selected Game"}`;
  const currentPlayersLabel = `Current Players: ${lineupPlayers.length}`;
  const formatLabel = teamsEnabled ? `${teams.length} teams` : "Free-for-all";

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setBackgroundSet(pickRandomBackgroundSet());
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, []);

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
    if (!activeMode?.id) return;

    setModeDifficulties((currentValues) => ({
      ...currentValues,
      [activeMode.id]: option,
    }));
  }

  function handleTeamCountSelect(count) {
    onTeamCountChange(String(count));
    setIsTeamMenuOpen(false);
  }

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
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
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
                  <h1>Kpop Quiz Games</h1>
                </div>

                <div className="hero-lineup-panel" id="party-lineup">
                  <div className="hero-lineup-header">
                    <div className="hero-lineup-title">
                      <h2>Party lineup</h2>
                    </div>
                    <span className="player-count">{currentPlayersLabel}</span>
                  </div>

                <div className="hero-lineup-grid">
                  {teamsEnabled ? (
                    <div className="hero-team-name-grid">
                      {teams.map((team) => (
                        <label className="hero-team-name-card" key={team.id}>
                          <span className="panel-label">Team name</span>
                          <input
                            className="player-text-input hero-team-name-input"
                            type="text"
                            value={team.name}
                            onChange={(event) => onTeamRename(team.id, event.target.value)}
                          />
                        </label>
                      ))}
                    </div>
                  ) : null}

                  {playerSlots.slice(0, 7).map((player, index) =>
                      player ? (
                        <div
                          className={`hero-lineup-chip ${player.id === hostProfile.id ? "is-host" : ""}`}
                          key={player.id}
                        >
                          <span className="hero-lineup-icon">{player.icon}</span>
                          <div>
                            <strong>{player.name}</strong>
                            {getPlayerSubtitle(player) ? <p>{getPlayerSubtitle(player)}</p> : null}
                          </div>
                        </div>
                      ) : (
                        <div className="hero-lineup-chip is-empty" key={`hero-empty-${index}`}>
                          <span className="hero-lineup-icon">+</span>
                          <div>
                            <strong>Open slot</strong>
                            <p>Add a player</p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="hero-actions">
                    <button
                      className="primary-button"
                      disabled={!canLaunchActiveMode}
                      onClick={launchActiveMode}
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
                    <p className="panel-label">Party setup</p>
                    <h2>Build your game night</h2>
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
                    <div className={`player-team-slot ${teamsEnabled ? "is-visible" : ""}`}>
                      <select
                        className="player-select-input"
                        disabled={!teamsEnabled}
                        tabIndex={teamsEnabled ? 0 : -1}
                        value={newPlayerTeamId}
                        onChange={(event) => onNewPlayerTeamChange(event.target.value)}
                      >
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      aria-label="Add player"
                      className="primary-button player-add-button"
                      type="submit"
                    >
                      Add
                    </button>
                  </div>
                </form>

                <div className="party-settings-grid">
                  <div className="party-setting-card">
                    <p className="panel-label">Selected game</p>
                    <strong>{activeMode?.title ?? "No game selected"}</strong>
                  </div>
                </div>

                <div className="party-controls-panel">
                  <div className="party-control-group">
                    <span className="panel-label">Game setup</span>
                    <div className="party-inline-actions">
                      <button className="ghost-button party-chip-button" onClick={onOpenModeHub} type="button">
                        All games
                      </button>
                      <button
                        className="ghost-button party-chip-button"
                        onClick={() => window.location.hash = "#modes"}
                        type="button"
                      >
                        Carousel
                      </button>
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
                  Let the cards cycle, tap the one you want, and set the next game
                  before launching it from the party lineup above.
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
                <div className="mode-current-pick">
                  <span className="mode-current-pill">Selected now</span>
                  <strong>{activeMode.title}</strong>
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
                    autoplay
                    autoplayDelay={5000}
                    baseWidth={280}
                    isPaused={isCarouselHovered}
                    items={modeOptions}
                    loop
                    selectedIndex={selectedModeIndex}
                    onSelect={setCarouselModeIndex}
                    pauseOnHover
                    round={false}
                  />
                </div>

                <div className="mode-play-row">
                  <button className="ghost-button" onClick={onOpenModeHub} type="button">
                    View all games
                  </button>
                  <button
                    className="primary-button"
                    disabled={!previewMode || previewMode.comingSoon || isPreviewModeSelected}
                    onClick={() => setSelectedModeIndex(carouselModeIndex)}
                    type="button"
                  >
                    {previewMode?.comingSoon
                      ? "Coming Soon"
                      : isPreviewModeSelected
                        ? `${previewMode.title} Selected`
                        : `Select ${previewMode?.title ?? "Game"}`}
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
                  <p className="panel-label">Party lineup</p>
                  <h2>Player lineup</h2>
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

                      {teamsEnabled ? (
                        <div className="lineup-control-group">
                          <label className="lineup-control">
                            <span>Team</span>
                            <select
                              className="player-select-input"
                              value={player.teamId ?? teams[0]?.id ?? ""}
                              onChange={(event) =>
                                player.id === hostProfile.id
                                  ? onHostUpdate({ teamId: event.target.value })
                                  : onPlayerUpdate(player.id, { teamId: event.target.value })
                              }
                            >
                              {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                  {team.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      ) : null}

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
            <div className="section-heading">
              <p className="section-kicker">Group-specific quizzes</p>
            </div>

            <div className="group-showcase">
              <div className="group-feature-card">
                <p className="panel-label">Selected group</p>
                <h3>{selectedGroup.label}</h3>
                <p>{selectedGroup.description}</p>
                <button
                  className="group-start-button"
                  onClick={() => onStartGroupQuiz(selectedGroup)}
                  type="button"
                >
                  Select {selectedGroup.label}
                </button>
                {launchMessage ? <p className="group-launch-note">{launchMessage}</p> : null}
              </div>

              <AnimatedList
                items={groupQuizzes}
                onItemSelect={(item) => onStartGroupQuiz(item)}
                showGradients
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
