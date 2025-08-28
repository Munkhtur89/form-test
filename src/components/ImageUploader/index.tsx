// components/ImageUploader.tsx
import React, { useRef, useState } from "react";
import Image from "next/image";
import upload from "../../../public/upload.png";
import imageCompression from "browser-image-compression";
import { MdDelete } from "react-icons/md";

export default function ImageUploader({
  label,
  onFileChange,
}: {
  label: string;
  onFileChange: (files: File[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
    } catch (error) {
      console.error("Зураг хэмжээг багасгахад алдаа гарлаа:", error);
      return file;
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    simulateUpload(async () => {
      const compressedFiles = await Promise.all(
        droppedFiles.map((file) => compressImage(file))
      );
      const newFiles = [...files, ...compressedFiles];
      setFiles(newFiles);
      onFileChange(newFiles);
    });
  };

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      simulateUpload(async () => {
        const compressedFiles = await Promise.all(
          selectedFiles.map((file) => compressImage(file))
        );
        const newFiles = [...files, ...compressedFiles];
        setFiles(newFiles);
        onFileChange(newFiles);
      });
    }
  };

  const simulateUpload = (onComplete: () => void) => {
    setProgress(0);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        onComplete();
        setTimeout(() => setProgress(0), 500);
      }
    }, 100);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(newFiles);
    onFileChange(newFiles);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-[#142a68] mb-2">
        {label}
      </label>
      <div
        className="border-2 border-dashed border-blue-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer mb-2"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleBrowse}
      >
        <Image
          src={upload.src}
          alt="icon"
          className="w-12 h-12 mb-2"
          width={48}
          height={48}
        />

        <p className="text-sm text-gray-500">
          Зураг чирж оруулах эсвэл{" "}
          <span className="text-blue-600 underline">browse</span>
        </p>
        <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP</p>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
      </div>

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
          <div className="text-xs text-gray-500 text-right mt-1">
            {progress}%
          </div>
        </div>
      )}

      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-2 flex items-center gap-2"
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-8 h-8 rounded object-cover"
              width={32}
              height={32}
            />
            <div className="flex-1">
              <div className="font-semibold text-xs text-gray-500">
                {file.name}
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button
              className="text-red-500 font-bold text-lg cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile(index);
              }}
            >
              <MdDelete />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
