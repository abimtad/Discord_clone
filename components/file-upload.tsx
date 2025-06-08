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
function FileUpload({ onChange, value, endpoint }: FileUploadProps) {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="h-20 w-20 relative">
        <Image fill className="rounded-full" src={value} alt="server Image" />
        <button
          className="absolute right-0 top-0 p-1  rounded-full shadow-sm bg-rose-500"
          type="button"
          onClick={() => onChange("")}
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
        onChange(res?.[0].ufsUrl);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
}

export default FileUpload;
