"use client";

import React, { createContext, useContext } from "react";
import { useFfmpeg } from "./useFfmpeg";

const FfmpegContext = createContext<any>(null);

// ffmpeg provider that returns all the ffmpeg apis
const FfmpegProvider = ({ children }: { children: React.ReactNode }) => {
  const api = useFfmpeg();
  return (
    <FfmpegContext.Provider value={api}>{children}</FfmpegContext.Provider>
  );
};

// this is used for consuming the ffmpeg context and throwing error if not used inside the provider
const useFfmpegContext = () => {
  const the_context = useContext(FfmpegContext);
  if (!the_context)
    throw new Error("useFfmpegContext must be used inside FfmpegProvider");
  return the_context as ReturnType<typeof useFfmpeg>;
};

export { FfmpegProvider, useFfmpegContext };
