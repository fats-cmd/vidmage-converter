"use client";

import React from "react";
import ConversionCard from "./ConversionCard";
import { useFfmpegContext } from "../../hooks/FfmpegProvider";

type Props = { file: File | null; onResult?: (url: string) => void };

export default function GifConverter({ file, onResult }: Props) {
  const { convertToGif } = useFfmpegContext();

  return (
    <ConversionCard
      label="Convert to GIF"
      downloadName="output.gif"
      run={async (onProgress?: (p: number) => void) => {
        if (!file) throw new Error("No file selected");
        const blob = await convertToGif(file, 5, (r: number) =>
          onProgress?.(r)
        );
        if (blob) {
          const url = URL.createObjectURL(blob);
          onResult?.(url);
          return blob;
        }
        return null;
      }}
    >
      {(url: string | null) =>
        url ? (
          <img
            src={url}
            alt="gif preview"
            className="w-full rounded object-contain"
          />
        ) : null
      }
    </ConversionCard>
  );
}
