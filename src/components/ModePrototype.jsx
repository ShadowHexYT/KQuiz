import { useMemo, useState } from "react";
import AnimatedContent from "./AnimatedContent";
import StaggeredMenu from "./StaggeredMenu";
import { getGameModeById } from "../data/gameModeCatalog";

const stageOrder = ["setup", "live", "reveal", "results"];

const stageLabels = {
  setup: "Setup room",
  live: "Play round",
  reveal: "Reveal answer",
  results: "Show results",
};

function renderPreviewSurface(mode, stage) {
  switch (mode.layoutType) {
    case "board":
      return (
        <div className="mode-preview-board">
          {["Debut Songs", "Lyrics", "Lightsticks", "Company Lore"].map((category) => (
            <div className="mode-preview-board-column" key={category}>
              <strong>{category}</strong>
              {[100, 200, 300, 400].map((value) => (
                <span className="mode-preview-board-tile" key={`${category}-${value}`}>
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    case "wheel":
      return (
        <div className="mode-preview-wheel-shell">
          <div className="mode-preview-wheel">
            <span>500</span>
            <span>Hint</span>
            <span>Bankrupt</span>
            <span>800</span>
          </div>
          <div className="mode-preview-puzzle">_ _ _ _   _ _   _ _ _ _ _ _</div>
        </div>
      );
    case "audio":
      return (
        <div className="mode-preview-audio">
          <div className="mode-preview-wave">
            {Array.from({ length: 22 }, (_, index) => (
              <span key={index} style={{ height: `${20 + ((index * 17) % 70)}px` }} />
            ))}
          </div>
          <div className="mode-preview-caption">
            {stage === "reveal" ? "Answer revealed and clip metadata shown" : "Audio clip waiting for host play"}
          </div>
        </div>
      );
    case "visual":
      return (
        <div className="mode-preview-visual">
          <div className={`mode-preview-image ${stage === "reveal" ? "is-clear" : ""}`} />
          <div className="mode-preview-caption">
            {stage === "live" ? "Blur, crop, or screenshot reveal in progress" : "Visual answer panel"}
          </div>
        </div>
      );
    case "emoji":
      return <div className="mode-preview-emoji">🌙 💘 🎤 ✨</div>;
    case "dance":
      return (
        <div className="mode-preview-dance">
          <div className="mode-preview-dancer" />
          <div className="mode-preview-caption">Dance confirm lane with host scoring panel</div>
        </div>
      );
    case "quote":
      return <div className="mode-preview-quote">"Iconic line here..."</div>;
    case "roulette":
      return (
        <div className="mode-preview-roulette">
          <div className="mode-preview-wheel mini" />
          <div className="mode-preview-caption">Random idol + challenge card</div>
        </div>
      );
    case "battle":
      return (
        <div className="mode-preview-battle">
          <div className="mode-battle-lane">
            <strong>Team A</strong>
            <span>Attack ready</span>
          </div>
          <div className="mode-battle-lane">
            <strong>Team B</strong>
            <span>Defense phase</span>
          </div>
        </div>
      );
    case "survival":
      return (
        <div className="mode-preview-survival">
          {["Hunter", "Player 2", "Player 3", "Player 4"].map((name, index) => (
            <div className={`mode-survival-chip ${index === 3 ? "is-out" : ""}`} key={name}>
              {name}
            </div>
          ))}
        </div>
      );
    case "mystery":
      return (
        <div className="mode-preview-mystery">
          <div className="mode-mystery-box">?</div>
          <div className="mode-preview-caption">Wildcard challenge reveal</div>
        </div>
      );
    case "chart":
      return (
        <div className="mode-preview-chart">
          {["A", "B", "C", "D", "E"].map((item, index) => (
            <div className="mode-chart-row" key={item}>
              <span>{item}</span>
              <div style={{ width: `${24 + index * 12}%` }} />
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className="mode-preview-showcase">
          <div className="mode-preview-card">
            <strong>Prompt area</strong>
            <p>Primary game canvas for {mode.title}</p>
          </div>
          <div className="mode-preview-card">
            <strong>Reveal area</strong>
            <p>Host feedback, answer states, and scoring controls</p>
          </div>
        </div>
      );
  }
}

export default function ModePrototype({ modeId, onBackHome, onOpenModeHub }) {
  const [activeStage, setActiveStage] = useState("setup");
  const mode = useMemo(() => getGameModeById(modeId), [modeId]);

  if (!mode) {
    return (
      <div className="page-shell">
        <main className="app-frame">
          <section className="game-show-hero">
            <div>
              <p className="eyebrow">Mode missing</p>
              <h1>This blueprint was not found.</h1>
            </div>
            <div className="mode-hub-actions">
              <button className="ghost-button" onClick={onBackHome} type="button">
                Back home
              </button>
              <button className="primary-button" onClick={onOpenModeHub} type="button">
                Open mode hub
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  function moveStage(direction) {
    const currentIndex = stageOrder.indexOf(activeStage);
    const nextIndex = (currentIndex + direction + stageOrder.length) % stageOrder.length;
    setActiveStage(stageOrder[nextIndex]);
  }

  return (
    <div className="page-shell" id="top">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <StaggeredMenu
        position="right"
        items={[
          { label: "Home", ariaLabel: "Return home", link: "#top" },
          { label: "Preview", ariaLabel: "Jump to preview", link: "#mode-preview" },
          { label: "Controls", ariaLabel: "Jump to controls", link: "#mode-controls" },
          { label: "Mode Hub", ariaLabel: "Open all mode blueprints", onClick: onOpenModeHub },
          { label: "Next Phase", ariaLabel: "Advance preview phase", onClick: () => moveStage(1) },
        ]}
        socialItems={[
          { label: "Mode Hub", onClick: onOpenModeHub },
          { label: "Flow", link: "#mode-controls" },
          { label: "Preview", link: "#mode-preview" },
          { label: "Back Home", onClick: onBackHome },
          { label: "Previous Phase", onClick: () => moveStage(-1) },
        ]}
        itemSectionLabel="Mode shell"
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
          duration={0.72}
          ease="cubic-bezier(0.22, 1, 0.36, 1)"
          initialOpacity={0}
          animateOpacity
          scale={0.99}
          threshold={0.1}
          delay={0}
        >
          <section className="game-show-hero mode-shell-hero">
            <div>
              <p className="eyebrow">{mode.category} blueprint</p>
              <h1>{mode.title}</h1>
              <p className="hero-text">{mode.description}</p>
            </div>

            <div className="mode-hub-actions">
              <button className="ghost-button" onClick={onOpenModeHub} type="button">
                All mode blueprints
              </button>
              <button className="ghost-button" onClick={onBackHome} type="button">
                Back home
              </button>
            </div>
          </section>
        </AnimatedContent>

        <section className="mode-shell-layout">
          <AnimatedContent
            distance={70}
            direction="vertical"
            reverse={false}
            duration={0.74}
            ease="cubic-bezier(0.22, 1, 0.36, 1)"
            initialOpacity={0}
            animateOpacity
            scale={0.99}
            threshold={0.1}
            delay={0.05}
          >
            <section className="mode-preview-panel" id="mode-preview">
              <div className="mode-preview-header">
                <div>
                  <p className="panel-label">Live shell</p>
                  <h2>{stageLabels[activeStage]}</h2>
                </div>
                <span className="player-count">{mode.playerFormat}</span>
              </div>

              <div className="mode-stage-tabs">
                {stageOrder.map((stage) => (
                  <button
                    className={`ghost-button mode-stage-tab ${activeStage === stage ? "is-active" : ""}`}
                    key={stage}
                    onClick={() => setActiveStage(stage)}
                    type="button"
                  >
                    {stageLabels[stage]}
                  </button>
                ))}
              </div>

              <div className="mode-preview-surface">
                {renderPreviewSurface(mode, activeStage)}
              </div>

              <div className="image-action-bar">
                <button className="ghost-button" onClick={() => moveStage(-1)} type="button">
                  Previous phase
                </button>
                <button className="primary-button" onClick={() => moveStage(1)} type="button">
                  Next phase
                </button>
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
            delay={0.09}
          >
            <aside className="mode-shell-sidebar" id="mode-controls">
              <div className="mode-detail-card">
                <p className="panel-label">Mode flow</p>
                {mode.flow.map((item, index) => (
                  <div className="mode-flow-step compact" key={item}>
                    <span>{index + 1}</span>
                    <strong>{item}</strong>
                  </div>
                ))}
              </div>

              <div className="mode-detail-card">
                <p className="panel-label">Setup options</p>
                <div className="mode-field-list">
                  {mode.setupOptions.map((item) => (
                    <span className="mode-field-chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mode-detail-card">
                <p className="panel-label">Host tools</p>
                <div className="mode-host-tool-list">
                  {mode.hostTools.map((item) => (
                    <div className="inline-score-row" key={item}>
                      <strong>{item}</strong>
                      <span className="results-status is-missed">ready</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mode-detail-card">
                <p className="panel-label">Shared content model</p>
                <div className="mode-field-list">
                  {mode.dataFields.map((field) => (
                    <span className="mode-field-chip" key={field}>
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </AnimatedContent>
        </section>
      </main>
    </div>
  );
}
