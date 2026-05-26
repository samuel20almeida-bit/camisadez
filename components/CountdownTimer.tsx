"use client";

import { useEffect, useState } from "react";

const COPA_DATE = new Date("2026-06-11T16:00:00Z");

function getTimeLeft() {
  const diff = Math.max(0, COPA_DATE.getTime() - Date.now());
  return {
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff % 864e5) / 36e5),
    minutes: Math.floor((diff % 36e5) / 6e4),
    seconds: Math.floor((diff % 6e4) / 1e3),
  };
}

export function CountdownTimer({ className }: { className?: string }) {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: time.days, label: "dias" },
    { value: time.hours, label: "hrs" },
    { value: time.minutes, label: "min" },
    { value: time.seconds, label: "seg" },
  ];

  return (
    <div className={className}>
      <div className="flex items-center gap-1.5">
        {units.map(({ value, label }, i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center">
              <span className="min-w-[2ch] text-center text-lg font-black tabular-nums leading-none text-brasil-yellow">
                {String(value).padStart(2, "0")}
              </span>
              <span className="text-[0.6rem] font-bold uppercase leading-none text-white/60">
                {label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="mb-3 text-sm font-black text-brasil-yellow/60">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
