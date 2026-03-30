import { useMemo, useState } from "react";
import {
  idolRepository,
  idolRepositoryReviewQueue,
} from "../data/idolRepository.generated";

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatBirthday(dateString) {
  if (!dateString) return null;

  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getUpcomingBirthdaySortKey(dateString) {
  if (!dateString) return Number.MAX_SAFE_INTEGER;

  const [, month, day] = dateString.split("-").map(Number);
  const today = new Date();
  const todayFloor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const thisYearBirthday = new Date(today.getFullYear(), month - 1, day);
  const nextBirthday =
    thisYearBirthday < todayFloor
      ? new Date(today.getFullYear() + 1, month - 1, day)
      : thisYearBirthday;

  return nextBirthday.getTime();
}

function buildIdolFacts(member) {
  return [
    { label: "Stage Name", value: member.displayName },
    { label: "Full Name", value: member.fullName },
    { label: "Korean Name", value: member.koreanName },
    { label: "Birthday", value: formatBirthday(member.birthday) },
    { label: "Age", value: member.age ? `${member.age}` : null },
    { label: "Birthplace", value: member.birthplace },
    { label: "Group", value: member.groupName },
    { label: "Roles", value: member.positions?.length ? member.positions.join(" • ") : null },
    { label: "Zodiac", value: member.zodiac },
    { label: "Height", value: member.height },
    { label: "Weight", value: member.weight || null },
    { label: "Blood Type", value: member.bloodType || null },
    { label: "MBTI", value: member.mbti || null },
    { label: "Fandom", value: member.fandom },
    { label: "Debut Date", value: member.debutDate },
    { label: "Representative Color", value: member.representativeColor },
    { label: "Representative Symbol", value: member.representativeSymbol },
  ].filter((fact) => fact.value);
}

function buildIdolDirectory() {
  return idolRepository
    .map((group) => ({
      groupName: group.groupName,
      description: group.description,
      coverImage: group.coverImage,
      kpoppingUrl: group.kpoppingUrl,
      kprofilesUrl: group.kprofilesUrl,
      reviewIssues: group.reviewIssues ?? [],
      members: group.members.map((member) => ({
        id: member.id ?? `${slugify(group.groupName)}-${slugify(member.displayName)}`,
        name: member.displayName,
        image: member.image ?? null,
        groupName: group.groupName,
        groupDescription: group.description,
        kpoppingUrl: member.kpoppingProfileUrl ?? group.kpoppingUrl,
        kprofilesUrl: member.kprofilesUrl ?? group.kprofilesUrl,
        facts: buildIdolFacts(member),
        birthdayLabel: formatBirthday(member.birthday),
        sortAge: member.age ?? Number.MAX_SAFE_INTEGER,
        sortBirthday: getUpcomingBirthdaySortKey(member.birthday),
        sourceSummary: member.sourceSummary ?? [],
      })),
    }))
    .filter((group) => group.members.length);
}

function buildFlatDirectory(directory, sortKey) {
  return directory
    .flatMap((group) => group.members)
    .sort((left, right) => {
      if (sortKey === "age") {
        return left.sortAge - right.sortAge || left.name.localeCompare(right.name);
      }

      if (sortKey === "birthday") {
        return left.sortBirthday - right.sortBirthday || left.name.localeCompare(right.name);
      }

      return left.name.localeCompare(right.name);
    });
}

export default function IdolsPage() {
  const [sortKey, setSortKey] = useState("group");
  const [expandedIdByGroup, setExpandedIdByGroup] = useState({});
  const idolDirectory = useMemo(() => buildIdolDirectory(), []);
  const idolCount = idolDirectory.reduce((sum, group) => sum + group.members.length, 0);
  const groupCount = idolDirectory.length;
  const reviewCount = idolRepositoryReviewQueue.length;

  const sortedGroups = useMemo(() => {
    if (sortKey !== "group") {
      const allMembers = buildFlatDirectory(idolDirectory, sortKey);

      return [
        {
          groupName:
            sortKey === "name"
              ? "Alphabetical Directory"
              : sortKey === "age"
                ? "Age Order"
                : "Upcoming Birthdays",
          description:
            "Browse every idol across your current favorite-group roster in one clean list.",
          members: allMembers,
          isFlatView: true,
          reviewIssues: [],
        },
      ];
    }

    return [...idolDirectory].sort((left, right) => left.groupName.localeCompare(right.groupName));
  }, [idolDirectory, sortKey]);

  function toggleExpanded(groupName, idolId) {
    setExpandedIdByGroup((current) => ({
      ...current,
      [groupName]: current[groupName] === idolId ? null : idolId,
    }));
  }

  return (
    <div className="page-shell">
      <main className="app-frame">
        <section className="idols-page-shell">
          <header className="idols-page-hero">
            <div className="idols-page-copy">
              <p className="panel-label">Idol Repository</p>
              <h1>Idols</h1>
              <p>
                A profile-style idol directory for every group on this site, now synced from
                Kpopping with KProfiles kept as a direct secondary reference for profile checking.
              </p>
              <div className="idols-source-strip" aria-label="Source references">
                <a
                  className="ghost-button idol-source-button"
                  href="https://kpopping.com/"
                  rel="noreferrer"
                  target="_blank"
                >
                  Kpopping
                </a>
                <a
                  className="ghost-button idol-source-button"
                  href="https://kprofiles.com/"
                  rel="noreferrer"
                  target="_blank"
                >
                  KProfiles
                </a>
              </div>
            </div>

            <div className="idols-page-meta">
              <span className="player-count">{idolCount} idols</span>
              <span className="player-count">{groupCount} groups</span>
              <span className="player-count">{reviewCount} review flags</span>
            </div>

            <div className="idols-sort-corner">
              <span className="panel-label">Filter</span>
              <div className="idols-sort-pills" role="tablist" aria-label="Idol sort order">
                {[
                  { key: "group", label: "By Group" },
                  { key: "name", label: "A-Z" },
                  { key: "age", label: "Age" },
                  { key: "birthday", label: "Bdays" },
                ].map((option) => (
                  <button
                    aria-selected={sortKey === option.key}
                    className={`ghost-button idols-sort-pill ${sortKey === option.key ? "is-active" : ""}`}
                    key={option.key}
                    onClick={() => setSortKey(option.key)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <section className="idols-directory">
            {sortedGroups.map((group) => {
              const expandedId = expandedIdByGroup[group.groupName] ?? null;
              const expandedMember = group.members.find((member) => member.id === expandedId) ?? null;

              return (
                <section className="idol-group-section" key={group.groupName}>
                  <div className="idol-group-header">
                    <div className="idol-group-header-copy">
                      <p className="panel-label">{group.isFlatView ? "All Members" : "Group Profile"}</p>
                      <h2>{group.groupName}</h2>
                      <p>{group.description}</p>
                      {group.reviewIssues?.length ? (
                        <p className="idol-review-note">
                          Some entries for this group are still under review, so only verified fields are shown.
                        </p>
                      ) : null}
                    </div>

                    {!group.isFlatView ? (
                      <div className="idol-group-source-row">
                        <a
                          className="ghost-button idol-source-button"
                          href={group.kpoppingUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Kpopping
                        </a>
                        <a
                          className="ghost-button idol-source-button"
                          href={group.kprofilesUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          KProfiles
                        </a>
                      </div>
                    ) : null}
                  </div>

                  <div className="idol-card-grid">
                    {group.members.map((member) => {
                      const isExpanded = expandedId === member.id;

                      return (
                        <button
                          aria-expanded={isExpanded}
                          className={`idol-card ${isExpanded ? "is-expanded" : ""}`}
                          key={member.id}
                          onClick={() => toggleExpanded(group.groupName, member.id)}
                          type="button"
                        >
                          {member.image ? (
                            <img
                              alt={`${member.name} from ${member.groupName}`}
                              className="idol-card-image"
                              src={member.image}
                            />
                          ) : (
                            <div className="idol-card-image idol-card-image-fallback" aria-hidden="true">
                              {member.name.charAt(0)}
                            </div>
                          )}

                          <div className="idol-card-copy">
                            <strong>{member.name}</strong>
                            <span>{member.groupName}</span>
                            {member.birthdayLabel ? <span>{member.birthdayLabel}</span> : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {expandedMember ? (
                    <section className="idol-detail-panel" aria-live="polite">
                      <div className="idol-detail-top">
                        <div className="idol-detail-identity">
                          {expandedMember.image ? (
                            <img
                              alt={`${expandedMember.name} profile`}
                              className="idol-detail-image"
                              src={expandedMember.image}
                            />
                          ) : (
                            <div className="idol-detail-image idol-card-image-fallback" aria-hidden="true">
                              {expandedMember.name.charAt(0)}
                            </div>
                          )}
                          <div className="idol-detail-copy">
                            <p className="panel-label">Selected idol</p>
                            <h3>{expandedMember.name}</h3>
                            <p>{expandedMember.groupDescription}</p>
                          </div>
                        </div>

                        <div className="idol-detail-links">
                          <a
                            className="ghost-button idol-source-button"
                            href={expandedMember.kpoppingUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Idol on Kpopping
                          </a>
                          <a
                            className="ghost-button idol-source-button"
                            href={expandedMember.kprofilesUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Group on KProfiles
                          </a>
                        </div>
                      </div>

                      <div className="idol-facts-grid">
                        {expandedMember.facts.map((fact) => (
                          <article className="idol-fact-card" key={`${expandedMember.id}-${fact.label}`}>
                            <span className="panel-label">{fact.label}</span>
                            <strong>{fact.value}</strong>
                          </article>
                        ))}
                      </div>

                      {expandedMember.sourceSummary?.length ? (
                        <p className="idol-detail-note">
                          Sources used for this idol: {expandedMember.sourceSummary.join(" • ")}
                        </p>
                      ) : null}
                    </section>
                  ) : null}
                </section>
              );
            })}
          </section>
        </section>
      </main>
    </div>
  );
}
