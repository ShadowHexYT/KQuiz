import { useMemo, useState } from "react";

const starterPlayers = [
  {
    id: 1,
    name: "You",
    scores: {
      allRounder: 0,
      speedRound: 0,
      lyricMatch: 0,
    },
  },
  {
    id: 2,
    name: "Sister",
    scores: {
      allRounder: 0,
      speedRound: 0,
      lyricMatch: 0,
    },
  },
  {
    id: 3,
    name: "Mom",
    scores: {
      allRounder: 0,
      speedRound: 0,
      lyricMatch: 0,
    },
  },
];

const mainModes = [
  {
    title: "All-in-One Quiz Night",
    label: "Main Mode",
    description:
      "Your big featured mode for the full K-pop experience. This is where the three quiz aspects will live later.",
    status: "UI ready for your custom quiz sections",
  },
  {
    title: "Speed Round",
    label: "Placeholder",
    description:
      "Reserved for a faster challenge mode with quick prompts, timers, and score tracking.",
    status: "Visual card only",
  },
  {
    title: "Lyrics + Audio Match",
    label: "Placeholder",
    description:
      "A future space for identifying songs, lyrics, intros, or audio-based K-pop questions.",
    status: "Visual card only",
  },
];

const groupQuizzes = [
  "BTS",
  "BLACKPINK",
  "TWICE",
  "Stray Kids",
  "SEVENTEEN",
  "NewJeans",
  "IVE",
  "ATEEZ",
];

function scoreTotal(scores) {
  return Object.values(scores).reduce((sum, value) => sum + value, 0);
}

export default function App() {
  const [players, setPlayers] = useState(starterPlayers);
  const [playerName, setPlayerName] = useState("");
  const [hostId, setHostId] = useState(starterPlayers[0]?.id ?? null);

  const sortedPlayers = useMemo(
    () =>
      [...players].sort((a, b) => {
        if (a.id === hostId) return -1;
        if (b.id === hostId) return 1;
        return scoreTotal(b.scores) - scoreTotal(a.scores);
      }),
    [players, hostId],
  );

  function addPlayer(event) {
    event.preventDefault();

    const trimmedName = playerName.trim();
    if (!trimmedName) return;

    setPlayers((currentPlayers) => [
      ...currentPlayers,
      {
        id: Date.now(),
        name: trimmedName,
        scores: {
          allRounder: 0,
          speedRound: 0,
          lyricMatch: 0,
        },
      },
    ]);
    setPlayerName("");
  }

  return (
    <div className="page-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <main className="app-frame">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Family K-pop game night</p>
            <h1>KPOP Quiz Studio</h1>
            <p className="hero-text">
              A playful home screen for your quiz nights with shared players,
              host controls, scoreboard snapshots, and dedicated group quiz
              categories.
            </p>

            <div className="hero-badges">
              <span>UI only</span>
              <span>Host ready</span>
              <span>Cross-platform React</span>
            </div>
          </div>

          <aside className="host-panel">
            <div className="host-panel-header">
              <div>
                <p className="panel-label">Players</p>
                <h2>Party setup</h2>
              </div>
              <span className="player-count">{players.length} joined</span>
            </div>

            <form className="player-form" onSubmit={addPlayer}>
              <label htmlFor="playerName">Add player</label>
              <div className="player-form-row">
                <input
                  id="playerName"
                  type="text"
                  placeholder="Enter a name"
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                />
                <button type="submit">Add</button>
              </div>
            </form>

            <div className="host-select-wrap">
              <label htmlFor="hostSelect">Current host</label>
              <select
                id="hostSelect"
                value={hostId ?? ""}
                onChange={(event) => setHostId(Number(event.target.value))}
              >
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          </aside>
        </section>

        <section className="scoreboard-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Top right controls + live overview</p>
              <h2>Players and scores</h2>
            </div>
            <p className="section-note">
              These score cards are visual placeholders for your future game
              modes.
            </p>
          </div>

          <div className="player-grid">
            {sortedPlayers.map((player) => {
              const isHost = player.id === hostId;

              return (
                <article
                  className={`player-card ${isHost ? "player-card-host" : ""}`}
                  key={player.id}
                >
                  <div className="player-card-top">
                    <div>
                      <p className="player-name">{player.name}</p>
                      <p className="player-role">
                        {isHost ? "Host controls enabled" : "Contestant"}
                      </p>
                    </div>
                    {isHost ? <span className="host-pill">Host</span> : null}
                  </div>

                  <div className="score-list">
                    <div>
                      <span>Main mode</span>
                      <strong>{player.scores.allRounder}</strong>
                    </div>
                    <div>
                      <span>Speed round</span>
                      <strong>{player.scores.speedRound}</strong>
                    </div>
                    <div>
                      <span>Lyrics match</span>
                      <strong>{player.scores.lyricMatch}</strong>
                    </div>
                  </div>

                  <div className="player-total">
                    <span>Total score</span>
                    <strong>{scoreTotal(player.scores)}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mode-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Featured area</p>
              <h2>Main quiz modes</h2>
            </div>
            <p className="section-note">
              Built as the front screen shell only, ready for your full quiz
              rules later.
            </p>
          </div>

          <div className="mode-grid">
            {mainModes.map((mode) => (
              <article className="mode-card" key={mode.title}>
                <span className="mode-label">{mode.label}</span>
                <h3>{mode.title}</h3>
                <p>{mode.description}</p>
                <footer>{mode.status}</footer>
              </article>
            ))}
          </div>
        </section>

        <section className="group-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Bottom category</p>
              <h2>Group-specific quizzes</h2>
            </div>
            <p className="section-note">
              Each tile is a dedicated category for focusing on one K-pop group.
            </p>
          </div>

          <div className="group-grid">
            {groupQuizzes.map((groupName) => (
              <button className="group-tile" key={groupName} type="button">
                <span className="group-tag">Group quiz</span>
                <strong>{groupName}</strong>
                <small>Open this group's dedicated quiz screen later</small>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
