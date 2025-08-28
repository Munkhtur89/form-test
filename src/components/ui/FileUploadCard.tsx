import React from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { UploadedFile } from "@/types/police";
import Image from "next/image";

interface FileUploadCardProps {
  uploadedFile: UploadedFile & { aiRecognized?: boolean };
  index: number;
  onRemove: (index: number) => void;
  className?: string;
}

export default function FileUploadCard({
  uploadedFile,
  index,
  onRemove,
  className = "",
}: FileUploadCardProps) {
  return (
    <div
      className={`relative border border-gray-200  w-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Image Preview */}
      <div className="relative">
        <Image
          src={uploadedFile.preview}
          alt={`Uploaded document ${index + 1}`}
          className="w-full h-28 object-cover"
          width={100}
          height={100}
        />

        {/* Remove Button */}
        <button
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          {uploadedFile.isProcessing ? (
            <div className="bg-yellow-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <svg
                className="animate-spin h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Боловсруулж байна
            </div>
          ) : uploadedFile.validation ? (
            uploadedFile.validation.isValid ? (
              <div className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {"Амжилттай"}
              </div>
            ) : (
              <div className="bg-red-500 text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {"Амжилтгүй"}
              </div>
            )
          ) : (
            <div className="bg-gray-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              Хүлээгдэж байна
            </div>
          )}
        </div>
      </div>

      {/* File Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">
          {uploadedFile.file.name}
        </p>
        <p className="text-xs text-gray-500">
          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>

      {/* Validation Result */}
      {uploadedFile.validation && !uploadedFile.isProcessing && (
        <div className="p-3 border-t border-gray-100">
          {uploadedFile.validation.isValid ? (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-green-800 text-xs font-medium">
                {uploadedFile.validation.message.split(".")[0] || "Амжилттай"}
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-800 text-xs font-medium">
                {uploadedFile.validation.message.split(".")[0] || "Амжилтгүй"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
