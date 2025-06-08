import { type OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@uploadthing/react";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}
import { useState } from "react";

function FileUpload({ onChange, value, endpoint }: FileUploadProps) {
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);

  const deleteFile = async () => {
    console.log("[CLIENT] Attempting to delete", uploadedFileKey);

    if (!uploadedFileKey) {
      console.log("[CLIENT] No uploadedFileKey found");
      return;
    }

    try {
      const res = await fetch("/api/uploadthing/delete", {
        method: "DELETE",
        body: JSON.stringify({ fileKey: uploadedFileKey }),
      });

      const data = await res.text();
      console.log("[CLIENT] Server response:", data);
    } catch (error) {
      console.error("[CLIENT] Failed to delete file:", error);
    }

    setUploadedFileKey(null);
  };

  const handleRemove = async () => {
    console.log("inside handleRemove");
    await deleteFile(); // Delete from UploadThing server
    onChange(""); // Clear preview
    console.log("cleared");
  };

  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="h-20 w-20 relative">
        <Image fill className="rounded-full" src={value} alt="server Image" />
        <button
          className="absolute right-0 top-0 p-1 rounded-full shadow-sm bg-rose-500"
          type="button"
          onClick={handleRemove}
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone<OurFileRouter, typeof endpoint>
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res && res[0]) {
          setUploadedFileKey(res[0].key); // 🔑 Store file key
          onChange(res[0].url); // Or res[0].ufsUrl
        }
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
}

export default FileUpload;
