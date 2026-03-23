import { useEffect, useState } from "react";

function getItemLabel(item) {
  return typeof item === "string" ? item : item.label;
}

function getItemDescription(item) {
  return typeof item === "string" ? "" : item.description;
}

export default function AnimatedList({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = false,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return undefined;

    const intervalId = window.setInterval(() => {
      setSelectedIndex((currentIndex) => (currentIndex + 1) % items.length);
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, [items]);

  useEffect(() => {
    if (!enableArrowNavigation) return undefined;

    function handleKeyDown(event) {
      if (!items.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((currentIndex) => (currentIndex + 1) % items.length);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((currentIndex) =>
          currentIndex === 0 ? items.length - 1 : currentIndex - 1,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableArrowNavigation, items]);

  function handleSelect(item, index) {
    setSelectedIndex(index);
    onItemSelect?.(item, index);
  }

  return (
    <div className={`animated-list-shell ${showGradients ? "with-gradients" : ""}`}>
      <div
        className={`animated-list ${displayScrollbar ? "show-scrollbar" : "hide-scrollbar"}`}
        role="listbox"
        aria-label="Animated item list"
      >
        {items.map((item, index) => {
          const isActive = index === selectedIndex;
          const label = getItemLabel(item);
          const description = getItemDescription(item);

          return (
            <button
              key={`${label}-${index}`}
              className={`animated-list-item ${isActive ? "is-active" : ""}`}
              onClick={() => handleSelect(item, index)}
              type="button"
            >
              <span className="animated-list-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="animated-list-copy">
                <span className="animated-list-label">{label}</span>
                {description ? (
                  <span className="animated-list-description">{description}</span>
                ) : null}
              </span>
              <span className="animated-list-action">Start</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
