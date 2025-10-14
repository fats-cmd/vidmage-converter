"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/common/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center space-y-8 text-center pt-20">
            <h1 className="text-5xl md:text-6xl font-bold flex items-center justify-center gap-6">
              <span className="vidd-wrap" aria-hidden="false">
                {/* Inline SVG logo for vidd: a stylized play/film icon with gradient */}
                <svg
                  className="vidd-logo"
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="vidd logo"
                >
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="2"
                    y="2"
                    width="60"
                    height="60"
                    rx="12"
                    fill="url(#g1)"
                  />
                  <path
                    d="M24 20 L44 32 L24 44 V20 Z"
                    fill="white"
                    opacity="0.98"
                  />
                  {/* small film perforations */}
                  <rect
                    x="8"
                    y="12"
                    width="4"
                    height="4"
                    rx="1"
                    fill="rgba(255,255,255,0.12)"
                  />
                  <rect
                    x="8"
                    y="28"
                    width="4"
                    height="4"
                    rx="1"
                    fill="rgba(255,255,255,0.12)"
                  />
                  <rect
                    x="8"
                    y="44"
                    width="4"
                    height="4"
                    rx="1"
                    fill="rgba(255,255,255,0.12)"
                  />
                </svg>

                <span className="vidd-text">vidd</span>
              </span>

              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Convert Videos and Images to any format
              </span>
            </h1>

            <p className="text-gray-400 text-xl max-w-2xl">
              Transform your videos and images into any format instantly.
              No signup required, completely free.
            </p>

            <Link
              href="/convert"
              className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Converting
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="w-12 h-12 mb-4 mx-auto">
                  <Image src="/globe.svg" alt="Fast" width={48} height={48} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-400">
                  Convert your files in seconds with our optimized processing
                </p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="w-12 h-12 mb-4 mx-auto">
                  <Image
                    src="/window.svg"
                    alt="Browser"
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Browser-based
                </h3>
                <p className="text-gray-400">
                  No downloads needed. Convert directly in your browser
                </p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="w-12 h-12 mb-4 mx-auto">
                  <Image src="/file.svg" alt="Private" width={48} height={48} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  100% Private
                </h3>
                <p className="text-gray-400">
                  All processing happens locally. Your files never leave your
                  device
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
