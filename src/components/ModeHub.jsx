import { useMemo, useState } from "react";
import AnimatedContent from "./AnimatedContent";
import StaggeredMenu from "./StaggeredMenu";
import { gameModes } from "../data/gameModeCatalog";

const filters = ["All", "Board", "Audio", "Visual", "Party", "Battle", "Lore"];

const menuItems = [
  { label: "Home", ariaLabel: "Return home", link: "#top" },
  { label: "Games", ariaLabel: "Jump to game cards", link: "#mode-grid" },
  { label: "Open Selected", ariaLabel: "Open the selected game", onClick: () => {} },
];

const socialItems = [
  { label: "Back Home", onClick: () => {} },
  { label: "All Games", link: "#mode-grid" },
  { label: "Launch Game", onClick: () => {} },
];

export default function ModeHub({ onBackHome, onOpenMode }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedModeId, setSelectedModeId] = useState(gameModes[0]?.id ?? null);

  const visibleModes = useMemo(() => {
    if (activeFilter === "All") return gameModes;
    return gameModes.filter((mode) => mode.category === activeFilter);
  }, [activeFilter]);

  const selectedMode =
    visibleModes.find((mode) => mode.id === selectedModeId) ??
    gameModes.find((mode) => mode.id === selectedModeId) ??
    visibleModes[0] ??
    gameModes[0];

  function handleSelectMode(mode) {
    setSelectedModeId(mode.id);
  }

  const resolvedMenuItems = menuItems.map((item) =>
    item.label === "Open Selected"
      ? {
          ...item,
          onClick: () =>
            selectedMode && !selectedMode.comingSoon ? onOpenMode(selectedMode.id) : undefined,
        }
      : item,
  );

  const resolvedSocialItems = socialItems.map((item) => {
    if (item.label === "Back Home") return { ...item, onClick: onBackHome };
    if (item.label === "Launch Game") {
      return {
        ...item,
        onClick: () =>
          selectedMode && !selectedMode.comingSoon ? onOpenMode(selectedMode.id) : undefined,
      };
    }
    return item;
  });

  return (
    <div className="page-shell" id="top">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <StaggeredMenu
        position="right"
        items={resolvedMenuItems}
        socialItems={resolvedSocialItems}
        itemSectionLabel="Game hub"
        socialSectionLabel="Jump links"
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
          duration={0.7}
          ease="cubic-bezier(0.22, 1, 0.36, 1)"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.1}
          delay={0}
        >
          <section className="game-show-hero mode-hub-hero">
            <div>
              <p className="eyebrow">Game gallery</p>
              <h1>K-pop Games</h1>
              <p className="hero-text">
                A cleaner launch view for every game in the app. Pick the one you want and jump straight in.
              </p>
            </div>

            <div className="mode-hub-actions">
              <button className="ghost-button" onClick={onBackHome} type="button">
                Back home
              </button>
              {selectedMode ? (
                <button
                  className="primary-button"
                  disabled={selectedMode.comingSoon}
                  onClick={() => onOpenMode(selectedMode.id)}
                  type="button"
                >
                  {selectedMode.comingSoon ? `${selectedMode.title} Coming Soon` : `Play Game ${selectedMode.title}`}
                </button>
              ) : null}
            </div>
          </section>
        </AnimatedContent>

        <AnimatedContent
          distance={70}
          direction="vertical"
          reverse={false}
          duration={0.76}
          ease="cubic-bezier(0.22, 1, 0.36, 1)"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.1}
          delay={0.08}
        >
          <section className="mode-grid-panel mode-grid-panel-wide" id="mode-grid">
            <div className="mode-grid-header">
              <div>
                <p className="panel-label">All games</p>
                <h2>Select a game</h2>
              </div>
              <div className="mode-filter-row">
                {filters.map((filter) => (
                  <button
                    className={`ghost-button mode-filter-chip ${activeFilter === filter ? "is-active" : ""}`}
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    type="button"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mode-grid-cards">
              {visibleModes.map((mode) => (
                <article
                  className={`mode-grid-card ${selectedMode?.id === mode.id ? "is-selected" : ""}`}
                  key={mode.id}
                >
                  <button
                    className="mode-grid-card-button"
                    onClick={() => handleSelectMode(mode)}
                    type="button"
                  >
                    <p className="panel-label">{mode.comingSoon ? `${mode.category} • Coming soon` : mode.category}</p>
                    <h3>{mode.title}</h3>
                    <p>{mode.tagline}</p>
                  </button>

                  <div className="mode-grid-card-footer">
                    <button
                      className="primary-button"
                      disabled={mode.comingSoon}
                      onClick={() => onOpenMode(mode.id)}
                      type="button"
                    >
                      {mode.comingSoon ? "Coming Soon" : "Play Game"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </AnimatedContent>
      </main>
    </div>
  );
}
