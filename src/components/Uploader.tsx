"use client";

import React, { useRef, useState } from "react";

import Image from "next/image";

type UploaderProps = {
  onFileSelect: (file: File) => void;
};

const Uploader: React.FC<UploaderProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileSelect(file);
      setFileUrl(URL.createObjectURL(file));
      setFileType(file.type);
    }
  };

  return (
    <div className=" bg-amber-600 p-4 rounded flex flex-col items-center">
      <input
        type="file"
        accept="video/*,image/*"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        select a file
      </button>
      {fileUrl && fileType && (
        <div style={{ marginTop: 20 }}>
          {fileType.startsWith("video") ? (
            <video src={fileUrl} controls style={{ maxWidth: 400 }} />
          ) : fileType.startsWith("image") ? (
            <Image
              src={fileUrl}
              alt="Uploaded file preview"
              width={400}
              height={300}
              style={{ maxWidth: 400, height: "auto" }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Uploader;
