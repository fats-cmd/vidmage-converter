"use client";

import React,{useState} from "react";
// import Create from "./Create";
// import NoSSRWrapper from "./NoSSRWrapper";
import Uploader from "@/components/Uploader";

const page = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setVideoUrl(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {/* <NoSSRWrapper> */}
      <Uploader onFileSelect={(file: File) => console.log(file)} />
        {videoUrl && (
          <video
            src={videoUrl as string }
            controls
            width={500}
            height={300}
          />
        )}
      {/* </NoSSRWrapper> */}
    </div>
  );
};

export default page;
