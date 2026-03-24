import { useState } from "react";
import { HOST_ID } from "../App";
import AnimatedContent from "./AnimatedContent";
import AnimatedList from "./AnimatedList";
import Carousel from "./Carousel";
import StaggeredMenu from "./StaggeredMenu";

const groupQuizzes = [
  {
    label: "BLACKPINK",
    description: "Music videos, solos, fashion moments, and major live stages.",
  },
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
    label: "Kiss of Life",
    description: "Performance charisma, member trivia, and recent comeback questions.",
  },
];

const menuItems = [
  { label: "Home", ariaLabel: "Jump to the top of the page", link: "#top" },
  { label: "Setup", ariaLabel: "Jump to the player setup area", link: "#top" },
  { label: "Main Modes", ariaLabel: "Jump to main quiz modes", link: "#modes" },
  { label: "Groups", ariaLabel: "Jump to group specific quizzes", link: "#groups" },
];

const socialItems = [
  { label: "Host View", link: "#top" },
  { label: "Random Group", link: "#groups" },
  { label: "Top Modes", link: "#modes" },
];

const mainModes = [
  {
    id: "main-game",
    title: "Main Game",
    description:
      "The new gameshow route with member photos, group guesses, favorite songs, bias picks, and manual host scoring.",
    actionLabel: "Open gameshow",
  },
  {
    id: "jeopardy",
    title: "Jeopardy",
    description:
      "A future board-style game mode with categories, point values, and host-led reveals.",
    actionLabel: "Coming soon",
  },
  {
    id: "wheel-of-fortune",
    title: "Wheel of Fortune",
    description:
      "A future spin-based game mode for themed categories, puzzles, and bonus rounds.",
    actionLabel: "Coming soon",
  },
  {
    id: "song-guessing",
    title: "Song Guessing",
    description:
      "A future song-identification mode for intros, choruses, and title recognition.",
    actionLabel: "Coming soon",
  },
];

