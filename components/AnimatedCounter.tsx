"use client";

import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  target: number;
  prefix?: string;
  suffix?: string;
};

export function AnimatedCounter({
  target,
  prefix = "+",
  suffix = "",
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1100;
    const start = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return (
    <span>
      {prefix}
      {value.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}
