"use client";

import React from "react";

interface CountUpProps {
  target: string | number;
  duration?: number;
  trigger?: unknown;
}

export default function CountUp({ target, duration = 800, trigger }: CountUpProps) {
  const [value, setValue] = React.useState<number>(() => Number(target) || 0);

  React.useEffect(() => {
    let raf = 0;
    const to = Number(target) || 0;
    const start = performance.now();

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.round(progress * to);
      setValue(current);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    }

    // start from 0 on each trigger
    setValue(0);
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  // trigger is used to restart animation; include target too
  }, [trigger, target, duration]);

  return <>{value}</>;
}
