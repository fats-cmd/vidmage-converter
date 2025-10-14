"use client";

import { useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export function useFfmpeg() {
  const ffmpegRef = useRef<FFmpeg | null>(null);

  async function loadFFmpeg() {
    if (ffmpegRef.current) return ffmpegRef.current;
    const baseURL =
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
    const ffmpeg = new FFmpeg();
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
  }

  async function writeFile(name: string, file: File) {
    const ffmpeg = await loadFFmpeg();
    await ffmpeg.writeFile(name, await fetchFile(file));
    return ffmpeg;
  }

  async function readOutputAsBlob(name: string, mime?: string) {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) throw new Error("FFmpeg not loaded");
    const data = await ffmpeg.readFile(name);
    const arr = data instanceof Uint8Array ? data : new Uint8Array(data as any);
    return new Blob([arr], { type: mime ?? "application/octet-stream" });
  }

  function setProgress(cb?: (ratio: number) => void) {
    const ffmpeg = ffmpegRef.current as any;
    if (!ffmpeg) return;
    // Only call setProgress if it's available on the ffmpeg instance.
    // Some builds/versions may not expose setProgress on the runtime object.
    const sp = ffmpeg.setProgress;
    if (typeof sp === "function") {
      if (cb) {
        sp((progress: any) => {
          try {
            // normalize/ clamp to 0..1
            let ratio = Number(progress?.ratio ?? 0) || 0;
            if (!isFinite(ratio)) ratio = 0;
            if (ratio < 0) ratio = 0;
            if (ratio > 1) ratio = 1;
            cb(ratio);
          } catch (e) {
            // swallow
          }
        });
      } else {
        // clear progress handler
        sp(() => {});
      }
    }
  }

  async function convertToGif(
    file: File,
    duration = 5,
    onProgress?: (r: number) => void
  ) {
    const ffmpeg = await writeFile("input", file);
    let args: string[];
    if (file.type.startsWith("video")) {
      args = [
        "-i",
        "input",
        "-t",
        String(duration),
        "-vf",
        "scale=320:-1",
        "output.gif",
      ];
    } else if (file.type.startsWith("image")) {
      args = ["-i", "input", "-vf", "scale=320:-1", "output.gif"];
    } else {
      throw new Error("Unsupported file type for GIF");
    }
    try {
      // progress reporting removed — run the command without wiring progress
      await ffmpeg.exec(args);
      return await readOutputAsBlob("output.gif", "image/gif");
    } finally {
      // nothing to cleanup for progress
    }
  }

  async function convertToMkv(file: File, onProgress?: (r: number) => void) {
    const ffmpeg = await writeFile("input", file);
    let args: string[];
    if (file.type.startsWith("video")) {
      args = ["-i", "input", "-c:v", "copy", "-c:a", "copy", "output.mkv"];
    } else if (file.type.startsWith("image")) {
      args = [
        "-loop",
        "1",
        "-i",
        "input",
        "-t",
        "5",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-vf",
        "scale=trunc(iw/2)*2:trunc(ih/2)*2",
        "output.mkv",
      ];
    } else {
      throw new Error("Unsupported file type for MKV");
    }
    try {
      await ffmpeg.exec(args);
      return await readOutputAsBlob("output.mkv", "video/x-matroska");
    } finally {
      // nothing to cleanup for progress
    }
  }

  // example audio conversion: mp3 -> ac3
  async function convertAudioToAc3(
    file: File,
    onProgress?: (r: number) => void
  ) {
    const ffmpeg = await writeFile("input", file);
    const args = ["-i", "input", "-c:a", "ac3", "output.ac3"];
    try {
      await ffmpeg.exec(args);
      return await readOutputAsBlob("output.ac3", "audio/ac3");
    } finally {
      // nothing to cleanup for progress
    }
  }

  // container copy (no re-encode)
  async function containerCopy(file: File, outName = "output.mkv") {
    const ffmpeg = await writeFile("input", file);
    await ffmpeg.exec(["-i", "input", "-c", "copy", outName]);
    return readOutputAsBlob(outName);
  }

  async function convertToMp4(file: File, onProgress?: (r: number) => void) {
    const ffmpeg = await writeFile("input", file);
    let args: string[];
    if (file.type.startsWith("video")) {
      // transcode to H.264 + AAC for widest playback
      args = [
        "-i",
        "input",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-movflags",
        "+faststart",
        "-pix_fmt",
        "yuv420p",
        "output.mp4",
      ];
    } else if (file.type.startsWith("image")) {
      args = [
        "-loop",
        "1",
        "-i",
        "input",
        "-t",
        "5",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-vf",
        "scale=trunc(iw/2)*2:trunc(ih/2)*2",
        "output.mp4",
      ];
    } else {
      throw new Error("Unsupported file type for MP4");
    }
    try {
      await ffmpeg.exec(args);
      return await readOutputAsBlob("output.mp4", "video/mp4");
    } finally {
      // nothing to cleanup for progress
    }
  }

  return {
    loadFFmpeg,
    convertToGif,
    convertToMkv,
    convertToMp4,
    convertAudioToAc3,
    containerCopy,
  } as const;
}
