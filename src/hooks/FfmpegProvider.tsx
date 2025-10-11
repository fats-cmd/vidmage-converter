"use client";

import React, { createContext, useContext } from "react";
import { useFfmpeg } from "./useFfmpeg";

const FfmpegContext = createContext<any>(null);

export function FfmpegProvider({ children }: { children: React.ReactNode }) {
  const api = useFfmpeg();
  return (
    <FfmpegContext.Provider value={api}>{children}</FfmpegContext.Provider>
  );
}

export function useFfmpegContext() {
  const ctx = useContext(FfmpegContext);
  if (!ctx)
    throw new Error("useFfmpegContext must be used inside FfmpegProvider");
  return ctx as ReturnType<typeof useFfmpeg>;
}
