import * as React from "react";

import { cn } from "@/lib/cn";

/** A control — takes the fill on selection (ui-design-language.md §8). */
export const FilterSet = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("filter-set", className)} {...props} />;
  },
);
FilterSet.displayName = "FilterSet";

export interface FilterSegmentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  count?: number;
}

export const FilterSegment = React.forwardRef<HTMLButtonElement, FilterSegmentProps>(
  ({ className, pressed, count, children, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={pressed}
        className={cn("filter-seg", className)}
        {...props}
      >
        <span>{children}</span>
        {count !== undefined && <span className="n">{count}</span>}
      </button>
    );
  },
);
FilterSegment.displayName = "FilterSegment";
