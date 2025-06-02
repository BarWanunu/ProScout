/* ------------------------------------------------------------------
   Generic Slider  – no Tailwind colours required
------------------------------------------------------------------ */
"use client";

import * as React from "react";
import { cn } from "../../lib/utils";                // ↆ keep your helper
import "./Slider.css";                               // ↆ new stylesheet

/**
 * Props are unchanged – you can still pass:
 *   value, defaultValue, min, max, step, onValueChange, className …
 */
const Slider = React.forwardRef(
  (
    {
      value,
      defaultValue = [0],
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      className,
      ...rest
    },
    ref
  ) => {
    /* allow both controlled and uncontrolled use */
    const [internal, setInternal] = React.useState(value ?? defaultValue);
    const current = value ?? internal;

    const handle = (idx, next) => {
      const nextArr = [...current];
      nextArr[idx] = next;
      setInternal(nextArr);
      onValueChange?.(nextArr);
    };

    const pct = (v) => ((v - min) / (max - min)) * 100;

    return (
      <div ref={ref} {...rest} className={cn("slider-root", className)}>
        {/* ── track ── */}
        <div className="slider-track">
          {/* filled range (single or double) */}
          {current.length === 1 ? (
            <div
              className="slider-fill"
              style={{ width: `${pct(current[0])}%` }}
            />
          ) : (
            <div
              className="slider-fill"
              style={{
                left: `${pct(Math.min(...current))}%`,
                width: `${
                  pct(Math.max(...current)) - pct(Math.min(...current))
                }%`,
              }}
            />
          )}

          {/* invisible <input type="range"> elements */}
          {current.map((val, idx) => (
            <input
              key={idx}
              type="range"
              min={min}
              max={max}
              step={step}
              value={val}
              onChange={(e) => handle(idx, Number(e.target.value))}
              className="slider-input"
              style={{ zIndex: 10 + idx }}
            />
          ))}

          {/* visible thumbs */}
          {current.map((val, idx) => (
            <div
              key={`thumb-${idx}`}
              className="slider-thumb"
              style={{ left: `${pct(val)}%` }}
            />
          ))}
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";
export { Slider };
