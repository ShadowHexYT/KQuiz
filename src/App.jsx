import { useEffect, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import MainGameShow from "./components/MainGameShow";

const starterPlayers = [];
export const HOST_ID = "hunter-host";
export const defaultHostProfile = {
  id: HOST_ID,
  name: "Hunter",
  icon: "🎙️",
  scores: {
    mainShow: 0,
  },
};
export const playerIcons = ["🎤", "💖", "🌟", "🎧", "🪩", "🔥", "🎵", "💎"];

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
  const [hostProfile, setHostProfile] = useState(defaultHostProfile);
  const [playerName, setPlayerName] = useState("");
  const [playerIcon, setPlayerIcon] = useState(playerIcons[0]);
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

    const newPlayer = {
      id: Date.now(),
      name: trimmedName,
      icon: playerIcon,
      scores: {
        mainShow: 0,
      },
    };

    setPlayers((currentPlayers) => [...currentPlayers, newPlayer]);
    setPlayerName("");
    setPlayerIcon((currentIcon) => {
      const currentIndex = playerIcons.indexOf(currentIcon);
      return playerIcons[(currentIndex + 1) % playerIcons.length];
    });
    setDesiredPlayerCount((count) => Number(count) + 1);
  }

  function removePlayer(playerId) {
    setPlayers((currentPlayers) => {
      const nextPlayers = currentPlayers.filter((player) => player.id !== playerId);
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
      playerIcon={playerIcon}
      playerIcons={playerIcons}
      onHostGetsScoreChange={setHostGetsScore}
      onAddPlayer={addPlayer}
      onRemovePlayer={removePlayer}
      onPlayerIconChange={setPlayerIcon}
      onPlayerNameChange={setPlayerName}
      onStartGroupQuiz={startGroupQuiz}
      onStartMainShow={goToMainShow}
    />
  );
}
