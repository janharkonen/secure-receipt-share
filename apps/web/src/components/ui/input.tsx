import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "bg-card border-border focus-visible:border-primary focus-visible:ring-primary/30 aria-invalid:ring-destructive/20 aria-invalid:border-destructive disabled:bg-muted/50 h-10 rounded-xl border px-4 py-2 text-sm transition-all duration-200 file:h-6 file:text-sm file:font-medium focus-visible:ring-2 aria-invalid:ring-1 file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 shadow-sm focus-visible:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
