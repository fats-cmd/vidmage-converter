"use client";

import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link                      
            href="/"
            className=" vidd-text text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"
          >
            Viid
          </Link>
          <div className="space-x-6">
            <Link
              href="/convert"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Convert
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>

            <Link
              href="https://github.com/fats-cmd/vidmage-converter"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Github 
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
