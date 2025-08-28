"use client";
import React, { useState, useEffect } from "react";
import { Upload, Sparkles } from "lucide-react";
import { PolicePhotoValidation, UploadedFile } from "@/types/police";
import FileUploadGrid from "../ui/FileUploadGrid";
import ActionButtons from "../ui/ActionButtons";
import { extraPrompt } from "@/lib/ai";
import { ShowAIToast } from "../vehicle-insurance/ShowAIToast";

interface ContractProps {
  onImageSelected?: (files: File[]) => void;
  onDataExtracted?: (data: PolicePhotoValidation["extractedData"]) => void;
  multiple?: boolean;
}

export default function Others({
  onImageSelected,
  onDataExtracted,
  multiple = true,
}: ContractProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);

  // Toast автоматаар 3 секундийн дараа алга болгох
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((uploadedFile) => {
        URL.revokeObjectURL(uploadedFile.preview);
      });
    };
  }, [uploadedFiles]);

  // Зургийг resize хийх функц
  const resizeImage = (
    file: File,
    maxWidth: number = 1024,
    maxHeight: number = 1024,
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        let { width, height } = img;

        // Хэмжээг тохируулах
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Canvas хэмжээг тохируулах
        canvas.width = width;
        canvas.height = height;

        // Зургийг canvas дээр зурах
        ctx?.drawImage(img, 0, 0, width, height);

        // Base64 болгон хөрвүүлэх
        const resizedBase64 = canvas.toDataURL("image/jpeg", quality);
        const base64Data = resizedBase64.split(",")[1];
        resolve(base64Data);
      };

      img.onerror = () => {
        reject(new Error("Зураг уншихад алдаа гарлаа"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Цагдааны зураг AI-р таних функц
  const validateEmergencyDocument = async (
    file: File
  ): Promise<PolicePhotoValidation> => {
    try {
      // Зургийг resize хийж base64 болгон хөрвүүлэх
      const base64 = await resizeImage(file);
      const base64Url = `data:image/jpeg;base64,${base64}`;

      const apiRequestBody = {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: extraPrompt,
              },
              { type: "image_url", image_url: { url: base64Url } },
            ],
          },
        ],
        max_tokens: 7000,
        temperature: 0.1,
      };

      // Timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд timeout

      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiRequestBody),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.choices && data.choices[0]) {
          let content = data.choices[0].message.content.trim();

          // JSON parse
          if (content.startsWith("```json")) {
            content = content.replace("```json", "").replace("```", "").trim();
          } else if (content.startsWith("```")) {
            content = content.replace(/```/g, "").trim();
          }

          try {
            const parsedData = JSON.parse(content);
            return parsedData;
          } catch (error) {
            console.error("JSON parsing error:", error);
            const fallbackResponse: PolicePhotoValidation = {
              isValid: false,
              photoType: "Буруу зураг",
              message: "AI хариултыг уншихад алдаа гарлаа.",
            };
            return fallbackResponse;
          }
        } else {
          const errorResponse: PolicePhotoValidation = {
            isValid: false,
            photoType: "Буруу зураг",
            message: "AI хариулт ирсэнгүй.",
          };
          return errorResponse;
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error("API error:", error);

        // Timeout error handling
        if (error instanceof Error && error.name === "AbortError") {
          const timeoutResponse: PolicePhotoValidation = {
            isValid: false,
            photoType: "Буруу зураг",
            message: "AI хариулалт удаж байна. Дахин оролдоно уу.",
          };
          return timeoutResponse;
        }

        const errorResponse: PolicePhotoValidation = {
          isValid: false,
          photoType: "Буруу зураг",
          message: "AI боловсруулалтад алдаа гарлаа.",
        };
        return errorResponse;
      }
    } catch (error) {
      console.error("Resize error:", error);
      const errorResponse: PolicePhotoValidation = {
        isValid: false,
        photoType: "Буруу зураг",
        message: "Зураг resize хийхэд алдаа гарлаа.",
      };
      return errorResponse;
    }
  };

  // Parallel processing функц
  const processEmergencyFilesInParallel = async (files: File[]) => {
    const promises = files.map(async (file, index) => {
      const result = await validateEmergencyDocument(file);
      // Progress update
      setProcessingProgress(((index + 1) / files.length) * 100);
      return { file, result };
    });

    return Promise.all(promises);
  };

  const handleEmergencyFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Хэрэв нэг зураг л оруулах бол эхний файлыг л авна
    const filesToProcess = multiple ? files : [files[0]];

    setIsProcessing(true);
    setProcessingProgress(0);

    // Шинэ файлуудыг нэмэх
    const newUploadedFiles: UploadedFile[] = filesToProcess.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      validation: null,
      isProcessing: true,
    }));

    setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);

    // Form руу дамжуулах
    if (onImageSelected) {
      onImageSelected(filesToProcess);
    }

    try {
      // Parallel processing
      const results = await processEmergencyFilesInParallel(filesToProcess);

      // Үр дүнг state-д оруулах
      setUploadedFiles((prev) =>
        prev.map((uploadedFile) => {
          const result = results.find((r) => r.file === uploadedFile.file);
          if (result) {
            return {
              ...uploadedFile,
              validation: result.result,
              isProcessing: false,
            };
          }
          return uploadedFile;
        })
      );

      // Хэрэв мэдээлэл танигдсан бол form руу дамжуулна
      results.forEach(({ result }) => {
        if (result.isValid && result.extractedData && onDataExtracted) {
          onDataExtracted(result.extractedData);
        }
      });

      // Toast харуулах
      const validResults = results.filter((r) => r.result.isValid);
      const invalidResults = results.filter((r) => !r.result.isValid);

      if (validResults.length > 0) {
        setToast({
          message: `${validResults.length} файл амжилттай танигдлаа!`,
          isSuccess: true,
        });
      }

      if (invalidResults.length > 0) {
        setToast({
          message: `${invalidResults.length} файл танигдаагүй байна.`,
          isSuccess: false,
        });
      }
    } catch (error) {
      console.error("Processing error:", error);
      setToast({
        message: "Файл боловсруулалтад алдаа гарлаа.",
        isSuccess: false,
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const removeEmergencyFile = (index: number) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev[index];
      URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetEmergencyForm = () => {
    uploadedFiles.forEach((uploadedFile) => {
      URL.revokeObjectURL(uploadedFile.preview);
    });
    setUploadedFiles([]);
    setToast(null);
    setProcessingProgress(0);
  };

  return (
    <div className="mt-2 border-gray-200 rounded-lg overflow-hidden ">
      {/* Card Header */}

      {/* Card Body */}
      <div className="bg-white p-6 space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-blue-400 rounded-xl p-6 hover:border-blue-500 transition-colors">
          <label
            htmlFor="others-photo-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="bg-blue-100 rounded-full p-3">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <span className="text-blue-700 font-medium text-lg">
                {multiple
                  ? "Цагдааны ослын бичиг баримтууд оруулна уу"
                  : "Цагдааны ослын бичиг баримт оруулна уу"}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {multiple
                  ? "(JPG, PNG, HEIC... - олон файл)"
                  : "(JPG, PNG, HEIC...)"}
              </p>
            </div>

            <input
              id="others-photo-upload"
              type="file"
              accept="image/*"
              multiple={multiple}
              className="hidden"
              onChange={handleEmergencyFileChange}
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

              {/* Progress Bar */}
              <div className="w-64 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {Math.round(processingProgress)}% боловсруулсан
              </p>
            </div>
          </div>
        )}

        <FileUploadGrid
          uploadedFiles={uploadedFiles}
          onRemoveFile={removeEmergencyFile}
        />

        {/* Action Buttons */}
        {uploadedFiles.length > 0 && (
          <ActionButtons
            onReset={resetEmergencyForm}
            onSubmit={() => document.getElementById("")?.click()}
            submitText="Нэмэх"
            showSubmit={true}
            showPlusIcon={true}
          />
        )}

        {toast && (
          <ShowAIToast message={toast.message} isSuccess={toast.isSuccess} />
        )}
      </div>
    </div>
  );
}
