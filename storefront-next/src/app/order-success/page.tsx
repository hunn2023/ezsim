"use client";

import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-container mx-auto px-4 md:px-6 py-8">
          <div className="animate-pulse space-y-4 text-center">
            <div className="h-24 bg-gray-100 rounded-full mx-auto w-24" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
            <div className="h-4 bg-gray-100 rounded w-48 mx-auto" />
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}