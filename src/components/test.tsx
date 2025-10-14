"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
// import { useFfmpeg } from "@/hooks/useFfmpeg";
import GifConverter from "./converters/GifConverter";
import MkvConverter from "./converters/MkvConverter";
import Mp4Converter from "./converters/Mp4Converter";
import AudioConverter from "./converters/AudioConverter";

type selectFileProps = {
  onFileSelect: (file: File) => void;
  onGifResult?: (gifUrl: string) => void;
  onMkvResult?: (mkvUrl: string) => void;
};

const Test: React.FC<selectFileProps> = ({
  onFileSelect,
  // onGifResult,
  // onMkvResult,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const convertToGifRef = useRef<HTMLButtonElement | null>(null);
  const convertToMkvRef = useRef<HTMLButtonElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gifLoading, setGifLoading] = useState(false);
  const [mkvLoading, setMkvLoading] = useState(false);
  const anyLoading = gifLoading || mkvLoading;
  const [isError, setError] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [mkvUrl, setMkvUrl] = useState<string | null>(null);

  // revoke object URLs when they change or when component unmounts
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      if (mkvUrl) URL.revokeObjectURL(mkvUrl);
    };
  }, [fileUrl, gifUrl, mkvUrl]);

  // const {
  //   convertToGif,
  //   convertToMkv,
  //   convertToMp4,
  //   convertAudioToAc3,
  //   containerCopy,
  // } = useFfmpeg();

  // function to handle file change
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Revoking previous object URL to avoid memory leak
      if (fileUrl) URL.revokeObjectURL(fileUrl);

      const newUrl = URL.createObjectURL(file);
      setFileUrl(newUrl);
      setFileType(file.type);
      setSelectedFile(file);
      setIsLoading(false);
      setGifUrl(null);
      setMkvUrl(null);
      setError(null);
      onFileSelect && onFileSelect(file);
      console.log(file);
    } catch (err: unknown) {
      console.error("handleFileSelect error", err);
      if (err instanceof Error) {
        setError(err?.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError(String(err));
      }
    }
  };

  // conversion UI components will call the hook functions and return blobs/URLs

  return (
    <div className="w-full max-w-3xl mx-auto">
      {isError && (
        <div className="w-48 h-16 text-center bg-red-400 rounded-md">
          <p className=" text-xs font bold text-gray-50">Error: {isError}</p>
        </div>
      )}
      <input
        type="file"
        accept="video/*,image/*"
        ref={inputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {!fileUrl ? (
        <div
          className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <div className="text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-24h8m-4-4v8m-12 4h.02"
              />
            </svg>
            <p className="text-lg">
              Drag and drop your file here, or{" "}
              <span className="text-blue-500">browse</span>
            </p>
            <p className="text-sm mt-2">Supports videos and images</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                // cleanup object URLs
                if (fileUrl) URL.revokeObjectURL(fileUrl);
                if (gifUrl) URL.revokeObjectURL(gifUrl);
                if (mkvUrl) URL.revokeObjectURL(mkvUrl);
                setFileUrl(null);
                setFileType(null);
                setSelectedFile(null);
                setGifUrl(null);
                setMkvUrl(null);
                setError(null);
                // clear input value so same file can be picked again
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">
              Selected File
            </h3>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-700">
              {fileType?.startsWith("video") ? (
                <video
                  src={fileUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  fill
                  src={fileUrl}
                  alt="Selected"
                  className="object-contain"
                />
              )}
            </div>
          </div>
          <div className="space-y-4">
            <GifConverter file={selectedFile} onResult={(u) => setGifUrl(u)} />
            <MkvConverter file={selectedFile} onResult={(u) => setMkvUrl(u)} />
            <Mp4Converter
              file={selectedFile}
              onResult={(u) => {
                /* prefer mp4 for playback */ setMkvUrl(u);
              }}
            />
            <AudioConverter
              file={selectedFile}
              label="Convert to AC3"
              outName="output.ac3"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
