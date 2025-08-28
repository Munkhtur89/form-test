"use client";
import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { PolicePhotoValidation, UploadedFile } from "@/types/police";
import FileUploadGrid from "../ui/FileUploadGrid";
import ActionButtons from "../ui/ActionButtons";
import { ShowAIToast } from "../vehicle-insurance/ShowAIToast";

interface ContractProps {
  onImageSelected?: (files: File[]) => void;
  onDataExtracted?: (data: PolicePhotoValidation["extractedData"]) => void;
  multiple?: boolean;
  uploadedFiles?: UploadedFile[];
  setUploadedFiles?: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export default function Court({
  onImageSelected,
  onDataExtracted,
  multiple = true,
  uploadedFiles: externalUploadedFiles = [],
  setUploadedFiles: externalSetUploadedFiles,
}: ContractProps) {
  // Хэрэв гаднаас uploadedFiles ирээгүй бол дотоод state ашиглана
  const [internalUploadedFiles, setInternalUploadedFiles] = useState<
    UploadedFile[]
  >([]);

  // Гаднаас ирсэн эсвэл дотоод state ашиглах
  const uploadedFiles =
    externalUploadedFiles.length > 0
      ? externalUploadedFiles
      : internalUploadedFiles;
  const setUploadedFiles = externalSetUploadedFiles || setInternalUploadedFiles;

  const [isProcessing, setIsProcessing] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);

  // Caching систем нэмэх
  const [processedFiles, setProcessedFiles] = useState<
    Map<string, PolicePhotoValidation>
  >(new Map());

