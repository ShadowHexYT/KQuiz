import { useEffect, useMemo, useState } from "react";

export default function Counter({
  value,
  places = [100, 10, 1],
  fontSize = 80,
  padding = 5,
  gap = 10,
  textColor = "white",
  fontWeight = 900,
  digitPlaceHolders = false,
  trigger = 0,
}) {
  const safeValue = Math.max(0, Number(value) || 0);
  const placesKey = places.join(",");
  const stablePlaces = useMemo(() => places, [placesKey]);
  const [rollingDigits, setRollingDigits] = useState(() =>
    stablePlaces.map((place) => Math.floor(safeValue / place) % 10),
  );

  const targetDigits = useMemo(
    () =>
      stablePlaces.map((place) => {
        const digit = Math.floor(safeValue / place) % 10;
        const hasValueAtPlace = safeValue >= place;

        if (!digitPlaceHolders && !hasValueAtPlace && place !== 1) {
          return { digit, hidden: true };
        }

        return { digit, hidden: false };
      }),
    [digitPlaceHolders, safeValue, stablePlaces],
  );

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;
    let frameId = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      setRollingDigits(
        targetDigits.map(({ digit }, index) => {
          if (progress >= 1) {
            return digit;
          }

          const holdPoint = 0.72 + index * 0.06;
          if (progress >= holdPoint) {
            return digit;
          }

          return (Math.floor(elapsed / 45) + index * 3) % 10;
        }),
      );

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [targetDigits, trigger]);

  return (
    <div className="counter" style={{ gap }}>
      {targetDigits.map(({ hidden }, index) => (
        <span
          className={`counter-digit ${hidden ? "is-hidden" : ""}`}
          key={`${stablePlaces[index]}-${trigger}`}
          style={{
            fontSize,
            padding: `${padding}px`,
            color: textColor,
            fontWeight,
          }}
        >
          {rollingDigits[index]}
        </span>
      ))}
    </div>
  );
}
