"use client";

import { useEffect, useState } from "react";
import { getEsimCountries } from "@/lib/api/esimApi";
import type { EsimCountrySummary } from "@/types/esim";
import EsimDuLichContent from "./EsimDuLichContent";

export default function EsimDuLichWrapper() {
  const [destinations, setDestinations] = useState<EsimCountrySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEsimCountries()
      .then(setDestinations)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <EsimDuLichContent destinations={destinations} />;
}
