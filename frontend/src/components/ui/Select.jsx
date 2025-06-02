"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

/* ───────────── Root ─────────────────────────────────────────── */
const SelectRoot = React.forwardRef(
  ({ value, onValueChange, placeholder, className, children }, _ref) => {
    const [isOpen, setIsOpen]        = React.useState(false);
    const [selected, setSelected]    = React.useState(value ?? "");

    /* keep internal state in-sync with parent-controlled value prop */
    React.useEffect(() => {
      if (value !== undefined && value !== selected) setSelected(value);
    }, [value]);            // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (val) => {
      setSelected(val);
      onValueChange?.(val);
      setIsOpen(false);
    };

    /* iterate over the children tree and inject the needed props */
    return (
      <div className={cn("relative", className)} ref={_ref}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          /* ---------- Trigger ---------- */
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, {
              onClick: () => setIsOpen(!isOpen),
              children: (
                <>
                  <SelectValue>
                    {selected || placeholder || "Select…"}
                  </SelectValue>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </>
              ),
            });
          }

          /* ---------- Content (show only if open) ---------- */
          if (child.type === SelectContent) {
            if (!isOpen) return null;

            // drill one level deeper and wire each item
            const wiredItems = React.Children.map(child.props.children, (item) => {
              if (!React.isValidElement(item) || item.type !== SelectItem) return item;
              return React.cloneElement(item, {
                onClick: () => handleChange(item.props.value),
              });
            });

            return React.cloneElement(child, {}, wiredItems);
          }

          return child;
        })}
      </div>
    );
  }
);

/* ───────────── Sub-parts (style-only) ───────────────────────── */
const SelectTrigger = React.forwardRef(({ className, ...p }, ref) => (
  <div
    ref={ref}
    {...p}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
      "bg-white text-gray-700 shadow-sm cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
  />
));

const SelectContent = React.forwardRef(({ className, ...p }, ref) => (
  <div
    ref={ref}
    {...p}
    className={cn(
      "absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg",
      className
    )}
  />
));

const SelectItem = React.forwardRef(({ className, ...p }, ref) => (
  <div
    ref={ref}
    {...p}
    className={cn(
      "px-3 py-1.5 text-sm hover:bg-blue-50 cursor-pointer",
      className
    )}
  />
));

const SelectValue = React.forwardRef(({ className, ...p }, ref) => (
  <span
    ref={ref}
    {...p}
    className={cn("truncate text-left flex-1", className)}
  />
));

/* ---------- exports ---------- */
export {
  SelectRoot as Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
};