export default function HomeScreen({
  players,
  hostProfile,
  hostGetsScore,
  selectedGroup,
  launchMessage,
  playerName,
  teams,
  teamsEnabled,
  newPlayerTeamId,
  playerIcons,
  onHostGetsScoreChange,
  onAddPlayer,
  onRemovePlayer,
  onPlayerNameChange,
  onNewPlayerTeamChange,
  onPlayerUpdate,
  onHostUpdate,
  onAssignPlayerAsHost,
  onRestoreDefaultHost,
  onTeamCountChange,
  onTeamRename,
  onTeamsEnabledChange,
  onStartGroupQuiz,
  onStartMainShow,
}) {
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [openEmojiMenuFor, setOpenEmojiMenuFor] = useState(null);
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const activeMode = mainModes[activeModeIndex] ?? mainModes[0];
  const lineupPlayers = [hostProfile, ...players];
  const playerSlotCount = Math.max(6, lineupPlayers.length + 1);
  const playerSlots = Array.from({ length: playerSlotCount }, (_, index) => lineupPlayers[index] ?? null);

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
    if (!isEnabled) {
      setIsTeamMenuOpen(false);
    }
  }

  function handleTeamCountSelect(count) {
    onTeamCountChange(String(count));
    setIsTeamMenuOpen(false);
  }

  return (
    <div className="page-shell" id="top">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
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
        <section className="hero-showcase">
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
            <section className="hero-card">
              <div className="hero-copy">
                <p className="eyebrow">Family K-pop game night</p>
                <h1>KPOP Quiz Studio</h1>
                <p className="hero-text">
                  The main gameshow is now the headline experience with group rounds,
                  manual host scoring, and a dedicated route.
                </p>

                <div className="hero-badges">
                  <span>Main gameshow ready</span>
                  <span>Host controls</span>
                  <span>Cross-platform React</span>
                </div>

                <div className="hero-actions">
                  <button className="primary-button" onClick={onStartMainShow} type="button">
                    Start Main Gameshow
                  </button>
                </div>
              </div>
            </section>
          </AnimatedContent>

          <AnimatedContent
            distance={100}
            direction="vertical"
            reverse
            duration={0.9}
            ease="cubic-bezier(0.22, 1, 0.36, 1)"
            initialOpacity={0}
            animateOpacity
            scale={0.98}
            threshold={0.1}
            delay={0.12}
          >
            <aside className="host-panel host-panel-compact">
              <div className="host-panel-header">
                <div>
                  <p className="panel-label">Players</p>
                  <h2>Party setup</h2>
                </div>
                <span className="player-count">{players.length} joined</span>
              </div>

              <form className="player-form" onSubmit={onAddPlayer}>
                <label htmlFor="playerName">Add player</label>
                <div className="player-form-stack">
                  <input
                    className="player-text-input"
                    id="playerName"
                    type="text"
                    placeholder="Enter a name"
                    value={playerName}
                    onChange={(event) => onPlayerNameChange(event.target.value)}
                  />
                  {teamsEnabled ? (
                    <select
                      className="player-select-input"
                      value={newPlayerTeamId}
                      onChange={(event) => onNewPlayerTeamChange(event.target.value)}
                    >
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  <button className="primary-button" type="submit">
                    Add player
                  </button>
                </div>
              </form>

              <div className="team-structure-card">
                <div className="team-structure-header">
                  <div>
                    <label className="setup-inline-label" htmlFor="teamsEnabled">
                      Teams
                    </label>
                    <p className="setup-help">Turn teams on when you want grouped play.</p>
                  </div>
                  <label className="toggle-row compact-toggle toggle-card">
                    <input
                      id="teamsEnabled"
                      checked={teamsEnabled}
                      type="checkbox"
                      onChange={(event) => handleTeamsEnabledChange(event.target.checked)}
                    />
                    <span className={`toggle-switch ${teamsEnabled ? "is-active" : ""}`} aria-hidden="true">
                      <span className="toggle-knob" />
                    </span>
                  </label>
                </div>

                {teamsEnabled ? (
                  <div className="team-dropdown-wrap">
                    <button
                      aria-expanded={isTeamMenuOpen}
                      className="team-dropdown-trigger"
                      onClick={() => setIsTeamMenuOpen((currentValue) => !currentValue)}
                      type="button"
                    >
                      <span>Team structure</span>
                      <strong>{teams.length} {teams.length === 1 ? "team" : "teams"}</strong>
                    </button>

                    {isTeamMenuOpen ? (
                      <div className="team-dropdown-menu">
                        {[1, 2, 3, 4].map((count) => (
                          <button
                            className={`team-dropdown-option ${teams.length === count ? "is-active" : ""}`}
                            key={count}
                            onClick={() => handleTeamCountSelect(count)}
                            type="button"
                          >
                            {count} {count === 1 ? "team" : "teams"}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </aside>
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
          <section className="party-setup-section">
            <aside className="player-slots-panel player-lineup-wide">
              <div className="host-panel-header">
                <div>
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
          delay={0.1}
        >
          <section className="mode-section" id="modes">
            <div className="mode-layout">
              <aside className="mode-instructions-card">
                <p className="panel-label">How to start</p>
                <h2>Choose your game mode</h2>
                <p className="mode-instructions-text">
                  Let the cards cycle, tap the one you want, and look for the
                  selected check before pressing play.
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
                    <span>Press play below the carousel to launch that mode.</span>
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
                    activeIndex={activeModeIndex}
                    autoplay
                    autoplayDelay={5000}
                    baseWidth={280}
                    isPaused={isCarouselHovered}
                    items={mainModes}
                    loop
                    onSelect={setActiveModeIndex}
                    pauseOnHover
                    round={false}
                  />
                </div>

                <div className="mode-play-row">
                  <button
                    className="primary-button"
                    onClick={activeMode.id === "main-game" ? onStartMainShow : undefined}
                    type="button"
                  >
                    {activeMode.id === "main-game" ? "Play" : "Coming Soon"}
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
          delay={0.15}
        >
          <section className="group-section" id="groups">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Bottom category</p>
                <h2>Group-specific quizzes</h2>
                <p className="section-note">
                  Group-specific quizzes still live here while the main show handles
                  the headline experience.
                </p>
              </div>
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
                  Start {selectedGroup.label} Quiz
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
