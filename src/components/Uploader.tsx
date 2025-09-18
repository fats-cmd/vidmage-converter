"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

type UploaderProps = {
  onFileSelect: (file: File) => void;
  onGifResult?: (gifUrl: string) => void;
};

const Uploader: React.FC<UploaderProps> = ({ onFileSelect, onGifResult }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  // Load ffmpeg if not loaded
  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileSelect && onFileSelect(file);
      setFileUrl(URL.createObjectURL(file));
      setFileType(file.type);
      setGifUrl(null);
      setIsLoading(true);
      try {
        const ffmpeg = await loadFFmpeg();
        await ffmpeg.writeFile("input", await fetchFile(file));
        let gifArgs;
        if (file.type.startsWith("video")) {
          gifArgs = [
            "-i", "input",
            "-t", "5",
            "-vf", "scale=320:-1",
            "output.gif"
          ];
        } else if (file.type.startsWith("image")) {
          gifArgs = [
            "-i", "input",
            "-vf", "scale=320:-1",
            "output.gif"
          ];
        } else {
          setIsLoading(false);
          return;
        }
        await ffmpeg.exec(gifArgs);
        const data = await ffmpeg.readFile("output.gif");
        // ffmpeg.readFile returns Uint8Array, so use it directly
  // Convert Uint8Array to a regular ArrayBuffer for Blob
  const arrayBuffer = data instanceof Uint8Array ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : data;
  const url = URL.createObjectURL(new Blob([arrayBuffer], { type: "image/gif" }));
        setGifUrl(url);
        if (onGifResult) onGifResult(url);
      } catch (err) {
        // handle error
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-amber-600 p-4 rounded flex flex-col items-center">
      <input
        type="file"
        accept="video/*,image/*"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Select a file"}
      </button>
      {fileUrl && fileType && (
        <div style={{ marginTop: 20 }}>
          {fileType.startsWith("video") ? (
            <video src={fileUrl} controls style={{ maxWidth: 400 }} />
          ) : fileType.startsWith("image") ? (
            <Image
              src={fileUrl}
              alt="Uploaded file preview"
              width={400}
              height={300}
              style={{ maxWidth: 400, height: "auto" }}
            />
          ) : null}
        </div>
      )}
      {gifUrl && (
        <div style={{ marginTop: 20 }}>
          <p>GIF Preview:</p>
          <Image src={gifUrl} alt="GIF preview" width={320} height={240} style={{ maxWidth: 320, height: "auto" }} />
          <a href={gifUrl} download="output.gif" className="block mt-2 text-blue-700 underline">Download GIF</a>
        </div>
      )}
    </div>
  );
};

export default Uploader;
