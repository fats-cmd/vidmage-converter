"use client";

import React from "react";
import ConversionCard from "./ConversionCard";
import { useFfmpegContext } from "../../hooks/FfmpegProvider";

type Props = { file: File | null; onResult?: (url: string) => void };

export default function Mp4Converter({ file, onResult }: Props) {
  const { convertToMp4 } = useFfmpegContext();

  return (
    <ConversionCard
      label="Convert to MP4"
      downloadName="output.mp4"
      run={async (onProgress?: (p: number) => void) => {
        if (!file) throw new Error("No file selected");
        const blob = await convertToMp4(file, (r: number) => onProgress?.(r));
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
          <div>
            <video src={url} controls className="max-w-full" />
            <a href={url} download="output.mp4" className="block text-blue-600">
              Download MP4
            </a>
          </div>
        ) : null
      }
    </ConversionCard>
  );
}
