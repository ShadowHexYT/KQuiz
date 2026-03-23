import AnimatedContent from "./AnimatedContent";

export default function GameSetupModal({
  isOpen,
  players,
  hostProfile,
  hostGetsScore,
  playerName,
  desiredPlayerCount,
  onClose,
  onPlayerNameChange,
  onDesiredPlayerCountChange,
  onAddPlayer,
  onRemovePlayer,
  onHostGetsScoreChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <AnimatedContent
        distance={40}
        direction="vertical"
        reverse={false}
        duration={0.4}
        ease="cubic-bezier(0.22, 1, 0.36, 1)"
        initialOpacity={0}
        animateOpacity
        scale={0.98}
        threshold={0}
        delay={0}
      >
        <section
          className="setup-modal"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="setup-title"
        >
          <div className="setup-header">
            <div>
              <p className="panel-label">Main gameshow</p>
              <h2 id="setup-title">Game setup</h2>
            </div>
            <button className="ghost-button" onClick={onClose} type="button">
              Close
            </button>
          </div>

          <div className="setup-grid">
            <div className="setup-card">
              <label className="setup-label" htmlFor="playerCount">
                How many people are playing?
              </label>
              <input
                id="playerCount"
                className="setup-input"
                min="1"
                type="number"
                value={desiredPlayerCount}
                onChange={(event) => onDesiredPlayerCountChange(event.target.value)}
              />
              <p className="setup-help">
                This number updates as you add or remove players.
              </p>
            </div>

            <div className="setup-card">
              <label className="setup-label">Who is the host?</label>
              <div className="setup-input host-fixed-input">
                {hostProfile.icon} {hostProfile.name}
              </div>

              <label className="toggle-row">
                <input
                  checked={hostGetsScore}
                  type="checkbox"
                  onChange={(event) => onHostGetsScoreChange(event.target.checked)}
                />
                <span>Host gets score</span>
              </label>
            </div>
          </div>

          <div className="setup-card">
            <form className="setup-player-form" onSubmit={onAddPlayer}>
              <div>
                <label className="setup-label" htmlFor="newPlayer">
                  Add player
                </label>
                <input
                  id="newPlayer"
                  className="setup-input"
                  placeholder="Enter player name"
                  type="text"
                  value={playerName}
                  onChange={(event) => onPlayerNameChange(event.target.value)}
                />
              </div>
              <button className="primary-button" type="submit">
                Add player
              </button>
            </form>

            <div className="setup-player-list">
              {players.map((player) => {
                return (
                  <div className="setup-player-row" key={player.id}>
                    <div>
                      <strong>
                        {player.icon ? `${player.icon} ` : ""}
                        {player.name}
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
                );
              })}
              <div className="setup-player-row setup-host-row">
                <div>
                  <strong>
                    {hostProfile.icon} {hostProfile.name}
                  </strong>
                  <p>{hostGetsScore ? "Host and scoring" : "Host only"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedContent>
    </div>
  );
}
