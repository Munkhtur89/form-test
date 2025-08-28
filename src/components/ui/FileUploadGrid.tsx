import React from "react";
import { ImageIcon } from "lucide-react";
import { UploadedFile } from "@/types/police";
import FileUploadCard from "./FileUploadCard";

interface FileUploadGridProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (index: number) => void;
  title?: string;
  className?: string;
}

export default function FileUploadGrid({
  uploadedFiles,
  onRemoveFile,
  title = "Оруулсан файлууд",
  className = "",
}: FileUploadGridProps) {
  if (uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
        <ImageIcon className="h-4 w-4" />
        {title} ({uploadedFiles.length})
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {uploadedFiles.map((uploadedFile, index) => (
          <FileUploadCard
            key={index}
            uploadedFile={uploadedFile}
            index={index}
            onRemove={onRemoveFile}
          />
        ))}
      </div>
    </div>
  );
}
