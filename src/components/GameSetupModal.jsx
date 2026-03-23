import AnimatedContent from "./AnimatedContent";

export default function GameSetupModal({
  isOpen,
  players,
  hostId,
  hostGetsScore,
  playerName,
  desiredPlayerCount,
  onClose,
  onPlayerNameChange,
  onDesiredPlayerCountChange,
  onAddPlayer,
  onRemovePlayer,
  onHostChange,
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
              <label className="setup-label" htmlFor="hostSelect">
                Who is the host?
              </label>
              <select
                id="hostSelect"
                className="setup-input"
                value={hostId ?? ""}
                onChange={(event) => onHostChange(Number(event.target.value))}
              >
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>

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
                const isHost = player.id === hostId;

                return (
                  <div className="setup-player-row" key={player.id}>
                    <div>
                      <strong>{player.name}</strong>
                      <p>
                        {isHost
                          ? hostGetsScore
                            ? "Host and scoring"
                            : "Host only"
                          : "Player"}
                      </p>
                    </div>
                    <button
                      className="ghost-button"
                      disabled={players.length <= 1}
                      onClick={() => onRemovePlayer(player.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </AnimatedContent>
    </div>
  );
}
