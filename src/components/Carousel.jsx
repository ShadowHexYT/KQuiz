import { useEffect, useMemo } from "react";

export default function Carousel({
  items = [],
  activeIndex = 0,
  selectedIndex = null,
  onSelect,
  baseWidth = 280,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = true,
  round = false,
  isPaused = false,
}) {
  const itemCount = items.length;
  const safeIndex = useMemo(() => {
    if (!itemCount) return 0;
    return Math.min(Math.max(activeIndex, 0), itemCount - 1);
  }, [activeIndex, itemCount]);

  const visibleItems = useMemo(() => {
    if (!itemCount) {
      return [];
    }

    return items.map((item, index) => {
      let offset = index - safeIndex;

      if (loop && itemCount > 2) {
        if (offset > itemCount / 2) {
          offset -= itemCount;
        } else if (offset < -itemCount / 2) {
          offset += itemCount;
        }
      }

      return {
        item,
        index,
        offset,
      };
    });
  }, [itemCount, items, loop, safeIndex]);

  useEffect(() => {
    if (!autoplay || isPaused || itemCount <= 1) return undefined;

    const timer = window.setTimeout(() => {
      const nextIndex = safeIndex + 1;

      if (nextIndex >= itemCount) {
        if (loop) {
          onSelect?.(0);
        }
        return;
      }

      onSelect?.(nextIndex);
    }, autoplayDelay);

    return () => window.clearTimeout(timer);
  }, [autoplay, autoplayDelay, isPaused, itemCount, loop, onSelect, safeIndex]);

  return (
    <div
      className={`carousel-shell ${round ? "is-round" : ""}`}
      style={{ "--carousel-base-width": `${baseWidth}px` }}
    >
      <div className="carousel-track" role="listbox" aria-label="Game modes">
        {visibleItems.map(({ item, index, offset }) => {
          const isActive = index === safeIndex;
          const isSelected = index === selectedIndex;

          return (
            <button
              aria-selected={isSelected}
              className={`carousel-card ${isActive ? "is-active" : ""} ${isSelected ? "is-chosen" : ""}`}
              key={item.id ?? item.title ?? index}
              onClick={() => onSelect?.(index)}
              style={{
                transform: `translateX(calc(-50% + ${offset * 72}%)) scale(${isActive ? 1 : 0.88})`,
                zIndex: itemCount - Math.abs(offset),
                opacity: Math.abs(offset) > 1 ? 0 : 1,
                pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
              }}
              type="button"
            >
              <p className="mode-label">Game mode</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {isSelected ? (
                <span className="carousel-status is-selected">Selected</span>
              ) : null}
            </button>
          );
        })}
      </div>

    </div>
  );
}
