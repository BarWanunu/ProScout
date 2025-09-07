"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/utils";

/* ---------- types ---------- */
export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (val: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export interface SelectValueProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string; // נרשה את prop הזה כדי לא לשבור קוד קיים
}
/* ---------- Root ---------- */
const SelectRoot = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    { value, onValueChange, placeholder, className, children, ...rest },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(value ?? "");

    React.useEffect(() => {
      if (value !== undefined && value !== selected) setSelected(value);
    }, [value, selected]);

    const handleChange = (val: string) => {
      setSelected(val);
      onValueChange?.(val);
      setIsOpen(false);
    };

    return (
      <div className={cn("relative", className)} ref={ref} {...rest}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          /* ---------- Trigger ---------- */
          if ((child.type as any) === SelectTrigger) {
            const triggerEl = child as React.ReactElement<
              React.HTMLAttributes<HTMLDivElement>
            >;
            return React.cloneElement(triggerEl, {
              onClick: () => setIsOpen((o) => !o),
              children: (
                <>
                  <SelectValue>
                    {selected || placeholder || "Select…"}
                  </SelectValue>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </>
              ),
            } as any);
          }

          /* ---------- Content (only when open) ---------- */
          if ((child.type as any) === SelectContent) {
            if (!isOpen) return null;

            const contentEl = child as React.ReactElement<
              React.HTMLAttributes<HTMLDivElement>
            >;

            const wiredItems = React.Children.map(
              (contentEl.props as any).children as React.ReactNode,
              (item) => {
                if (
                  !React.isValidElement(item) ||
                  (item.type as any) !== SelectItem
                )
                  return item;
                const itemEl = item as React.ReactElement<SelectItemProps>;
                return React.cloneElement(itemEl, {
                  onClick: () => handleChange(itemEl.props.value),
                } as any);
              }
            );

            return React.cloneElement(contentEl, {}, wiredItems);
          }

          return child;
        })}
      </div>
    );
  }
);

/* ---------- sub parts ---------- */
const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...p }, ref) => (
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

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...p }, ref) => (
  <div
    ref={ref}
    {...p}
    className={cn(
      "absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg",
      className
    )}
  />
));

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, ...p }, ref) => (
    <div
      ref={ref}
      {...p}
      className={cn(
        "px-3 py-1.5 text-sm hover:bg-blue-50 cursor-pointer",
        className
      )}
    />
  )
);

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, ...p }, ref) => (
    <span
      ref={ref}
      {...p}
      className={cn("truncate text-left flex-1", className)}
    />
  )
);

/* ---------- exports ---------- */
export {
  SelectRoot as Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
};

SelectRoot.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";
SelectValue.displayName = "SelectValue";
