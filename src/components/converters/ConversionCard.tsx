"use client";

import React, { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      // Call run without progress handling — the conversion runs and returns a Blob.
      const blob = await run();

      if (blob) {
        if (url) URL.revokeObjectURL(url);
        const u = URL.createObjectURL(blob);
        setUrl(u);
        onResult?.(u);
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
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
            <span className="inline-flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Processing...
            </span>
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
