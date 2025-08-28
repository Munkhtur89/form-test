import React, { useState, useEffect, useRef } from "react";
import { ShowAIToast } from "./ShowAIToast";
import { Sparkles, FileText } from "lucide-react";
import { resizeImage } from "@/lib/imageUtils";
import { FileUploadGrid } from "@/components/ui";
import { AI_PROMPT_VEHICLE_REGISTRATION } from "@/lib/ai";
import Image from "next/image";
import Tsagdaa from "@/../public/logo/soyombo.png";

interface DocumentValidation {
  isValid: boolean;
  photoType: string; // PolicePhotoValidation-тай нийцүүлэх
  documentType: string;
  quality?: "good" | "poor";
  issues?: string[];

  message: string;
  extractedData?: {
    [key: string]: string | number | boolean | object;
  };
}

interface UploadedFile {
  file: File;
  preview: string;
  validation: DocumentValidation | null;
  isProcessing: boolean;
}

interface FileUploadProps {
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "driver" | "accident" | "document"
  ) => void;
}

export default function FileUpload({ handleFileUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);

  // Toast автоматаар 3 секундийн дараа алга болгох
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((uploadedFile) =>
        URL.revokeObjectURL(uploadedFile.preview)
      );
    };
  }, [uploadedFiles]);

  // Албан тоот/Зээлийн гэрээ AI-р таних функц
  const validateDocument = async (file: File): Promise<DocumentValidation> => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        const apiRequestBody = {
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: AI_PROMPT_VEHICLE_REGISTRATION,
                },
                { type: "image_url", image_url: { url: base64 } },
              ],
            },
          ],
          max_tokens: 2000,
          temperature: 0.1,
          stream: false,
        };
        try {
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization:
                  "Bearer " + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(apiRequestBody),
            }
          );
          const data = await response.json();
          if (data.choices && data.choices[0]) {
            let content = data.choices[0].message.content.trim();
            if (content.startsWith("```json")) {
              content = content
                .replace("```json", "")
                .replace("```", "")
                .trim();
            } else if (content.startsWith("```")) {
              content = content.replace(/```/g, "").trim();
            }
            try {
              const parsedData = JSON.parse(content);
              resolve(parsedData);
            } catch {
              resolve({
                isValid: false,
                photoType: "Буруу бичиг баримт",
                documentType: "Буруу бичиг баримт",
                message: "AI хариултыг уншихад алдаа гарлаа.",
              });
            }
          } else {
            resolve({
              isValid: false,
              photoType: "Буруу бичиг баримт",
              documentType: "Буруу бичиг баримт",
              message: "AI хариулт ирсэнгүй.",
            });
          }
        } catch {
          resolve({
            isValid: false,
            photoType: "Буруу бичиг баримт",
            documentType: "Буруу бичиг баримт",
            message: "AI боловсруулалтад алдаа гарлаа.",
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);

    // Form руу дамжуулах
    handleFileUpload(e, "document");

    try {
      const newUploadedFiles: UploadedFile[] = [];

      // Хүсэлт бүрийг AI-р таних
      for (const file of files) {
        try {
          // Preview URL үүсгэх
          const preview = URL.createObjectURL(file);

          // Зураг resize хийх
          const resizedFile = await resizeImage(file, 1024, 1024, 0.8);

          const result = await validateDocument(resizedFile);

          // UploadedFile объект үүсгэх
          const uploadedFile: UploadedFile = {
            file,
            preview,
            validation: result,
            isProcessing: false,
          };

          newUploadedFiles.push(uploadedFile);

          // Toast message харуулах
          if (result.isValid) {
            setToast({
              message: `${result.documentType} амжилттай танигдлаа!`,
              isSuccess: true,
            });
          } else {
            setToast({
              message:
                result.message ||
                "Зөвхөн даатгалын нөхөн төлбөрийн хүсэлт, албан тоот эсвэл зээлийн гэрээний зураг оруулна уу!",
              isSuccess: false,
            });
          }
        } catch (error) {
          console.error(`Error processing image ${file.name}:`, error);

          const preview = URL.createObjectURL(file);
          const uploadedFile: UploadedFile = {
            file,
            preview,
            validation: {
              isValid: false,
              photoType: "Буруу бичиг баримт",
              documentType: "Буруу бичиг баримт",
              message: `${file.name} файлыг боловсруулахад алдаа гарлаа.`,
            },
            isProcessing: false,
          };

          newUploadedFiles.push(uploadedFile);
        }
      }

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
    } catch (error) {
      console.error("Error processing images:", error);
      setToast({
        message: "Зураг боловсруулалтад алдаа гарлаа.",
        isSuccess: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    uploadedFiles.forEach((uploadedFile) =>
      URL.revokeObjectURL(uploadedFile.preview)
    );
    setUploadedFiles([]);
    setToast(null);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      return newFiles.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden ">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold">
              <Image
                src={Tsagdaa.src}
                alt="Тээврийн хэрэгслийн гэрчилгээ"
                className="w-full h-full object-contain"
                width={32}
                height={32}
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Албан тоот/Зээлийн гэрээ
              </h4>
              <p className="text-sm text-gray-600">
                Олон файл оруулах боломжтой
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Card Body */}
      <div className="bg-white p-6 space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="bg-blue-100 rounded-full p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <span className="text-blue-700 font-medium text-[16px]">
                Албан тоот / Зээлийн гэрээ оруулна уу
              </span>
            </div>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </label>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <svg
                className="animate-spin h-16 w-16 text-blue-600"
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
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-blue-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <p className="text-xl font-semibold text-gray-800">
                AI боловсруулж байна...
              </p>
              <p className="text-sm text-gray-600">
                Энэ нь 10-30 секунд шаардана
              </p>
            </div>
          </div>
        )}

        <FileUploadGrid
          uploadedFiles={uploadedFiles}
          onRemoveFile={removeFile}
        />

        {/* Action Buttons */}
        {uploadedFiles.length > 0 && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200 transform hover:scale-105"
            >
              + Нэмж оруулах
            </button>

            <button
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200 transform hover:scale-105"
            >
              Бүгдийг цэвэрлэх
            </button>
          </div>
        )}

        {toast && (
          <ShowAIToast message={toast.message} isSuccess={toast.isSuccess} />
        )}
      </div>
    </div>
  );
}
