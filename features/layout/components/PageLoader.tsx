"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-300">Loading...</p>
      </div>
    </div>
  );
};
