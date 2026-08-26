"use client";

import Globe from "@/components/ui/3d-globe";
import { cn } from "@/lib/utils";

interface GlobeWrapperProps {
  onReady?: () => void;
  className?: string;
}

export default function GlobeWrapper({
  onReady,
  className,
}: GlobeWrapperProps) {
  return (
    <div
      className={cn(
        "w-full h-full",
        className,
      )}
    >
      <Globe
        className="w-full h-full"
        markers={[]}
        onReady={onReady}
      />
    </div>
  );
}