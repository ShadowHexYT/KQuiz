import { useEffect, useMemo, useRef, useState } from "react";

function getAxis(direction) {
  return direction === "horizontal" ? "X" : "Y";
}

function getOffset(distance, direction, reverse) {
  const axis = getAxis(direction);
  const signedDistance = reverse ? -distance : distance;
  return axis === "X"
    ? `translate3d(${signedDistance}px, 0, 0)`
    : `translate3d(0, ${signedDistance}px, 0)`;
}

export default function AnimatedContent({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "ease",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  const style = useMemo(
    () => ({
      opacity: isVisible ? 1 : animateOpacity ? initialOpacity : 1,
      transform: isVisible
        ? "translate3d(0, 0, 0) scale(1)"
        : `${getOffset(distance, direction, reverse)} scale(${scale})`,
      transitionDuration: `${duration}s`,
      transitionTimingFunction: ease,
      transitionDelay: `${delay}s`,
      transitionProperty: "opacity, transform",
      willChange: "opacity, transform",
    }),
    [
      animateOpacity,
      delay,
      direction,
      distance,
      duration,
      ease,
      initialOpacity,
      isVisible,
      reverse,
      scale,
    ],
  );

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}
