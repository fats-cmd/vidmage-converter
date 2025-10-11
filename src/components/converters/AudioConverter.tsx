"use client";

import React from "react";
import ConversionCard from "./ConversionCard";
import { useFfmpegContext } from "../../hooks/FfmpegProvider";

type Props = {
  file: File | null;
  label?: string;
  outName?: string;
  onResult?: (url: string) => void;
};

export default function AudioConverter({
  file,
  label = "Convert audio",
  outName = "output.ac3",
  onResult,
}: Props) {
  const { convertAudioToAc3, containerCopy } = useFfmpegContext();

  return (
    <ConversionCard
      label={label}
      downloadName={outName}
      onResult={onResult}
      run={async (onProgress?: (p: number) => void) => {
        if (!file) throw new Error("No file selected");
        try {
          // prefer conversion, fallback to container copy
          const blob = await convertAudioToAc3(file, (r: number) =>
            onProgress?.(r)
          ).catch(() => containerCopy(file, outName));
          return blob;
        } catch (err) {
          throw err;
        }
      }}
    >
      {(url: string | null) =>
        url ? (
          <div>
            <audio src={url} controls />
            <a href={url} download={outName} className="block text-blue-600">
              Download {outName}
            </a>
          </div>
        ) : null
      }
    </ConversionCard>
  );
}
