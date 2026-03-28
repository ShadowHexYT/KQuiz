import { useEffect, useMemo, useRef, useState } from "react";

function getFirstWord(label) {
  return label.split(" ")[0] ?? label;
}

const EXCLUDED_ROTATING_LOGOS = new Set([
  "Girlset",
  "Hearts2Hearts",
  "KiiiKiii",
  "ILLIT",
  "KPDH",
  "Kiss of Life",
  "Meovv",
  "XG",
  "Baby DONT Cry",
]);

const GROUP_LOGO_SOURCES = {
  TWICE: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20of%20TWICE.svg",
  "LE SSERAFIM":
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/LE%20SSERAFIM%20logo%20%28White%29.svg",
  NewJeans:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/NewJeans%20logo%20-%20Supernatural.svg",
  IVE: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ive%20logo%20%281%29.svg",
  aespa: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20of%20Aespa%20%28black%29.svg",
  NMIXX: "https://commons.wikimedia.org/wiki/Special:Redirect/file/NMIXX%20logo.svg",
  ILLIT: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Illit%20logo.svg",
  KiiiKiii: "https://www.generasia.com/wiki/Special:Redirect/file/KiiiKiii_logo.png",
  MEOVV: "https://commons.wikimedia.org/wiki/Special:Redirect/file/MEOVV.png",
  KPDH: "https://commons.wikimedia.org/wiki/Special:Redirect/file/KPDH%20logo.png",
};

const FORCE_WORDMARK_LOGOS = new Set([
  "Hearts2Hearts",
  "KiiiKiii",
  "ILLIT",
  "KPDH",
  "Kiss of Life",
  "Meovv",
  "XG",
  "Baby DONT Cry",
]);

