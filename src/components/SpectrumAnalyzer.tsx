"use client";

import { useEffect, useState, useRef } from "react";

const NUM_EQ_BARS = 16;
const NUM_SEGMENTS = 10;
const DECAY_RATE = 0.38;
const TICK_RATE_MS = 40;

const FREQ_LABELS = [
  "31", "63", "125", "250", "500", "1k", "2k", "4k", 
  "6k", "8k", "10k", "12k", "14k", "16k", "18k", "20k"
];

export default function SpectrumAnalyzer({ isPlaying }: { isPlaying: boolean }) {
  const [displayLevels, setDisplayLevels] = useState<number[]>(() =>
    Array(NUM_EQ_BARS).fill(1)
  );

  const currentLevelsRef = useRef<number[]>(Array(NUM_EQ_BARS).fill(1));
  const tickCountRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      tickCountRef.current += 1;
      const tick = tickCountRef.current;

      const isKick = isPlaying && tick % 14 === 0;
      const isSnare = isPlaying && (tick + 7) % 14 === 0;

      const nextLevels = currentLevelsRef.current.map((currentVal, i) => {
        if (!isPlaying) {
          return Math.max(1, currentVal - DECAY_RATE);
        }

        const pos = i / (NUM_EQ_BARS - 1);
        let target = 1;

        if (i < 4) {
          // Low & Sub Bass (Bars 0-3): Punchy rhythmic kick
          const bassFloor = 3.5 + Math.random() * 3.5;
          const kickBoost = isKick ? 3.0 : 0;
          target = Math.min(NUM_SEGMENTS, bassFloor + kickBoost);
        } else if (i < 10) {
          // Midrange & Vocals (Bars 4-9): Core musical body
          const midFloor = 3.0 + Math.random() * 4.5;
          const snareBoost = isSnare && (i === 6 || i === 7) ? 2.2 : 0;
          target = Math.min(NUM_SEGMENTS, midFloor + snareBoost);
        } else {
          // Highs & Treble (Bars 10-15): Rolloff with cymbal transients
          const curve = 1.0 - (pos - 0.6) * 0.85;
          const transient = Math.random() > 0.6 ? Math.random() * 4.2 : 1.2;
          target = Math.max(1, Math.min(NUM_SEGMENTS, (2 + transient) * curve));
        }

        return target > currentVal ? target : Math.max(1, currentVal - DECAY_RATE);
      });

      currentLevelsRef.current = nextLevels;
      setDisplayLevels(nextLevels.map((val) => Math.round(val)));
    }, TICK_RATE_MS);

    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <footer className="w-full max-w-2xl rounded-xl border border-zinc-800/90 bg-zinc-950/85 p-4 shadow-2xl backdrop-blur-md">
      {/* Header bar: Title removed, status aligned cleanly to the right */}
      <div className="mb-2.5 flex items-center justify-end text-[10px] font-semibold uppercase tracking-wider">
        <span className={isPlaying ? "text-emerald-400 font-medium" : "text-zinc-600"}>
          {isPlaying ? "Signal Active" : "Standby"}
        </span>
      </div>

      {/* 16-Band LED Display Tray */}
      <div className="rounded-lg border border-zinc-900 bg-black/75 p-3">
        <div className="flex h-24 items-end justify-between gap-1.5 sm:gap-2">
          {displayLevels.map((level, barIdx) => (
            <div
              key={barIdx}
              className="flex h-full flex-1 flex-col-reverse justify-start gap-[2.5px]"
            >
              {Array.from({ length: NUM_SEGMENTS }).map((_, segmentIdx) => {
                const isLit = segmentIdx < level;

                // INVERTED COLOR SCHEME (Standard Hardware Layout):
                // Bottom (0-4): Green (Normal Signal)
                // Mid (5-7): Amber / Yellow (High Signal)
                // Top (8-9): Red (Peak / Limit)
                let litStyle = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]";
                let unlitStyle = "bg-emerald-950/20";

                if (segmentIdx >= 8) {
                  litStyle = "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]";
                  unlitStyle = "bg-rose-950/20";
                } else if (segmentIdx >= 5) {
                  litStyle = "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]";
                  unlitStyle = "bg-amber-950/20";
                }

                return (
                  <div
                    key={segmentIdx}
                    className={`h-[6.5px] w-full rounded-[1.5px] transition-colors duration-75 ${
                      isLit ? litStyle : unlitStyle
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Frequency Scale Labels */}
        <div className="mt-2 flex justify-between gap-1.5 sm:gap-2 border-t border-zinc-900/80 pt-1.5 text-[8px] text-zinc-600 select-none">
          {FREQ_LABELS.map((freq, i) => (
            <div key={i} className="flex-1 text-center truncate">
              {freq}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}