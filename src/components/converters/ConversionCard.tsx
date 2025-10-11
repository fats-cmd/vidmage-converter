"use client";

import React from "react";

type RunCb = (
  onProgress?: (p: number) => void
) => Promise<Blob | null | undefined>;

type Props = {
  label: string;
  run: RunCb;
  downloadName?: string;
  children?: (url: string | null) => React.ReactNode;
  onResult?: (url: string) => void;
};

export default function ConversionCard({
  label,
  run,
  downloadName = "output.bin",
  children,
  onResult,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [stageIndex, setStageIndex] = React.useState(0);

  // animated stage messages for when progress is indeterminate
  const stages = [
    "Fetching data",
    "Decoding",
    "Processing",
    "Encoding",
    "Finalizing",
  ];

  React.useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  async function handleClick() {
    setError(null);
    setLoading(true);
    setProgress(0);
    try {
      // if we never receive progress updates, rotate stage messages
      let stageTimer: number | undefined;
      if (stageTimer === undefined) {
        stageTimer = window.setInterval(() => {
          setStageIndex((s) => (s + 1) % stages.length);
        }, 900);
      }

      const blob = await run((p: number) => {
        // ensure incoming p is 0..1
        const clamped = Math.max(0, Math.min(1, Number(p) || 0));
        setProgress(clamped);
      });

      if (stageTimer !== undefined) {
        clearInterval(stageTimer);
        stageTimer = undefined;
      }
      if (blob) {
        if (url) URL.revokeObjectURL(url);
        const u = URL.createObjectURL(blob);
        setUrl(u);
        // notify parent if they want the generated URL
        onResult?.(u);
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <strong className="text-white">{label}</strong>
        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? (
            progress !== null ? (
              // shows percentage 1..100 (avoid 0% during active processing)
              `Processing ${Math.max(1, Math.round(progress * 100))}%`
            ) : (
              <span className="stage-animate">
                <span className="progress-spinner" aria-hidden />
                {stages[stageIndex]}...
              </span>
            )
          ) : (
            label
          )}
        </button>
      </div>
      {error && <div className="text-red-400 text-sm">Error: {error}</div>}
      {children ? children(url) : null}
      {url && (
        <a
          href={url}
          download={downloadName}
          className="block w-full text-center bg-green-600 text-white py-2 rounded"
        >
          Download {downloadName}
        </a>
      )}
    </div>
  );
}
