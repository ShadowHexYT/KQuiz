import { useEffect, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import MainGameShow from "./components/MainGameShow";

const starterPlayers = [];
const DEFAULT_TEAM_COUNT = 2;
export const HOST_ID = "hunter-host";
export const defaultHostProfile = {
  id: HOST_ID,
  name: "Hunter",
  icon: "🎙️",
  teamId: "team-1",
  scores: {
    mainShow: 0,
  },
};
export const playerIcons = ["🎤", "💖", "🌟", "🎧", "🪩", "🔥", "🎵", "💎"];

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

function getRouteFromHash(hashValue) {
  return hashValue === "#/main-gameshow" ? "main-gameshow" : "home";
}

export default function App() {
  const initialTeams = buildTeams(DEFAULT_TEAM_COUNT);
  const [route, setRoute] = useState(getRouteFromHash(window.location.hash));
  const [players, setPlayers] = useState(starterPlayers);
  const [hostProfile, setHostProfile] = useState({
    ...defaultHostProfile,
    teamId: initialTeams[0].id,
  });
  const [playerName, setPlayerName] = useState("");
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
      icon: playerIcons[0],
      teamId: teamsEnabled ? newPlayerTeamId || fallbackTeamId : null,
      scores: {
        mainShow: 0,
      },
    };

    setPlayers((currentPlayers) => [...currentPlayers, newPlayer]);
    setPlayerName("");
    setDesiredPlayerCount((count) => Number(count) + 1);
  }

  function removePlayer(playerId) {
    setPlayers((currentPlayers) => {
      const nextPlayers = currentPlayers.filter((player) => player.id !== playerId);
      setDesiredPlayerCount(nextPlayers.length);
      return nextPlayers;
    });
  }

  function updatePlayer(playerId, updates) {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => (player.id === playerId ? { ...player, ...updates } : player)),
    );
  }

  function updateHost(updates) {
    setHostProfile((currentHost) => ({
      ...currentHost,
      ...updates,
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
      })),
    );
    setHostProfile((currentHost) => ({
      ...currentHost,
      teamId: nextTeamIds.has(currentHost.teamId) ? currentHost.teamId : fallbackTeamId,
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
      });
    }

    setPlayers(nextPlayers);
    setDesiredPlayerCount(nextPlayers.length);
    setHostProfile({
      ...selectedPlayer,
    });
  }

  function restoreDefaultHost() {
    if (hostProfile.id === HOST_ID) return;

    setPlayers((currentPlayers) => [
      ...currentPlayers,
      {
        ...hostProfile,
      },
    ]);
    setDesiredPlayerCount((count) => Number(count) + 1);
    setHostProfile({
      ...defaultHostProfile,
      teamId: teams[0]?.id ?? defaultHostProfile.teamId,
      scores: {
        ...defaultHostProfile.scores,
      },
    });
  }

  function startGroupQuiz(group) {
    setSelectedGroup(group);
    setLaunchMessage(`Ready to start the ${group.label} quiz.`);
  }

  function goToMainShow() {
    window.location.hash = "/main-gameshow";
  }

  function goHome() {
    window.location.hash = "";
  }

  if (route === "main-gameshow") {
    return (
      <MainGameShow
        players={players}
        setPlayers={setPlayers}
        hostProfile={hostProfile}
        setHostProfile={setHostProfile}
        hostGetsScore={hostGetsScore}
        setHostGetsScore={setHostGetsScore}
        playerName={playerName}
        setPlayerName={setPlayerName}
        desiredPlayerCount={desiredPlayerCount}
        setDesiredPlayerCount={setDesiredPlayerCount}
        addPlayer={addPlayer}
        removePlayer={removePlayer}
        onBackHome={goHome}
      />
    );
  }

  return (
    <HomeScreen
      players={players}
      hostProfile={hostProfile}
      hostGetsScore={hostGetsScore}
      selectedGroup={selectedGroup}
      launchMessage={launchMessage}
      playerName={playerName}
      teams={teams}
      teamsEnabled={teamsEnabled}
      newPlayerTeamId={newPlayerTeamId}
      playerIcons={playerIcons}
      onHostGetsScoreChange={setHostGetsScore}
      onAddPlayer={addPlayer}
      onRemovePlayer={removePlayer}
      onPlayerNameChange={setPlayerName}
      onNewPlayerTeamChange={setNewPlayerTeamId}
      onPlayerUpdate={updatePlayer}
      onHostUpdate={updateHost}
      onAssignPlayerAsHost={assignPlayerAsHost}
      onRestoreDefaultHost={restoreDefaultHost}
      onTeamCountChange={setTeamCount}
      onTeamRename={renameTeam}
      onTeamsEnabledChange={setTeamsEnabled}
      onStartGroupQuiz={startGroupQuiz}
      onStartMainShow={goToMainShow}
    />
  );
}
