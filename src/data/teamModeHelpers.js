import { normalizeScores } from "./scoreModel";

export function playerCanContributeToScore(profile, hostGetsScore, hostId) {
  if (profile.id !== hostId) return true;
  return hostGetsScore;
}

export function buildGameEntities({
  players,
  hostProfile,
  teams,
  teamsEnabled,
  hostGetsScore,
  scoreKey,
}) {
  const profiles = [hostProfile, ...players];

  if (!teamsEnabled) {
    return profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      icon: profile.icon,
      kind: "player",
      memberIds: [profile.id],
      memberNames: [profile.name],
      representativeId: profile.id,
      isScoring: playerCanContributeToScore(profile, hostGetsScore, hostProfile.id),
      scoreTotal: normalizeScores(profile.scores)[scoreKey] ?? 0,
      subtitle:
        profile.id === hostProfile.id
          ? hostGetsScore
            ? "Host and player"
            : "Host only"
          : "Player",
    }));
  }

  const membersByTeamId = new Map();

  profiles.forEach((profile) => {
    const teamId = profile.teamId ?? "unassigned";
    const currentMembers = membersByTeamId.get(teamId) ?? [];
    currentMembers.push(profile);
    membersByTeamId.set(teamId, currentMembers);
  });

  const orderedTeamIds = [
    ...teams.map((team) => team.id),
    ...Array.from(membersByTeamId.keys()).filter(
      (teamId) => !teams.some((team) => team.id === teamId),
    ),
  ];

  return orderedTeamIds
    .map((teamId) => {
      const members = membersByTeamId.get(teamId) ?? [];
      if (!members.length) return null;

      const team = teams.find((currentTeam) => currentTeam.id === teamId);
      const scoringMembers = members.filter((member) =>
        playerCanContributeToScore(member, hostGetsScore, hostProfile.id),
      );
      const representative = scoringMembers[0] ?? members[0];

      return {
        id: `team:${teamId}`,
        name: team?.name ?? members.map((member) => member.name).join(" / "),
        icon: representative.icon ?? members[0]?.icon ?? "👥",
        kind: "team",
        memberIds: members.map((member) => member.id),
        memberNames: members.map((member) => member.name),
        representativeId: representative.id,
        isScoring: scoringMembers.length > 0,
        scoreTotal: members.reduce(
          (total, member) => total + (normalizeScores(member.scores)[scoreKey] ?? 0),
          0,
        ),
        subtitle: members.map((member) => member.name).join(", "),
      };
    })
    .filter(Boolean);
}

