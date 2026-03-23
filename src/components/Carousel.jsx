import { useEffect, useMemo } from "react";

export default function Carousel({
  items = [],
  activeIndex = 0,
  onSelect,
  baseWidth = 280,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = true,
  round = false,
  isPaused = false,
}) {
  const safeIndex = useMemo(() => {
    if (!items.length) return 0;
    return Math.min(Math.max(activeIndex, 0), items.length - 1);
  }, [activeIndex, items.length]);

  useEffect(() => {
    if (!autoplay || isPaused || items.length <= 1) return undefined;

    const timer = window.setTimeout(() => {
      const nextIndex = safeIndex + 1;

      if (nextIndex >= items.length) {
        if (loop) {
          onSelect?.(0);
        }
        return;
      }

      onSelect?.(nextIndex);
    }, autoplayDelay);

    return () => window.clearTimeout(timer);
  }, [autoplay, autoplayDelay, isPaused, items.length, loop, onSelect, safeIndex]);

  return (
    <div
      className={`carousel-shell ${round ? "is-round" : ""}`}
      style={{ "--carousel-base-width": `${baseWidth}px` }}
    >
      <div className="carousel-track" role="listbox" aria-label="Game modes">
        {items.map((item, index) => {
          const offset = index - safeIndex;
          const isActive = index === safeIndex;

          return (
            <button
              aria-selected={isActive}
              className={`carousel-card ${isActive ? "is-active" : ""}`}
              key={item.id ?? item.title ?? index}
              onClick={() => onSelect?.(index)}
              style={{
                transform: `translateX(calc(-50% + ${offset * 72}%)) scale(${isActive ? 1 : 0.88})`,
                zIndex: items.length - Math.abs(offset),
                opacity: Math.abs(offset) > 1 ? 0 : 1,
                pointerEvents: Math.abs(offset) > 1 ? "none" : "auto",
              }}
              type="button"
            >
              <p className="mode-label">Game mode</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className={`carousel-status ${isActive ? "is-selected" : ""}`}>
                {isActive ? "Selected" : "Tap to select"}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
