"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function SuccessConfetti() {
  useEffect(() => {
    const colors = ["#009C3B", "#FFDF00", "#002776", "#ffffff", "#00C4C8"];

    confetti({ particleCount: 130, spread: 80, origin: { y: 0.55 }, colors });

    const t = setTimeout(() => {
      confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors });
      confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors });
    }, 350);

    return () => clearTimeout(t);
  }, []);

  return null;
}
