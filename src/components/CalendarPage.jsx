import { useMemo, useState } from "react";
import { generatedCalendarFeed } from "../data/calendarFeed.generated";

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatShortDateLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function normalizeDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function buildCalendarCells(viewDate, eventsByDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const cells = [];
  const todayKey = normalizeDateKey(new Date());

  for (let index = 0; index < leadingBlanks; index += 1) {
    cells.push({ key: `blank-${index}`, isBlank: true });
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const cellDate = new Date(year, month, day);
    const dateKey = normalizeDateKey(cellDate);
    const events = eventsByDate[dateKey] ?? [];

    cells.push({
      key: dateKey,
      isBlank: false,
      dateKey,
      day,
      events,
      isToday: dateKey === todayKey,
      hasBias: events.some((event) => event.isHunterBias),
      hasSpotlight: events.some((event) => event.isSpotlight),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `tail-${cells.length}`, isBlank: true });
  }

  return cells;
}

function buildEventsByDate(events) {
  return events.reduce((accumulator, event) => {
    const nextValue = accumulator;
    nextValue[event.startDate] ??= [];
    nextValue[event.startDate].push(event);
    return nextValue;
  }, {});
}

function getEventTypeLabel(type) {
  switch (type) {
    case "birthday":
      return "Birthday";
    case "concert":
      return "Concert";
    case "festival":
      return "Festival";
    case "release":
      return "Release";
    case "announcement":
      return "Announcement";
    default:
      return "Event";
  }
}

function getEventMeta(event) {
  if (event.type === "birthday") {
    return [event.groupName, event.birthplace].filter(Boolean).join(" • ");
  }

  return [event.groupName, event.venue, event.location].filter(Boolean).join(" • ");
}