  // Debouncing функц нэмэх
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

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
      // Debounce timer цэвэрлэх
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [uploadedFiles, debounceTimer]);

  // Зургийг resize хийх функц - хурдны сайжруулалт
  const resizeImage = (
    file: File,
    maxWidth: number = 256, // 512-оос 256 болгож бууруулсан
    maxHeight: number = 256, // 512-оос 256 болгож бууруулсан
    quality: number = 0.6 // 0.8-аас 0.6 болгож бууруулсан
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

        // Base64 болгон хөрвүүлэх - бага чанартай
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

  // Файлын hash үүсгэх
  const getFileHash = (file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  // Шүүхийн бичиг баримт AI-р таних функц - хурдны сайжруулалт
  const validateEmergencyDocument = async (
    file: File
  ): Promise<PolicePhotoValidation> => {
    try {
      // Cache шалгах
      const fileHash = getFileHash(file);
      if (processedFiles.has(fileHash)) {
        return processedFiles.get(fileHash)!;
      }

      // Зургийг resize хийж base64 болгон хөрвүүлэх
      const base64 = await resizeImage(file);
      const base64Url = `data:image/jpeg;base64,${base64}`;

      const apiRequestBody = {
        model: "gpt-4o-mini", // gpt-4o-оос gpt-4o-mini болгож хурдны сайжруулалт
        messages: [
          {
            role: "system",
            content: `Та бол Монгол улсын шүүхийн бичиг баримт, даатгалын нэхэмжлэл, замын ослын тайлан зэргийг таних, уншиж, дүгнэх чадвартай AI мэргэжилтэн юм.

Таны үндсэн зорилго:
1. Шүүхийн бичиг баримтыг уншиж, гол мэдээллийг гаргаж авах
2. Даатгалын нэхэмжлэлийн дэлгэрэнгүй мэдээллийг таних
3. Замын ослын тайлан, эрүүгийн хэргийн дүгнэлтийг шинжилж үзэх
4. Хэрэгтэй мэдээллийг JSON хэлбэрээр буцаах

Таны хариулт дараах JSON бүтэцтэй байх ёстой:
{
  "isValid": boolean,
  "photoType": "Шүүхийн шийтгэх тогтоолын бичиг баримт",
  "message": string,
}

Хэрэв бичиг баримт уншигдахгүй эсвэл тодорхойгүй бол "documentType": "Уншигдахгүй" гэж буцаана уу.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: ``,
              },
              { type: "image_url", image_url: { url: base64Url } },
            ],
          },
        ],
        max_tokens: 2000, // 7000-аас 2000 болгож бууруулсан
        temperature: 0.1,
        stream: false, // Streaming идэвхгүй болгох
      };

      // Timeout controller - хурдны сайжруулалт
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 30 секундаас 15 секунд болгож бууруулсан

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

            // Cache-д хадгалах
            setProcessedFiles((prev) =>
              new Map(prev).set(fileHash, parsedData)
            );

            return parsedData;
          } catch (error) {
            console.error("JSON parsing error:", error);
            const fallbackResponse: PolicePhotoValidation = {
              isValid: false,
              photoType: "Буруу зураг",
              message: "AI хариултыг уншихад алдаа гарлаа.",
            };

            // Cache-д хадгалах
            setProcessedFiles((prev) =>
              new Map(prev).set(fileHash, fallbackResponse)
            );

            return fallbackResponse;
          }
        } else {
          const errorResponse: PolicePhotoValidation = {
            isValid: false,
            photoType: "Буруу зураг",
            message: "AI хариулт ирсэнгүй.",
          };

          // Cache-д хадгалах
          setProcessedFiles((prev) =>
            new Map(prev).set(fileHash, errorResponse)
          );

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

          // Cache-д хадгалах
          setProcessedFiles((prev) =>
            new Map(prev).set(fileHash, timeoutResponse)
          );

          return timeoutResponse;
        }

        const errorResponse: PolicePhotoValidation = {
          isValid: false,
          photoType: "Буруу зураг",
          message: "AI боловсруулалтад алдаа гарлаа.",
        };

        // Cache-д хадгалах
        setProcessedFiles((prev) => new Map(prev).set(fileHash, errorResponse));

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

  // Debounced file processing
  const debouncedProcessFiles = (files: File[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      try {
        const results = await processEmergencyFilesInParallel(files);

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
      }
    }, 300); // 300ms debounce

    setDebounceTimer(timer);
  };

  // Parallel processing функц - хурдны сайжруулалт
  const processEmergencyFilesInParallel = async (files: File[]) => {
    // Batch processing - 3 файл хүртэл зэрэг боловсруулах
    const batchSize = 3;
    const results: { file: File; result: PolicePhotoValidation }[] = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map(async (file) => {
        const result = await validateEmergencyDocument(file);
        return { file, result };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // UI update хурдасгах
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
    }

    return results;
  };

  const handleEmergencyFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Хэрэв нэг зураг л оруулах бол эхний файлыг л авна
    const filesToProcess = multiple ? files : [files[0]];

    setIsProcessing(true);

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
      // Debounced processing ашиглах
      debouncedProcessFiles(filesToProcess);
    } catch (error) {
      console.error("Processing error:", error);
      setToast({
        message: "Файл боловсруулалтад алдаа гарлаа.",
        isSuccess: false,
      });
      setIsProcessing(false);
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
  };

  return (
    <div className="mt-6 border-gray-200 rounded-lg overflow-hidden">
      {/* Card Body */}
      <div className="bg-white p-6 space-y-6">
        {/* AI Document Recognition Area */}
        <div className="border-2 border-dashed border-blue-400 rounded-xl p-6 hover:border-blue-500 transition-colors">
          <label
            htmlFor="court-photo-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="bg-blue-100 rounded-full p-3">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <span className="text-blue-700 font-medium text-lg">
                {multiple
                  ? "Шүүхийн шийтгэх тогтоолын бичиг баримтууд AI-д таниулна уу"
                  : "Шүүхийн шийтгэх тогтоолын бичиг баримт AI-д таниулна уу"}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {multiple
                  ? "(JPG, PNG, HEIC... - олон файл)"
                  : "(JPG, PNG, HEIC...)"}
              </p>
            </div>

            <input
              id="court-photo-upload"
              type="file"
              accept="image/*"
              multiple={multiple}
              className="hidden"
              onChange={handleEmergencyFileChange}
              disabled={isProcessing}
            />
          </label>
        </div>

        <FileUploadGrid
          uploadedFiles={uploadedFiles}
          onRemoveFile={removeEmergencyFile}
        />

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
