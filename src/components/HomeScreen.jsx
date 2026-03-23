import AnimatedContent from "./AnimatedContent";
import AnimatedList from "./AnimatedList";
import Carousel from "./Carousel";
import StaggeredMenu from "./StaggeredMenu";
import { useState } from "react";

const groupQuizzes = [
  {
    label: "BTS",
    description: "Hits, eras, members, and iconic performance moments.",
  },
  {
    label: "BLACKPINK",
    description: "Music videos, solos, fashion moments, and major live stages.",
  },
  {
    label: "TWICE",
    description: "Title tracks, choreography highlights, and member trivia.",
  },
  {
    label: "Stray Kids",
    description: "Unit songs, album eras, rap lines, and performance energy.",
  },
  {
    label: "SEVENTEEN",
    description: "Subunits, variety moments, choreo details, and discography.",
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
    label: "ATEEZ",
    description: "Stage power, lore-inspired questions, and song intros.",
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
  playerIcon,
  playerIcons,
  onHostGetsScoreChange,
  onAddPlayer,
  onRemovePlayer,
  onPlayerIconChange,
  onPlayerNameChange,
  onStartGroupQuiz,
  onStartMainShow,
}) {
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const activeMode = mainModes[activeModeIndex] ?? mainModes[0];
  const playerSlotCount = Math.max(6, players.length + 2);
  const playerSlots = Array.from({ length: playerSlotCount }, (_, index) => players[index] ?? null);

  return (
    <div className="page-shell" id="top">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
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
            <aside className="player-slots-panel">
              <div className="host-panel-header">
                <div>
                  <p className="panel-label">Players</p>
                  <h2>Player lineup</h2>
                </div>
                <span className="player-count">{players.length} joined</span>
              </div>
              <div className="player-slot-grid">
                {playerSlots.map((player, index) =>
                  player ? (
                    <div className="player-slot-card is-filled" key={player.id}>
                      <span className="player-slot-icon">{player.icon}</span>
                      <strong>{player.name}</strong>
                      <p>Ready to play</p>
                    </div>
                  ) : (
                    <div className="player-slot-card is-empty" key={`empty-${index}`}>
                      <span className="player-slot-icon">+</span>
                      <strong>Empty player</strong>
                      <p>Add a player to fill this slot</p>
                    </div>
                  ),
                )}
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
            <aside className="host-panel">
              <div className="host-panel-header">
                <div>
                  <p className="panel-label">Players</p>
                  <h2>Party setup</h2>
                </div>
                <span className="player-count">{players.length} joined</span>
              </div>

              <form className="player-form" onSubmit={onAddPlayer}>
                <label htmlFor="playerName">Add player</label>
                <div className="player-form-row">
                  <input
                    id="playerName"
                    type="text"
                    placeholder="Enter a name"
                    value={playerName}
                    onChange={(event) => onPlayerNameChange(event.target.value)}
                  />
                  <button type="submit">Add</button>
                </div>
              </form>

              <div className="icon-picker-wrap">
                <label>Pick an icon</label>
                <div className="icon-picker-grid">
                  {playerIcons.map((icon) => (
                    <button
                      className={`icon-picker-button ${playerIcon === icon ? "is-active" : ""}`}
                      key={icon}
                      onClick={() => onPlayerIconChange(icon)}
                      type="button"
                    >
                      <span>{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="host-select-wrap">
                <label>Current host</label>
                <div className="host-fixed-card">
                  <div>
                    <strong>
                      {hostProfile.icon} {hostProfile.name}
                    </strong>
                    <p>Default host for the show</p>
                  </div>
                  <label className="toggle-row">
                    <input
                      checked={hostGetsScore}
                      type="checkbox"
                      onChange={(event) => onHostGetsScoreChange(event.target.checked)}
                    />
                    <span>Count Hunter as a player</span>
                  </label>
                </div>
              </div>

              <div className="setup-player-list home-player-list">
                {players.length ? (
                  players.map((player) => (
                    <div className="setup-player-row" key={player.id}>
                      <div>
                        <strong>
                          {player.icon} {player.name}
                        </strong>
                        <p>Player</p>
                      </div>
                      <button
                        className="ghost-button"
                        onClick={() => onRemovePlayer(player.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="setup-help">Add players manually to build your quiz group.</p>
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
              </div>
              <p className="section-note">
                Group-specific quizzes still live here while the main show handles
                the headline experience.
              </p>
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
