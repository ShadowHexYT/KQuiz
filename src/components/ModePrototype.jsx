import { useMemo } from "react";
import AnimatedContent from "./AnimatedContent";
import StaggeredMenu from "./StaggeredMenu";
import { getGameModeById } from "../data/gameModeCatalog";

const jeopardyCategories = [
  "Debut Songs",
  "Lyrics",
  "Albums",
  "Bias Trivia",
  "Lightsticks",
];

const jeopardyValues = [100, 200, 300, 400, 500];

function renderModeSurface(mode) {
  if (mode.id === "jeopardy") {
    return (
      <section className="jeopardy-screen">
        <div className="jeopardy-topbar">
          <p className="jeopardy-kicker">K-pop</p>
          <h1>K-pop Jeopardy</h1>
        </div>

        <div className="jeopardy-board">
          <div className="jeopardy-board-header">
            {jeopardyCategories.map((category) => (
              <div className="jeopardy-category" key={category}>
                {category}
              </div>
            ))}
          </div>

          <div className="jeopardy-board-grid">
            {jeopardyValues.flatMap((value) =>
              jeopardyCategories.map((category) => (
                <button
                  className="jeopardy-tile"
                  key={`${category}-${value}`}
                  type="button"
                >
                  {value}
                </button>
              )),
            )}
          </div>
        </div>
      </section>
    );
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

export default function ModePrototype({ modeId, onBackHome, onOpenModeHub }) {
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
            {renderModeSurface(mode)}
          </section>
        </AnimatedContent>
      </main>
    </div>
  );
}