function buildFallbackLogo(label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="84" viewBox="0 0 420 84" fill="none">
      <rect width="420" height="84" rx="20" fill="transparent"/>
      <text x="12" y="55" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="2">
        ${label}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function PillNav({
  activeKey = "home",
  onGoHome,
  onOpenModeHub,
  onOpenMode,
  onOpenGroupQuiz,
  onResetApp,
  gameModes = [],
  groupQuizzes = [],
}) {
  const [openMenuKey, setOpenMenuKey] = useState(null);
  const [activeLogoIndex, setActiveLogoIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [logoFallbackMap, setLogoFallbackMap] = useState({});
  const navRef = useRef(null);
  const searchInputRef = useRef(null);

  const playableModes = useMemo(
    () => gameModes.filter((mode) => !mode.comingSoon),
    [gameModes],
  );
  const rotatingLogos = useMemo(
    () =>
      groupQuizzes
        .filter((group) => !EXCLUDED_ROTATING_LOGOS.has(group.label))
        .map((group) => ({
          label: group.label,
          src: GROUP_LOGO_SOURCES[group.label] ?? buildFallbackLogo(group.label),
          forceFallback: FORCE_WORDMARK_LOGOS.has(group.label),
        })),
    [groupQuizzes],
  );
  const activeLogo = rotatingLogos[activeLogoIndex % Math.max(rotatingLogos.length, 1)] ?? null;
  const normalizedSearch = searchValue.trim().toLowerCase();
  const matchedModes = normalizedSearch
    ? playableModes.filter((mode) => `${mode.title} ${mode.category} ${mode.description}`.toLowerCase().includes(normalizedSearch))
    : [];
  const matchedGroups = normalizedSearch
    ? groupQuizzes.filter((group) => `${group.label} ${group.description}`.toLowerCase().includes(normalizedSearch))
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (!navRef.current?.contains(event.target)) {
        setOpenMenuKey(null);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpenMenuKey(null);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!rotatingLogos.length) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveLogoIndex((currentValue) => (currentValue + 1) % rotatingLogos.length);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [rotatingLogos.length]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  function toggleMenu(menuKey) {
    setOpenMenuKey((currentKey) => (currentKey === menuKey ? null : menuKey));
  }

  return (
    <div className="pill-nav-shell">
      <nav className="pill-nav" ref={navRef}>
        {activeLogo ? (
          <div className="pill-nav-logo-wrap" aria-label={`${activeLogo.label} logo`}>
            <img
              alt={`${activeLogo.label} logo`}
              key={activeLogo.label}
              className={`pill-nav-logo ${
                logoFallbackMap[activeLogo.label] || activeLogo.forceFallback ? "is-fallback" : ""
              }`}
              src={
                logoFallbackMap[activeLogo.label] || activeLogo.forceFallback
                  ? buildFallbackLogo(activeLogo.label)
                  : activeLogo.src
              }
              onError={() =>
                setLogoFallbackMap((currentValue) => ({
                  ...currentValue,
                  [activeLogo.label]: true,
                }))
              }
            />
          </div>
        ) : null}

        <button
          className={`pill-nav-item ${activeKey === "home" ? "is-active" : ""}`}
          onClick={() => {
            setOpenMenuKey(null);
            onGoHome?.();
          }}
          type="button"
        >
          Home
        </button>

        <div className={`pill-nav-dropdown ${openMenuKey === "about" ? "is-open" : ""}`}>
          <button
            className={`pill-nav-item ${openMenuKey === "about" ? "is-active" : ""}`}
            onClick={() => toggleMenu("about")}
            type="button"
          >
            About
          </button>

          {openMenuKey === "about" ? (
            <div className="pill-nav-panel">
              <div className="pill-nav-panel-section">
                <p className="pill-nav-kicker">How To Play</p>
                <div className="pill-nav-note-list">
                  <p>Build your party lineup first, then choose a main mode or an individual group quiz.</p>
                  <p>Use the setup panel to turn on teams, rename them, and adjust difficulty before launch.</p>
                  <p>The launch button in the lineup is the final start point for the selected game.</p>
                </div>
              </div>

              <div className="pill-nav-panel-actions">
                <button
                  className="pill-nav-subtle-button"
                  onClick={() => {
                    setOpenMenuKey(null);
                    onGoHome?.();
                  }}
                  type="button"
                >
                  Open Home Setup
                </button>
                <button
                  className="pill-nav-subtle-button"
                  onClick={() => {
                    setOpenMenuKey(null);
                    onOpenModeHub?.();
                  }}
                  type="button"
                >
                  Browse All Games
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className={`pill-nav-dropdown ${openMenuKey === "games" ? "is-open" : ""}`}>
          <button
            className={`pill-nav-item ${activeKey === "games" || openMenuKey === "games" ? "is-active" : ""}`}
            onClick={() => toggleMenu("games")}
            type="button"
          >
            Games
          </button>

          {openMenuKey === "games" ? (
            <div className="pill-nav-panel pill-nav-panel-games">
              <div className="pill-nav-panel-section">
                <p className="pill-nav-kicker">Main Modes</p>
                <div className="pill-nav-game-list">
                  {playableModes.map((mode) => (
                    <button
                      className="pill-nav-game-button"
                      key={mode.id}
                      onClick={() => {
                        setOpenMenuKey(null);
                        onOpenMode?.(mode.id);
                      }}
                      type="button"
                    >
                      <span>{mode.title}</span>
                      <span>{getFirstWord(mode.category)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pill-nav-panel-section">
                <p className="pill-nav-kicker">Group Quizzes</p>
                <div className="pill-nav-game-list is-groups">
                  {groupQuizzes.slice(0, 8).map((group) => (
                    <button
                      className="pill-nav-game-button"
                      key={group.label}
                      onClick={() => {
                        setOpenMenuKey(null);
                        onOpenGroupQuiz?.(group);
                      }}
                      type="button"
                    >
                      <span>{group.label}</span>
                      <span>Group</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pill-nav-settings">
                <button
                  className="pill-nav-subtle-button"
                  onClick={() => {
                    setOpenMenuKey(null);
                    onOpenModeHub?.();
                  }}
                  type="button"
                >
                  Test Mode
                </button>
                <button
                  className="pill-nav-subtle-button is-danger"
                  onClick={() => {
                    setOpenMenuKey(null);
                    onResetApp?.();
                  }}
                  type="button"
                >
                  Reset App
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className={`pill-nav-search ${searchOpen ? "is-open" : ""}`}>
          <button
            aria-label="Open search"
            className="pill-nav-search-toggle"
            onClick={() => {
              setOpenMenuKey(null);
              setSearchOpen((currentValue) => !currentValue);
              if (searchOpen) {
                setSearchValue("");
              }
            }}
            type="button"
          >
            <span className="pill-nav-search-icon" aria-hidden="true">
              ⌕
            </span>
          </button>

          {searchOpen ? (
            <div className="pill-nav-search-panel">
              <input
                className="pill-nav-search-input"
                placeholder="Search games or groups"
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />

              {normalizedSearch ? (
                <div className="pill-nav-search-results">
                  {matchedModes.map((mode) => (
                    <button
                      className="pill-nav-search-result"
                      key={`mode-${mode.id}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchValue("");
                        onOpenMode?.(mode.id);
                      }}
                      type="button"
                    >
                      <span>{mode.title}</span>
                      <span>Mode</span>
                    </button>
                  ))}

                  {matchedGroups.map((group) => (
                    <button
                      className="pill-nav-search-result"
                      key={`group-${group.label}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchValue("");
                        onOpenGroupQuiz?.(group);
                      }}
                      type="button"
                    >
                      <span>{group.label}</span>
                      <span>Group</span>
                    </button>
                  ))}

                  {!matchedModes.length && !matchedGroups.length ? (
                    <div className="pill-nav-search-empty">No results yet</div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
