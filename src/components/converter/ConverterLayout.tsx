"use client";

import React from "react";

const ConverterLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ConverterLayout;
