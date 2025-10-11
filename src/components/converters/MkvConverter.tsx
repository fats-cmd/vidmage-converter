"use client";

import React from "react";
import ConversionCard from "./ConversionCard";
import { useFfmpegContext } from "../../hooks/FfmpegProvider";

type Props = { file: File | null; onResult?: (url: string) => void };

export default function MkvConverter({ file, onResult }: Props) {
  const { convertToMkv } = useFfmpegContext();

  return (
    <ConversionCard
      label="Convert to MKV"
      downloadName="output.mkv"
      run={async (onProgress?: (p: number) => void) => {
        if (!file) throw new Error("No file selected");
        const blob = await convertToMkv(file, (r: number) => onProgress?.(r));
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
            <a href={url} download="output.mkv" className="block text-blue-600">
              Download MKV
            </a>
          </div>
        ) : null
      }
    </ConversionCard>
  );
}
