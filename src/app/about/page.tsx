"use client";

import React from "react";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About vidd 🎬✨</h1>

        <p className="text-lg text-gray-300 mb-4">
          vidd was born out of a tiny, very real frustration: I wanted to watch
          a movie on my TV from a USB stick but guess what... right? Nope. The
          TV gave my MKV file the cold shoulder. It refused to play the bloody
          movie because it was an mkv file, so I had to re-download the movie as
          an MP4. Such a waste of time. 😩
        </p>

        <p className="text-lg text-gray-300 mb-4">
          I went looking for tools online and stumbled upon <code>ffmpeg</code>,
          the swiss-army knife of video. It could convert the file in the CLI,
          but honestly, the command line felt like decoding ancient hieroglyphs.
          Tools existed, but I wanted something that fit my workflow: a browser
          friendly, local (privacy-first) converter with a friendly UI. And so
          vidd was born.
        </p>

        <p className="text-lg text-gray-300 mb-4">
          This project was primarily a way for me to learn FFmpeg and solve the
          universal problem of unsupported file formats. The truth is i love
          building my own software and a big fan of open source, and with a
          pinch( actually a lot of pinch) of AI and a sprinkle of JavaScript,
          ideas come to life. 🚀
        </p>

        <p className="text-lg text-gray-300 mb-4">
          If you like tinkering, improving UX, or making conversion pipelines
          faster and friendlier, vidd is open source and welcomes contributions.
          Whether it's improving the UI, optimizing FFmpeg flags, or adding more
          formats, all help is appreciated. ❤️ here is my github Link:{" "}
          <a href="http://github.com/fats-cmd" className="text-blue-500">
            my github
          </a>
        </p>

        <div className="mt-8">
          <Link href="/" className="underline text-emerald-400">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
