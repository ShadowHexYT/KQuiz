import AnimatedContent from "./AnimatedContent";
import AnimatedList from "./AnimatedList";
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
    id: "speed-rounds",
    title: "Speed Rounds",
    description:
      "Reserved for a faster challenge mode with quick prompts, timers, and score tracking.",
    actionLabel: "Coming soon",
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
  hostId,
  selectedGroup,
  launchMessage,
  playerName,
  onHostChange,
  onAddPlayer,
  onPlayerNameChange,
  onStartGroupQuiz,
  onStartMainShow,
}) {
  const [activeModeId, setActiveModeId] = useState(mainModes[0].id);
  const activeMode = mainModes.find((mode) => mode.id === activeModeId) ?? mainModes[0];

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
        <section className="hero-card">
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

              <div className="host-select-wrap">
                <label htmlFor="hostSelectHome">Current host</label>
                <select
                  id="hostSelectHome"
                  value={hostId ?? ""}
                  onChange={(event) => onHostChange(Number(event.target.value))}
                >
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
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
          delay={0.1}
        >
          <section className="mode-section" id="modes">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Featured area</p>
                <h2>Main quiz modes</h2>
              </div>
              <p className="section-note">
                Pick a mode tab here. The main gameshow is active now, and the others
                are ready as placeholders for later.
              </p>
            </div>

            <div className="mode-tabs">
              {mainModes.map((mode) => (
                <button
                  key={mode.id}
                  className={`mode-tab ${mode.id === activeModeId ? "is-active" : ""}`}
                  onClick={() => setActiveModeId(mode.id)}
                  type="button"
                >
                  {mode.title}
                </button>
              ))}
            </div>

            <article className="mode-feature-card">
              <p className="mode-label">Selected mode</p>
              <h3>{activeMode.title}</h3>
              <p>{activeMode.description}</p>
              {activeMode.id === "main-game" ? (
                <button className="primary-button" onClick={onStartMainShow} type="button">
                  {activeMode.actionLabel}
                </button>
              ) : (
                <span className="mode-coming-soon">{activeMode.actionLabel}</span>
              )}
            </article>
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
