"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[600px] flex items-center justify-center bg-muted/20 animate-pulse rounded-lg">
      <div className="w-32 h-32 rounded-full bg-muted/50" />
    </div>
  ),
});

export function HeroSceneDynamic() {
  return <HeroScene />;
}
