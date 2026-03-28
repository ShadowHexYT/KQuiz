import { useEffect, useRef, useState } from "react";

function getItemLabel(item) {
  return typeof item === "string" ? item : item.label;
}

function getItemDescription(item) {
  return typeof item === "string" ? "" : item.description;
}

export default function AnimatedList({
  items = [],
  onItemSelect,
  onActiveItemChange,
  selectedItemLabel = null,
  autoplay = true,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = false,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const resumeTimerRef = useRef(null);
  const programmaticScrollRef = useRef(false);

  function scheduleAutoResume() {
    setIsUserInteracting(true);

    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      setIsUserInteracting(false);
      resumeTimerRef.current = null;
    }, 10000);
  }

  useEffect(() => {
    if (!items.length) return undefined;
    if (!autoplay) return undefined;
    if (isUserInteracting) return undefined;

    const intervalId = window.setInterval(() => {
      setSelectedIndex((currentIndex) => (currentIndex + 1) % items.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [autoplay, isUserInteracting, items]);

  useEffect(() => {
    if (!items.length || !selectedItemLabel) return;

    const matchedIndex = items.findIndex((item) => getItemLabel(item) === selectedItemLabel);

    if (matchedIndex >= 0) {
      setSelectedIndex(matchedIndex);
    }
  }, [items, selectedItemLabel]);

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

  useEffect(() => {
    if (!items.length) return;
    onActiveItemChange?.(items[selectedIndex], selectedIndex);
  }, [items, onActiveItemChange, selectedIndex]);

  useEffect(() => {
    const listElement = listRef.current;
    const activeItem = itemRefs.current[selectedIndex];

    if (!listElement || !activeItem || isUserInteracting) return;

    const itemCenter = activeItem.offsetTop + activeItem.offsetHeight / 2;
    const containerCenter = listElement.clientHeight / 2;
    const maxScrollTop = Math.max(0, listElement.scrollHeight - listElement.clientHeight);
    const nextTop = Math.max(0, Math.min(itemCenter - containerCenter, maxScrollTop));
    const behavior = selectedIndex === 0 ? "auto" : "smooth";
    programmaticScrollRef.current = true;

    listElement.scrollTo({
      top: nextTop,
      behavior,
    });

    const resetProgrammaticScroll = window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, behavior === "smooth" ? 450 : 50);

    return () => window.clearTimeout(resetProgrammaticScroll);
  }, [isUserInteracting, selectedIndex]);

  useEffect(
    () => () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    },
    [],
  );

  function handleSelect(item, index) {
    setSelectedIndex(index);
    onItemSelect?.(item, index);
  }

  return (
    <div className={`animated-list-shell ${showGradients ? "with-gradients" : ""}`}>
      <div
        ref={listRef}
        className={`animated-list ${displayScrollbar ? "show-scrollbar" : "hide-scrollbar"}`}
        role="listbox"
        aria-label="Animated item list"
        onScroll={() => {
          if (programmaticScrollRef.current) return;
          scheduleAutoResume();
        }}
        onTouchMove={scheduleAutoResume}
        onWheel={scheduleAutoResume}
      >
        {items.map((item, index) => {
          const isActive = index === selectedIndex;
          const label = getItemLabel(item);
          const description = getItemDescription(item);
          const isSelectedSource = selectedItemLabel === label;

          return (
            <button
              key={`${label}-${index}`}
              className={`animated-list-item ${isActive ? "is-active" : ""} ${isSelectedSource ? "is-selected-source" : ""}`}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              onClick={() => handleSelect(item, index)}
              type="button"
            >
              <span className="animated-list-copy">
                <span className="animated-list-label">{label}</span>
                {description ? (
                  <span className="animated-list-description">{description}</span>
                ) : null}
              </span>
              <span className={`animated-list-action ${isSelectedSource ? "is-selected" : ""}`}>
                <span>{isSelectedSource ? "Selected" : "Select"}</span>
                {isSelectedSource ? <span className="animated-list-check">✓</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
