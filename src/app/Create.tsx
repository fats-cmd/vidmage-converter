"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useRef, useState } from "react";

export default function Create() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  //function to load ffmpeg
  const load = async () => {
    setIsLoading(true);
    const baseURL =
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    setLoaded(true);
    setIsLoading(false);
  };

  // function to convert uploaded video to GIF
  const transcodeToGif = async () => {
    if (!videoFile) {
      alert("Please upload a video file first.");
      return;
    }
    setIsLoading(true);
    setGifUrl(null);
    const ffmpeg = ffmpegRef.current;
    // Write the uploaded file to ffmpeg FS
    await ffmpeg.writeFile("input", await fetchFile(videoFile));
    // Convert to GIF (first 5 seconds, scale to 320px width for demo)
    await ffmpeg.exec([
      "-i",
      "input",
      "-t",
      "5",
      "-vf",
      "scale=320:-1",
      "output.gif",
    ]);
    const data = (await ffmpeg.readFile("output.gif")) as any;
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGifUrl(url);
    setIsLoading(false);
  };


}
