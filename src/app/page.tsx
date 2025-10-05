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
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Convert Videos and Images to GIF
              </span>
            </h1>

            <p className="text-gray-400 text-xl max-w-2xl">
              Transform your videos and images into high-quality GIFs instantly.
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
