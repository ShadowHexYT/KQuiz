import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import MainGameShow from "./components/MainGameShow";
import ModeHub from "./components/ModeHub";
import PillNav from "./components/PillNav";
import { groupQuizzes } from "./data/groupQuizzes";
import { buildIndividualQuizForGroup } from "./lib/individualQuiz/index.js";
import { gameModes, modeSupportsGroupFocus } from "./data/gameModeCatalog";
import { createEmptyScores, GAME_SCORE_KEYS, normalizeScores } from "./data/scoreModel";

const ModePrototype = lazy(() => import("./components/ModePrototype"));

const starterPlayers = [];
const DEFAULT_TEAM_COUNT = 2;
export const HOST_ID = "hunter-host";
const FIXED_LINEUP_TEAM_SEQUENCE = [0, 1, 0, 1, 2, 2];
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

function getFixedTeamIdForSlot(slotNumber, teams) {
  const teamIndex = FIXED_LINEUP_TEAM_SEQUENCE[Math.max(0, slotNumber - 1)] ?? 0;
  return teams[teamIndex]?.id ?? teams[0]?.id ?? "team-1";
}

function getResolvedLineupSlot(player, index) {
  return player.lineupSlot ?? index + 1;
}

function getNextAvailableLineupSlot(players) {
  for (let slotNumber = 1; slotNumber <= 6; slotNumber += 1) {
    const isTaken = players.some(
      (player, index) => getResolvedLineupSlot(player, index) === slotNumber,
    );

    if (!isTaken) {
      return slotNumber;
    }
  }

  return players.length + 1;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  if (hashValue.startsWith("#/group/")) {
    return {
      name: "group-quiz",
      groupSlug: hashValue.replace("#/group/", ""),
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
  const [selectedLaunchTarget, setSelectedLaunchTarget] = useState(null);
  const [modeGroupFilters, setModeGroupFilters] = useState({});

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

    const lineupSlot = getNextAvailableLineupSlot(players);
    const newPlayer = {
      id: Date.now(),
      name: trimmedName,
      icon: newPlayerIcon,
      lineupSlot,
      teamId: teamsEnabled ? getFixedTeamIdForSlot(lineupSlot, teams) : null,
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
      currentPlayers.map((player, index) => {
        const lineupSlot = getResolvedLineupSlot(player, index);

        return {
          ...player,
          lineupSlot,
          teamId: teamsEnabled
            ? getFixedTeamIdForSlot(lineupSlot, nextTeams)
            : nextTeamIds.has(player.teamId)
              ? player.teamId
              : fallbackTeamId,
          scores: normalizeScores(player.scores),
        };
      }),
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
        lineupSlot: getNextAvailableLineupSlot(nextPlayers),
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
        lineupSlot: getNextAvailableLineupSlot(currentPlayers),
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

  function movePlayerToLineupSlot(playerId, targetSlot) {
    setPlayers((currentPlayers) => {
      const sourcePlayer = currentPlayers.find((player) => player.id === playerId);
      if (!sourcePlayer) return currentPlayers;

      const sourceIndex = currentPlayers.findIndex((player) => player.id === playerId);
      const sourceSlot = getResolvedLineupSlot(sourcePlayer, sourceIndex);
      if (sourceSlot === targetSlot) return currentPlayers;

      const targetPlayer = currentPlayers.find(
        (player, index) => getResolvedLineupSlot(player, index) === targetSlot,
      );
      const sourceTeamId = getFixedTeamIdForSlot(sourceSlot, teams);
      const targetTeamId = getFixedTeamIdForSlot(targetSlot, teams);

      const nextPlayers = currentPlayers.map((player, index) => {
        const lineupSlot = getResolvedLineupSlot(player, index);

        if (player.id === playerId) {
          return {
            ...player,
            lineupSlot: targetSlot,
            teamId: teamsEnabled ? targetTeamId : player.teamId,
          };
        }

        if (targetPlayer && player.id === targetPlayer.id) {
          return {
            ...player,
            lineupSlot: sourceSlot,
            teamId: teamsEnabled ? sourceTeamId : player.teamId,
          };
        }

        return {
          ...player,
          lineupSlot,
        };
      });

      return nextPlayers.sort(
        (leftPlayer, rightPlayer) =>
          (leftPlayer.lineupSlot ?? 999) - (rightPlayer.lineupSlot ?? 999),
      );
    });
  }

  function startGroupQuiz(group, options = {}) {
    setSelectedGroup(group);
    if (options.silent) return;
    setSelectedLaunchTarget({ type: "group", id: group.label });
  }

  function openGroupQuizFromNav(group) {
    setSelectedGroup(group);
    setSelectedLaunchTarget({ type: "group", id: group.label });
    goToGroupQuiz(group.label);
  }

  function selectLaunchTarget(target) {
    setSelectedLaunchTarget(target);
  }

  function setModeGroupFilter(modeId, groupName) {
    if (!modeSupportsGroupFocus(modeId)) return;

    setModeGroupFilters((currentValue) => ({
      ...currentValue,
      [modeId]: groupName,
    }));
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

  function goToGroupQuiz(groupLabel) {
    window.location.hash = `/group/${slugify(groupLabel)}`;
  }

  function goHome() {
    window.location.hash = "";
  }

  function resetApp() {
    const resetTeams = buildTeams(DEFAULT_TEAM_COUNT);
    setPlayers(starterPlayers);
    setHostProfile({
      ...defaultHostProfile,
      teamId: resetTeams[0].id,
      scores: createEmptyScores(),
    });
    setPlayerName("");
    setNewPlayerIcon(playerIcons[0]);
    setTeams(resetTeams);
    setTeamsEnabled(false);
    setNewPlayerTeamId(resetTeams[0].id);
    setHostGetsScore(false);
    setDesiredPlayerCount(starterPlayers.length);
    setSelectedGroup(groupQuizzes[0]);
    setSelectedLaunchTarget(null);
    setModeGroupFilters({});
    goHome();
  }

  const activeNavKey = route.name === "home" ? "home" : "games";
  const routedGroup =
    route.name === "group-quiz"
      ? groupQuizzes.find((group) => slugify(group.label) === route.groupSlug) ?? null
      : null;
  const routedGroupQuiz = useMemo(
    () => (routedGroup ? buildIndividualQuizForGroup(routedGroup.label) : null),
    [routedGroup],
  );
  const routedGroupRounds = routedGroupQuiz?.rounds ?? [];

  useEffect(() => {
    if (route.name !== "group-quiz" || !routedGroup) return;

    setSelectedGroup((currentGroup) =>
      currentGroup?.label === routedGroup.label ? currentGroup : routedGroup,
    );
    setSelectedLaunchTarget({ type: "group", id: routedGroup.label });
  }, [route.name, routedGroup]);

  const topNav = (
    <PillNav
      activeKey={activeNavKey}
      gameModes={gameModes}
      groupQuizzes={groupQuizzes}
      onGoHome={goHome}
      onOpenModeHub={goToModeHub}
      onOpenMode={goToModePrototype}
      onOpenGroupQuiz={openGroupQuizFromNav}
      onResetApp={resetApp}
    />
  );

  if (route.name === "main-gameshow") {
    return (
      <>
        {topNav}
        <MainGameShow
          players={players}
          setPlayers={setPlayers}
          hostProfile={hostProfile}
          setHostProfile={setHostProfile}
          teams={teams}
          teamsEnabled={teamsEnabled}
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
        {topNav}
        <ModeHub onBackHome={goHome} onOpenMode={goToModePrototype} />
      </>
    );
  }

  if (route.name === "mode-prototype") {
    return (
      <>
        {topNav}
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
            selectedGroupFilter={modeGroupFilters[route.modeId] ?? "All groups"}
            onSelectedGroupFilterChange={(groupName) => setModeGroupFilter(route.modeId, groupName)}
            onBackHome={goHome}
            onOpenModeHub={goToModeHub}
            players={players}
            setPlayers={setPlayers}
            hostProfile={hostProfile}
            setHostProfile={setHostProfile}
            teams={teams}
            teamsEnabled={teamsEnabled}
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

  if (route.name === "group-quiz" && routedGroup && routedGroupRounds.length) {
    return (
      <>
        {topNav}
        <MainGameShow
          players={players}
          setPlayers={setPlayers}
          hostProfile={hostProfile}
          setHostProfile={setHostProfile}
          teams={teams}
          teamsEnabled={teamsEnabled}
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
          scoreKey={GAME_SCORE_KEYS.songGuessing}
          rounds={routedGroupRounds}
          includeGroupGuess={false}
          heroEyebrow="Individual group quiz"
          heroTitle={`${routedGroup.label} Quiz`}
          heroText={routedGroup.description}
          roundNavTitle="Difficulty"
          onBackHome={goHome}
        />
      </>
    );
  }

  return (
    <>
      {topNav}
      <HomeScreen
        players={players}
        hostProfile={hostProfile}
        hostGetsScore={hostGetsScore}
        selectedGroup={selectedGroup}
        selectedLaunchTarget={selectedLaunchTarget}
        modeGroupFilters={modeGroupFilters}
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
        onMovePlayerToLineupSlot={movePlayerToLineupSlot}
        onStartGroupQuiz={startGroupQuiz}
        onSelectLaunchTarget={selectLaunchTarget}
        onModeGroupFilterChange={setModeGroupFilter}
        modeOptions={gameModes}
        onOpenModeHub={goToModeHub}
        onOpenMode={goToModePrototype}
        onLaunchGroupQuiz={(group) => goToGroupQuiz(group.label)}
        onStartMainShow={goToMainShow}
      />
    </>
  );
}
