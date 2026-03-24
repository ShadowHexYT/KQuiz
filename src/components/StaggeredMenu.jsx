import { useEffect, useMemo, useState } from "react";

function isExternalLink(link) {
  return typeof link === "string" && /^https?:\/\//.test(link);
}

function isActionItem(item) {
  return typeof item?.onClick === "function";
}

export default function StaggeredMenu({
  position = "right",
  items = [],
  socialItems = [],
  itemSectionLabel = "Main options",
  socialSectionLabel = "Navigation",
  displaySocials = true,
  displayItemNumbering = true,
  menuButtonColor = "#ffffff",
  openMenuButtonColor = "#ffffff",
  changeMenuColorOnOpen = true,
  colors = ["#ff8d66", "#ff5d8f"],
  logoUrl,
  accentColor = "#ff5d8f",
  onMenuOpen,
  onMenuClose,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      onMenuOpen?.();
      return;
    }

    onMenuClose?.();
  }, [isOpen, onMenuClose, onMenuOpen]);

  const inlineStyles = useMemo(
    () => ({
      "--menu-accent": accentColor,
      "--menu-button-color":
        isOpen && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor,
      "--menu-gradient-start": colors[0] ?? "#ff8d66",
      "--menu-gradient-end": colors[1] ?? "#ff5d8f",
    }),
    [
      accentColor,
      changeMenuColorOnOpen,
      colors,
      isOpen,
      menuButtonColor,
      openMenuButtonColor,
    ],
  );

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div
      className={`staggered-menu-root ${position === "left" ? "is-left" : "is-right"}`}
      style={inlineStyles}
    >
      <button
        className={`menu-toggle ${isOpen ? "is-open" : ""}`}
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`menu-overlay ${isOpen ? "is-visible" : ""}`} onClick={closeMenu} />

      <aside className={`menu-panel ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <div className="menu-panel-inner">
          <div className="menu-brand">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="menu-logo" /> : null}
            <div>
              <p className="menu-kicker">Quiz navigation</p>
              <h2>KPOP Quiz</h2>
            </div>
          </div>

          <div className="menu-section">
            <p className="menu-kicker">{itemSectionLabel}</p>
            <nav className="menu-nav" aria-label="Sidebar navigation">
              {items.map((item, index) => {
                const itemStyle = { transitionDelay: `${120 + index * 75}ms` };
                const itemNumber = String(index + 1).padStart(2, "0");

                if (isActionItem(item)) {
                  return (
                    <button
                      key={`${item.label}-${index}`}
                      className={`menu-link menu-link-button ${isOpen ? "is-open" : ""}`}
                      type="button"
                      aria-label={item.ariaLabel}
                      style={itemStyle}
                      onClick={() => {
                        item.onClick();
                        closeMenu();
                      }}
                    >
                      {displayItemNumbering ? (
                        <span className="menu-link-number">{itemNumber}</span>
                      ) : null}
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <a
                    key={`${item.label}-${index}`}
                    className={`menu-link ${isOpen ? "is-open" : ""}`}
                    href={item.link}
                    aria-label={item.ariaLabel}
                    style={itemStyle}
                    onClick={closeMenu}
                  >
                    {displayItemNumbering ? (
                      <span className="menu-link-number">{itemNumber}</span>
                    ) : null}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {displaySocials ? (
            <div className="menu-socials menu-section">
              <p className="menu-kicker">{socialSectionLabel}</p>
              <div className="menu-social-list">
                {socialItems.map((item, index) => (
                  isActionItem(item) ? (
                    <button
                      key={`${item.label}-${index}`}
                      type="button"
                      className={`menu-social-link menu-social-button ${isOpen ? "is-open" : ""}`}
                      style={{ transitionDelay: `${360 + index * 70}ms` }}
                      onClick={() => {
                        item.onClick();
                        closeMenu();
                      }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      key={`${item.label}-${index}`}
                      href={item.link}
                      className={`menu-social-link ${isOpen ? "is-open" : ""}`}
                      style={{ transitionDelay: `${360 + index * 70}ms` }}
                      target={isExternalLink(item.link) ? "_blank" : undefined}
                      rel={isExternalLink(item.link) ? "noreferrer" : undefined}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
