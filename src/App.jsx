import { Suspense, lazy, useEffect, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import MainGameShow from "./components/MainGameShow";
import ModeHub from "./components/ModeHub";
import { gameModes } from "./data/gameModeCatalog";
import { createEmptyScores, GAME_SCORE_KEYS, normalizeScores } from "./data/scoreModel";

const ModePrototype = lazy(() => import("./components/ModePrototype"));

const starterPlayers = [];
const DEFAULT_TEAM_COUNT = 2;
export const HOST_ID = "hunter-host";
export const defaultHostProfile = {
  id: HOST_ID,
  name: "Hunter",
  icon: "🎙️",
  teamId: "team-1",
  scores: createEmptyScores(),
};
export const playerIcons = [
  "🎤",
  "🎧",
  "🎵",
  "🎶",
  "🎸",
  "🥁",
  "🪩",
  "🌟",
  "✨",
  "💖",
  "💎",
  "🔥",
  "⚡",
  "🌈",
  "🦋",
  "🍓",
  "🍒",
  "🫧",
  "🌙",
  "☀️",
  "🐯",
  "🐰",
  "🐻",
  "🦊",
];

function resetProfileScores(profile) {
  return {
    ...profile,
    scores: createEmptyScores(),
  };
}

function createTeam(index, name) {
  return {
    id: `team-${index + 1}`,
    name: name ?? `Team ${index + 1}`,
  };
}

function buildTeams(count, currentTeams = []) {
  return Array.from({ length: count }, (_, index) =>
    createTeam(index, currentTeams[index]?.name),
  );
}

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

function getRouteFromHash(hashValue) {
  if (hashValue === "#/main-gameshow") {
    return { name: "main-gameshow" };
  }

  if (hashValue === "#/mode-hub") {
    return { name: "mode-hub" };
  }

  if (hashValue.startsWith("#/mode/")) {
    return {
      name: "mode-prototype",
      modeId: hashValue.replace("#/mode/", ""),
    };
  }

  return { name: "home" };
}

export default function App() {
  const initialTeams = buildTeams(DEFAULT_TEAM_COUNT);
  const [route, setRoute] = useState(getRouteFromHash(window.location.hash));
  const [players, setPlayers] = useState(starterPlayers);
  const [hostProfile, setHostProfile] = useState({
    ...defaultHostProfile,
    teamId: initialTeams[0].id,
    scores: createEmptyScores(),
  });
  const [playerName, setPlayerName] = useState("");
  const [newPlayerIcon, setNewPlayerIcon] = useState(playerIcons[0]);
  const [teams, setTeams] = useState(initialTeams);
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  const [newPlayerTeamId, setNewPlayerTeamId] = useState(initialTeams[0].id);
  const [hostGetsScore, setHostGetsScore] = useState(false);
  const [desiredPlayerCount, setDesiredPlayerCount] = useState(starterPlayers.length);
  const [selectedGroup, setSelectedGroup] = useState(groupQuizzes[0]);
  const [launchMessage, setLaunchMessage] = useState("");

  useEffect(() => {
    function handleHashChange() {
      setRoute(getRouteFromHash(window.location.hash));
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function addPlayer(event) {
    event.preventDefault();

    const trimmedName = playerName.trim();
    if (!trimmedName) return;

    const fallbackTeamId = teams[0]?.id ?? "team-1";
    const newPlayer = {
      id: Date.now(),
      name: trimmedName,
      icon: newPlayerIcon,
      teamId: teamsEnabled ? newPlayerTeamId || fallbackTeamId : null,
      scores: createEmptyScores(),
    };

    setPlayers((currentPlayers) => [...currentPlayers.map(resetProfileScores), newPlayer]);
    setHostProfile((currentHost) => resetProfileScores(currentHost));
    setPlayerName("");
    setDesiredPlayerCount((count) => Number(count) + 1);
  }

  function removePlayer(playerId) {
    setPlayers((currentPlayers) => {
      const nextPlayers = currentPlayers
        .filter((player) => player.id !== playerId)
        .map(resetProfileScores);
      setDesiredPlayerCount(nextPlayers.length);
      return nextPlayers;
    });
    setHostProfile((currentHost) => resetProfileScores(currentHost));
  }

  function updatePlayer(playerId, updates) {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === playerId
          ? {
              ...player,
              ...updates,
              scores: normalizeScores(updates.scores ?? player.scores),
            }
          : player,
      ),
    );
  }

  function updateHost(updates) {
    setHostProfile((currentHost) => ({
      ...currentHost,
      ...updates,
      scores: normalizeScores(updates.scores ?? currentHost.scores),
    }));
  }

  function setTeamCount(nextValue) {
    const safeCount = Math.min(4, Math.max(1, Number(nextValue) || 1));
    const nextTeams = buildTeams(safeCount, teams);
    const fallbackTeamId = nextTeams[0]?.id ?? "team-1";
    const nextTeamIds = new Set(nextTeams.map((team) => team.id));

    setTeams(nextTeams);
    setNewPlayerTeamId((currentTeamId) =>
      nextTeamIds.has(currentTeamId) ? currentTeamId : fallbackTeamId,
    );
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({
        ...player,
        teamId: nextTeamIds.has(player.teamId) ? player.teamId : fallbackTeamId,
        scores: normalizeScores(player.scores),
      })),
    );
    setHostProfile((currentHost) => ({
      ...currentHost,
      teamId: nextTeamIds.has(currentHost.teamId) ? currentHost.teamId : fallbackTeamId,
      scores: normalizeScores(currentHost.scores),
    }));
  }

  function renameTeam(teamId, name) {
    setTeams((currentTeams) =>
      currentTeams.map((team) => (team.id === teamId ? { ...team, name: name.trim() || team.name } : team)),
    );
  }

  function assignPlayerAsHost(playerId) {
    const selectedPlayer = players.find((player) => player.id === playerId);
    if (!selectedPlayer) return;

    const nextPlayers = players.filter((player) => player.id !== playerId);

    if (hostProfile.id !== HOST_ID) {
      nextPlayers.push({
        ...hostProfile,
        scores: normalizeScores(hostProfile.scores),
      });
    }

    setPlayers(nextPlayers.map(resetProfileScores));
    setDesiredPlayerCount(nextPlayers.length);
    setHostProfile({
      ...resetProfileScores(selectedPlayer),
      teamId: selectedPlayer.teamId,
    });
  }

  function restoreDefaultHost() {
    if (hostProfile.id === HOST_ID) return;

    setPlayers((currentPlayers) => [
      ...currentPlayers.map(resetProfileScores),
      resetProfileScores({
        ...hostProfile,
        scores: normalizeScores(hostProfile.scores),
      }),
    ]);
    setDesiredPlayerCount((count) => Number(count) + 1);
    setHostProfile({
      ...defaultHostProfile,
      teamId: teams[0]?.id ?? defaultHostProfile.teamId,
      scores: createEmptyScores(),
    });
  }

  function startGroupQuiz(group) {
    setSelectedGroup(group);
    setLaunchMessage(`${group.label} is selected for the next round.`);
  }

  function goToMainShow() {
    window.location.hash = "/main-gameshow";
  }

  function goToModeHub() {
    window.location.hash = "/mode-hub";
  }

  function goToModePrototype(modeId) {
    if (modeId === "main-game") {
      goToMainShow();
      return;
    }

    window.location.hash = `/mode/${modeId}`;
  }

  function goHome() {
    window.location.hash = "";
  }

  function renderHomeButton() {
    return (
      <button className="global-home-button" onClick={goHome} type="button">
        Home
      </button>
    );
  }

  if (route.name === "main-gameshow") {
    return (
      <>
        {renderHomeButton()}
        <MainGameShow
          players={players}
          setPlayers={setPlayers}
          hostProfile={hostProfile}
          setHostProfile={setHostProfile}
          hostGetsScore={hostGetsScore}
          setHostGetsScore={setHostGetsScore}
          playerName={playerName}
          setPlayerName={setPlayerName}
          newPlayerIcon={newPlayerIcon}
          setNewPlayerIcon={setNewPlayerIcon}
          playerIcons={playerIcons}
          desiredPlayerCount={desiredPlayerCount}
          setDesiredPlayerCount={setDesiredPlayerCount}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          scoreKey={GAME_SCORE_KEYS.mainShow}
          onBackHome={goHome}
        />
      </>
    );
  }

  if (route.name === "mode-hub") {
    return (
      <>
        {renderHomeButton()}
        <ModeHub onBackHome={goHome} onOpenMode={goToModePrototype} />
      </>
    );
  }

  if (route.name === "mode-prototype") {
    return (
      <>
        {renderHomeButton()}
        <Suspense
          fallback={
            <div className="page-shell">
              <main className="app-frame">
                <section className="game-show-hero">
                  <div>
                    <h1>Loading game...</h1>
                  </div>
                </section>
              </main>
            </div>
          }
        >
          <ModePrototype
            modeId={route.modeId}
            onBackHome={goHome}
            onOpenModeHub={goToModeHub}
            players={players}
            setPlayers={setPlayers}
            hostProfile={hostProfile}
            setHostProfile={setHostProfile}
            hostGetsScore={hostGetsScore}
            setHostGetsScore={setHostGetsScore}
            playerName={playerName}
            setPlayerName={setPlayerName}
            newPlayerIcon={newPlayerIcon}
            setNewPlayerIcon={setNewPlayerIcon}
            desiredPlayerCount={desiredPlayerCount}
            setDesiredPlayerCount={setDesiredPlayerCount}
            addPlayer={addPlayer}
            removePlayer={removePlayer}
            scoreKey={
              route.modeId === "jeopardy"
                ? GAME_SCORE_KEYS.jeopardy
                : GAME_SCORE_KEYS.songGuessing
            }
          />
        </Suspense>
      </>
    );
  }

  return (
    <>
      {renderHomeButton()}
      <HomeScreen
        players={players}
        hostProfile={hostProfile}
        hostGetsScore={hostGetsScore}
        selectedGroup={selectedGroup}
        launchMessage={launchMessage}
        playerName={playerName}
        newPlayerIcon={newPlayerIcon}
        teams={teams}
        teamsEnabled={teamsEnabled}
        newPlayerTeamId={newPlayerTeamId}
        playerIcons={playerIcons}
        onHostGetsScoreChange={setHostGetsScore}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onPlayerNameChange={setPlayerName}
        onNewPlayerIconChange={setNewPlayerIcon}
        onNewPlayerTeamChange={setNewPlayerTeamId}
        onPlayerUpdate={updatePlayer}
        onHostUpdate={updateHost}
        onAssignPlayerAsHost={assignPlayerAsHost}
        onRestoreDefaultHost={restoreDefaultHost}
        onTeamCountChange={setTeamCount}
        onTeamRename={renameTeam}
        onTeamsEnabledChange={setTeamsEnabled}
        onStartGroupQuiz={startGroupQuiz}
        modeOptions={gameModes}
        onOpenModeHub={goToModeHub}
        onOpenMode={goToModePrototype}
        onStartMainShow={goToMainShow}
      />
    </>
  );
}
