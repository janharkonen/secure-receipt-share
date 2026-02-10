import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 pt-8">
      <Loader2 className="animate-spin text-primary size-8" />
      <span className="text-sm text-muted-foreground animate-pulse">
        Hang tight...
      </span>
    </div>
  );
}
