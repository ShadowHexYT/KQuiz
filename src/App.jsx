import { useEffect, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import MainGameShow from "./components/MainGameShow";

const starterPlayers = [
  {
    id: 1,
    name: "You",
    scores: {
      mainShow: 0,
    },
  },
  {
    id: 2,
    name: "Sister",
    scores: {
      mainShow: 0,
    },
  },
  {
    id: 3,
    name: "Mom",
    scores: {
      mainShow: 0,
    },
  },
];

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
  const [route, setRoute] = useState(getRouteFromHash(window.location.hash));
  const [players, setPlayers] = useState(starterPlayers);
  const [playerName, setPlayerName] = useState("");
  const [hostId, setHostId] = useState(starterPlayers[0]?.id ?? null);
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

    setPlayers((currentPlayers) => [
      ...currentPlayers,
      {
        id: Date.now(),
        name: trimmedName,
        scores: {
          mainShow: 0,
        },
      },
    ]);
    setPlayerName("");
    setDesiredPlayerCount((count) => Number(count) + 1);
  }

  function removePlayer(playerId) {
    setPlayers((currentPlayers) => {
      const nextPlayers = currentPlayers.filter((player) => player.id !== playerId);
      if (!nextPlayers.length) return currentPlayers;

      if (!nextPlayers.some((player) => player.id === hostId)) {
        setHostId(nextPlayers[0].id);
      }

      setDesiredPlayerCount(nextPlayers.length);
      return nextPlayers;
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
        hostId={hostId}
        setHostId={setHostId}
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
      hostId={hostId}
      selectedGroup={selectedGroup}
      launchMessage={launchMessage}
      playerName={playerName}
      onHostChange={setHostId}
      onAddPlayer={addPlayer}
      onPlayerNameChange={setPlayerName}
      onStartGroupQuiz={startGroupQuiz}
      onStartMainShow={goToMainShow}
    />
  );
}
