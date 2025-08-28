import React, { useState } from "react";
import FileIcon from "../../../public/folder.png";
import Upload from "../../../public/upload-file.png";
import Image from "next/image";
import imageCompression from "browser-image-compression";

interface FileUploadProps {
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "driver" | "accident" | "document"
  ) => void;
}

interface FileInfo {
  id: string;
  name: string;
  size: number;
  progress: number;
}

export default function AddFile({ handleFileUpload }: FileUploadProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      if (file.type.startsWith("image/")) {
        const compressedFile = await imageCompression(file, options);
        return new File([compressedFile], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        });
      }
      return file;
    } catch (error) {
      console.error("Зураг шаххад алдаа гарлаа:", error);
      return file;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const compressedFiles = await Promise.all(
        Array.from(selectedFiles).map(async (file) => {
          const compressedFile = await compressImage(file);
          return {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: compressedFile.size,
            progress: 0,
            file: compressedFile,
          };
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...compressedFiles]);

      // Жишээ upload progress (хиймэл)
      compressedFiles.forEach((file) => {
        const fakeUpload = setInterval(() => {
          setFiles((prevFiles) => {
            const updatedFiles = prevFiles.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    progress: f.progress >= 100 ? 100 : f.progress + 10,
                  }
                : f
            );

            const currentFile = updatedFiles.find((f) => f.id === file.id);
            if (currentFile?.progress === 100) {
              clearInterval(fakeUpload);
            }

            return updatedFiles;
          });
        }, 200);
      });

      // Шинийгэр compressed файлуудыг handleFileUpload руу дамжуулах
      const dataTransfer = new DataTransfer();
      compressedFiles.forEach((file) => {
        if (file.file) {
          dataTransfer.items.add(file.file);
        }
      });

      const newEvent = {
        ...e,
        target: {
          ...e.target,
          files: dataTransfer.files,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleFileUpload(newEvent, "document");
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  // MB-г тооцоолох функц
  const getMB = (size: number) => (size / (1024 * 1024)).toFixed(0);

  return (
    <div className="my-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Нэмэлт файлууд оруулах
      </label>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center py-8">
            <Image
              src={Upload.src}
              alt="Upload"
              width={80}
              height={80}
              className="w-20 h-20"
            />
            <p className="mb-1 text-sm text-gray-500 mt-2">
              Click to upload or drag and drop
            </p>
            <p className="mb-2 text-xs text-gray-400">
              Image must be 800 x 400px - Max 20Mb
            </p>
            <span className="font-semibold text-gray-700">Файлууд хуулах</span>
          </div>
          <input
            type="file"
            name="inspectionDocument"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
        </label>
      </div>
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex flex-col gap-2 bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={FileIcon.src}
                  alt="File"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700 font-medium">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {file.progress}% {getMB((file.size * file.progress) / 100)}/
                    {getMB(file.size)}MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteFile(file.id);
                  }}
                  className="ml-auto text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