export default function CalendarPage() {
  const calendarFeed = useMemo(() => generatedCalendarFeed, []);
  const upcomingEvents = useMemo(() => calendarFeed.events.slice(0, 14), [calendarFeed.events]);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(
    upcomingEvents[0]?.startDate ?? normalizeDateKey(new Date()),
  );

  const eventsByDate = useMemo(() => buildEventsByDate(calendarFeed.events), [calendarFeed.events]);
  const calendarCells = useMemo(
    () => buildCalendarCells(viewDate, eventsByDate),
    [eventsByDate, viewDate],
  );
  const selectedDateEvents = eventsByDate[selectedDateKey] ?? [];
  const spotlightEvents = useMemo(
    () => calendarFeed.events.filter((event) => event.isSpotlight).slice(0, 8),
    [calendarFeed.events],
  );
  const localEvents = useMemo(
    () => calendarFeed.events.filter((event) => event.localMarket),
    [calendarFeed.events],
  );

  return (
    <div className="page-shell">
      <main className="app-frame">
        <section className="calendar-page-shell">
          <header className="calendar-page-hero">
            <div className="calendar-page-copy">
              <p className="panel-label">Upcoming Dates</p>
              <h1>Calendar</h1>
              <p>
                A verified event board for birthdays, tours, releases, and major announcements so
                your mom can quickly check what is coming up next across your favorite groups.
              </p>

              <div className="calendar-legend" aria-label="Calendar legend">
                <span className="calendar-legend-pill is-bias">★ Hunter bias</span>
                <span className="calendar-legend-pill is-spotlight">Spotlight group</span>
                <span className="calendar-legend-pill">{calendarFeed.monthsAhead}-month feed</span>
              </div>
            </div>

            <div className="calendar-page-meta">
              <span className="player-count">{calendarFeed.localMarket}</span>
              <span className="player-count">{calendarFeed.events.length} verified dates</span>
              <span className="player-count">Refresh by {formatShortDateLabel(calendarFeed.refreshAfter)}</span>
            </div>
          </header>

          <section className="calendar-layout">
            <div className="calendar-main-panel">
              <div className="calendar-toolbar">
                <div>
                  <p className="panel-label">Monthly View</p>
                  <h2>{formatMonthLabel(viewDate)}</h2>
                </div>

                <div className="calendar-toolbar-actions">
                  <button
                    className="ghost-button calendar-toolbar-button"
                    onClick={() =>
                      setViewDate(
                        (currentValue) =>
                          new Date(currentValue.getFullYear(), currentValue.getMonth() - 1, 1),
                      )
                    }
                    type="button"
                  >
                    Prev
                  </button>
                  <button
                    className="ghost-button calendar-toolbar-button"
                    onClick={() => setViewDate(new Date())}
                    type="button"
                  >
                    Today
                  </button>
                  <button
                    className="ghost-button calendar-toolbar-button"
                    onClick={() =>
                      setViewDate(
                        (currentValue) =>
                          new Date(currentValue.getFullYear(), currentValue.getMonth() + 1, 1),
                      )
                    }
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="calendar-grid-weekdays">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <span className="calendar-weekday" key={day}>
                    {day}
                  </span>
                ))}
              </div>

              <div className="calendar-grid">
                {calendarCells.map((cell) =>
                  cell.isBlank ? (
                    <div className="calendar-day is-empty" key={cell.key} />
                  ) : (
                    <button
                      className={`calendar-day ${cell.isToday ? "is-today" : ""} ${
                        cell.dateKey === selectedDateKey ? "is-selected" : ""
                      } ${cell.hasBias ? "has-bias" : ""} ${cell.hasSpotlight ? "has-spotlight" : ""}`}
                      key={cell.key}
                      onClick={() => setSelectedDateKey(cell.dateKey)}
                      type="button"
                    >
                      <span className="calendar-day-number">{cell.day}</span>
                      <div className="calendar-day-markers">
                        {cell.hasBias ? <span className="calendar-marker is-bias">★</span> : null}
                        {cell.hasSpotlight ? (
                          <span className="calendar-marker is-spotlight">●</span>
                        ) : null}
                      </div>
                      {cell.events.length ? (
                        <div className="calendar-day-events">
                          {cell.events.slice(0, 2).map((event) => (
                            <span className="calendar-day-chip" key={event.id}>
                              {event.type === "birthday" ? event.idolName : event.groupName}
                            </span>
                          ))}
                          {cell.events.length > 2 ? (
                            <span className="calendar-day-more">+{cell.events.length - 2}</span>
                          ) : null}
                        </div>
                      ) : null}
                    </button>
                  ),
                )}
              </div>
            </div>

            <aside className="calendar-side-panel">
              <section className="calendar-detail-card">
                <p className="panel-label">Selected Date</p>
                <h3>{formatDateLabel(selectedDateKey)}</h3>
                {selectedDateEvents.length ? (
                  <div className="calendar-event-list">
                    {selectedDateEvents.map((event) => (
                      <article className="calendar-event-card" key={event.id}>
                        <div className="calendar-event-topline">
                          <span className={`calendar-type-pill is-${event.type}`}>
                            {getEventTypeLabel(event.type)}
                          </span>
                          <div className="calendar-flag-row">
                            {event.isHunterBias ? (
                              <span className="calendar-inline-flag is-bias">★ Bias</span>
                            ) : null}
                            {event.isSpotlight ? (
                              <span className="calendar-inline-flag is-spotlight">Spotlight</span>
                            ) : null}
                          </div>
                        </div>
                        <strong>{event.type === "birthday" ? `${event.idolName}'s Birthday` : event.title}</strong>
                        <p>{getEventMeta(event)}</p>
                        <a href={event.source} rel="noreferrer" target="_blank">
                          Source
                        </a>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="calendar-empty-copy">No verified events are currently stored for this day.</p>
                )}
              </section>

              <section className="calendar-detail-card">
                <p className="panel-label">Local Watch</p>
                <h3>{calendarFeed.localMarket}</h3>
                {localEvents.length ? (
                  <div className="calendar-event-list">
                    {localEvents.map((event) => (
                      <article className="calendar-event-card" key={event.id}>
                        <strong>{event.title}</strong>
                        <p>
                          {formatShortDateLabel(event.startDate)} • {event.venue}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="calendar-empty-copy">
                    No verified {calendarFeed.localMarket} events are currently in the stored window.
                    New local dates can be added on the next monthly refresh.
                  </p>
                )}
              </section>
            </aside>
          </section>

          <section className="calendar-below-grid">
            <section className="calendar-feed-panel">
              <div className="calendar-panel-heading">
                <div>
                  <p className="panel-label">Coming Up Soon</p>
                  <h2>Upcoming dates</h2>
                </div>
              </div>

              <div className="calendar-upcoming-list">
                {upcomingEvents.map((event) => (
                  <article className="calendar-upcoming-card" key={event.id}>
                    <div className="calendar-upcoming-date">{formatShortDateLabel(event.startDate)}</div>
                    <div className="calendar-upcoming-copy">
                      <strong>
                        {event.type === "birthday" ? `${event.idolName}'s Birthday` : event.title}
                      </strong>
                      <p>{getEventMeta(event)}</p>
                    </div>
                    <div className="calendar-upcoming-flags">
                      {event.isHunterBias ? <span className="calendar-inline-flag is-bias">★</span> : null}
                      {event.isSpotlight ? (
                        <span className="calendar-inline-flag is-spotlight">{event.groupName}</span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="calendar-feed-panel">
              <div className="calendar-panel-heading">
                <div>
                  <p className="panel-label">Freshness</p>
                  <h2>Stored window</h2>
                </div>
              </div>

              <div className="calendar-upcoming-list">
                <article className="calendar-upcoming-card">
                  <div className="calendar-upcoming-date">From</div>
                  <div className="calendar-upcoming-copy">
                    <strong>{formatDateLabel(calendarFeed.windowStart)}</strong>
                    <p>This feed stores the next {calendarFeed.monthsAhead} months of verified dates.</p>
                  </div>
                </article>
                <article className="calendar-upcoming-card">
                  <div className="calendar-upcoming-date">To</div>
                  <div className="calendar-upcoming-copy">
                    <strong>{formatDateLabel(calendarFeed.windowEnd)}</strong>
                    <p>Anything outside this range should wait for the next sync instead of staying stale.</p>
                  </div>
                </article>
                <article className="calendar-upcoming-card">
                  <div className="calendar-upcoming-date">Sync</div>
                  <div className="calendar-upcoming-copy">
                    <strong>{formatDateLabel(calendarFeed.generatedAt)}</strong>
                    <p>Refresh the calendar at least once a month to keep releases, birthdays, and events current.</p>
                  </div>
                </article>
              </div>
            </section>

            <section className="calendar-feed-panel">
              <div className="calendar-panel-heading">
                <div>
                  <p className="panel-label">Special Watch</p>
                  <h2>LE SSERAFIM, IVE, NMIXX</h2>
                </div>
              </div>

              <div className="calendar-upcoming-list">
                {spotlightEvents.map((event) => (
                  <article className="calendar-upcoming-card is-spotlight" key={event.id}>
                    <div className="calendar-upcoming-date">{formatShortDateLabel(event.startDate)}</div>
                    <div className="calendar-upcoming-copy">
                      <strong>
                        {event.type === "birthday" ? `${event.idolName}'s Birthday` : event.title}
                      </strong>
                      <p>{getEventMeta(event)}</p>
                    </div>
                    <a
                      className="calendar-source-link"
                      href={event.source}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Source
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </section>
        </section>
      </main>
    </div>
  );
}
