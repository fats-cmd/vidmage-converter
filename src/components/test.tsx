"use client";

import React, { useRef, useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import Image from "next/image";

type selectFileProps = {
  onFileSelect: (file: File) => void;
  onGifResult?: (gifUrl: string) => void;
  onMkvResult?: (mkvUrl: string) => void;
};

const Test: React.FC<selectFileProps> = ({
  onFileSelect,
  onGifResult,
  onMkvResult,
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

  const ffmpegRef = useRef<FFmpeg | null>(null);

  // function to load ffmpeg if not loaded
  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    const baseURL =
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
    const ffmpeg = new FFmpeg();
    // load accepts URLs or blobs; using toBlobURL ensures same-origin for wasm/core
    const coreURL = await toBlobURL(
      `${baseURL}/ffmpeg-core.js`,
      "text/javascript"
    );
    const wasmURL = await toBlobURL(
      `${baseURL}/ffmpeg-core.wasm`,
      "application/wasm"
    );
    await ffmpeg.load({ coreURL, wasmURL });
    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  //   function to handle file change
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

  // function to convert to GIF
  const convertToGif = async () => {
    console.log("convertToGif called");
    if (!selectedFile) {
      alert("Please upload file first.");
      return;
    }

    setIsLoading(true);
    setGifLoading(true);
    try {
      const ffmpeg = await loadFFmpeg();
      await ffmpeg.writeFile("input", await fetchFile(selectedFile));
      let gifArgs: string[];
      if (selectedFile.type.startsWith("video")) {
        gifArgs = [
          "-i",
          "input",
          "-t",
          "5",
          "-vf",
          "scale=320:-1",
          "output.gif",
        ];
      } else if (selectedFile.type.startsWith("image")) {
        gifArgs = ["-i", "input", "-vf", "scale=320:-1", "output.gif"];
      } else {
        alert("Unsupported file type");
        return;
      }
      await ffmpeg.exec(gifArgs);
      const data = await ffmpeg.readFile("output.gif");
      // ffmpeg.readFile returns Uint8Array; ensure we pass ArrayBuffer/Uint8Array to Blob
      const blobData =
        data instanceof Uint8Array ? data : new Uint8Array(data as any);
      const url = URL.createObjectURL(
        new Blob([blobData], { type: "image/gif" })
      );
      setGifUrl(url);
      if (onGifResult) onGifResult(url);
    } catch (err: unknown) {
      console.error("Convert to gif error", err);
      if (err instanceof Error) {
        setError(err?.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError(String(err));
      }
      // alert(
      //   "Error converting to GIF: " + (err instanceof Error ? err.message : err)
      // );
    } finally {
      setIsLoading(false);
      setGifLoading(false);
    }
  };

  const convertToMkv = async () => {
    console.log("convertToMkv called");
    if (!selectedFile) {
      alert("Please upload file first.");
      return;
    }
    setIsLoading(true);
    setMkvLoading(true);
    try {
      const ffmpeg = await loadFFmpeg();
      await ffmpeg.writeFile("input", await fetchFile(selectedFile));
      let mkvArgs: string[];
      if (selectedFile.type.startsWith("video")) {
        mkvArgs = ["-i", "input", "-c:v", "copy", "-c:a", "copy", "output.mkv"];
      } else if (selectedFile.type.startsWith("image")) {
        mkvArgs = ["-i", "input", "-c:v", "copy", "-c:a", "copy", "output.mkv"];
      } else {
        alert("Unsupported file type");
        return;
      }
      await ffmpeg.exec(mkvArgs);
      const data = await ffmpeg.readFile("output.mkv");
      const blobData =
        data instanceof Uint8Array ? data : new Uint8Array(data as any);
      // revoke previous mkv url if present to avoid leaks
      if (mkvUrl) URL.revokeObjectURL(mkvUrl);
      const url = URL.createObjectURL(
        new Blob([blobData], { type: "video/x-matroska" })
      );
      setMkvUrl(url);
      if (onMkvResult) onMkvResult(url);
    } catch (err: unknown) {
      console.error("Convert to Mkv error", err);
      if (err instanceof Error) {
        setError(err?.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError(String(err));
      } // alert(
      //   "Error converting to MKV: " + (err instanceof Error ? err.message : err)
      // );
    } finally {
      setIsLoading(false);
      setMkvLoading(false);
    }
  };

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
          {/* convert to GIF button to call the function*/}
          <button
            onClick={convertToGif}
            disabled={anyLoading || !selectedFile}
            className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gifLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Convert to GIF"
            )}
          </button>

          {/* convert to MKV */}
          <button
            onClick={convertToMkv}
            disabled={anyLoading || !selectedFile}
            className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mkvLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Convert to MKV"
            )}
          </button>
          {gifUrl && (
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-medium text-white">GIF Preview</h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-700">
                <img
                  src={gifUrl}
                  alt="GIF preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <a
                href={gifUrl}
                download="output.gif"
                className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Download GIF
              </a>
            </div>
          )}

          {mkvUrl && (
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-medium text-white">MKV Preview</h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-700">
                <video
                  src={mkvUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
              <a
                href={mkvUrl}
                download="output.mkv"
                className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Download MKV
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Test;
