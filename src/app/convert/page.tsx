"use client";

import React from "react";
import Header from "@/components/common/Header";
import Test from "@/components/test";
import { FfmpegProvider } from "@/hooks/FfmpegProvider";

export default function ConvertPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Convert your file.
            </h1>
            <p className="text-gray-400">
              Upload your video or image file to get started
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FfmpegProvider>
              <Test onFileSelect={() => {}} />
            </FfmpegProvider>
          </div>
        </div>
      </main>
    </>
  );
}
