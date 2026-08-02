"use client";

import dynamic from "next/dynamic";

const Globe = dynamic(
  () => import("@/components/ui/3d-globe"),
  {
    ssr: false,
  }
);

export default function GlobeWrapper() {
  return (
    <Globe
      className="w-full h-full"
      markers={[
        {
          lat: 5.6037,
          lng: -0.1870,
          label: "Accra",
        },
        {
          lat: 40.7128,
          lng: -74.006,
          label: "New York",
        },
        {
          lat: 51.5072,
          lng: -0.1276,
          label: "London",
        },
        {
          lat: 35.6762,
          lng: 139.6503,
          label: "Tokyo",
        },
      ]}
    />
  );
}