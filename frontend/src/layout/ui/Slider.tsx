"use client";

import * as React from "react";
import { cn } from "../../utils/utils";
import "./Slider.css";

export interface SliderProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "value" | "defaultValue" | "onChange"
  > {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (vals: number[]) => void;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
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
    const [internal, setInternal] = React.useState<number[]>(
      value ?? defaultValue
    );
    const current = (value ?? internal) as number[];

    React.useEffect(() => {
      if (value) setInternal(value);
    }, [value?.join(",")]);

    const handle = (idx: number, next: number) => {
      const nextArr = [...current];
      nextArr[idx] = next;
      setInternal(nextArr);
      onValueChange?.(nextArr);
    };

    const pct = (v: number) => ((v - min) / (max - min)) * 100;

    return (
      <div ref={ref} {...rest} className={cn("slider-root", className)}>
        <div className="slider-track">
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
