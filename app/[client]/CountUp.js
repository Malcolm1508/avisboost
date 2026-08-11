"use client";
import { useEffect, useRef, useState } from "react";

// Petit compteur animé : monte de 0 jusqu'à la valeur, une seule fois au chargement.
export default function CountUp({ value = 0, duration = 1100 }) {
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const to = Number(value) || 0;
    const start = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setN(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{n}</>;
}
