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

export default function Weather({
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
    maxWidth: number = 256,
    maxHeight: number = 256,
    quality: number = 0.6
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
            role: "system",
            content: `Та бол Монгол улсын цаг уурын болон онцгой байдлын бичиг баримтыг таних мэргэшсэн AI систем юм. Таны үндсэн зорилго нь:

1. **Хурдан таних**: Зургийг хармагцаа 2-3 секундын дотор таних
2. **Нарийвчлалтай таних**: 95%+ нарийвчлалтай таних
3. **Бүрэн мэдээлэл**: Бүх чухал мэдээллийг гаргах

**Таних ёстой бичиг баримтын төрлүүд:**
- Цаг уурын мэдээ (NAMEM-ийн бичиг баримт)
- Онцгой байдлын мэдээ
- Усны аюулын мэдээ
- Салхи, борооны мэдээ
- Бусад байгаль орчны мэдээ

**Гаргах ёстой мэдээлэл:**
- Бичиг баримтын төрөл
- Гарсан огноо
- Хэрэглэгчийн нэр
- Байршил (аймаг, хот)
- Цаг уурын нөхцөл байдал
- Хэмжээ (мм, м/с, градус)
- Хугацаа
- Албан ёсны дугаар
- Гарын үсэг, тамга

**Хариултын формат:**
{
  "isValid": boolean,
  "photoType": "Бичиг баримтын төрөл",
  "message": "Танихын үр дүн",

}

**Чухал заавар:**
- Зургийг хармагцаа шууд таниж эхлэх
- Монгол хэл дээрх текстүүдийг зөв унших
- Тоон утгуудыг нарийвчлалтай гаргах
- Хэрэв текст тодорхойгүй бол "тодорхойгүй" гэж бичих
- 30 секундын дотор хариулт өгөх`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Энэ зургийг харж, цаг уурын болон онцгой байдлын бичиг баримтын төрлийг тодорхойлж, бүх чухал мэдээллийг нарийвчлалтай гаргана уу. Зургийг хармагцаа шууд таниж эхлээрэй.`,
              },
              { type: "image_url", image_url: { url: base64Url } },
            ],
          },
        ],
        max_tokens: 2000, // Хурдны сайжруулал-
        temperature: 0.05, // Илүү нарийвчлалтай хариулт
      };

      // Timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 25 секунд timeout - хурдны сайжруулалт

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
    const promises = files.map(async (file) => {
      const result = await validateEmergencyDocument(file);
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
            htmlFor="emergency-photo-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div className="bg-blue-100 rounded-full p-3">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <span className="text-blue-700 font-medium text-lg">
                {multiple
                  ? "Цаг уурын  бичиг баримтууд AI-д таниулна уу"
                  : "Цаг уурын  бичиг баримт AI-д таниулна уу"}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {multiple
                  ? "(JPG, PNG, HEIC... - олон файл)"
                  : "(JPG, PNG, HEIC...)"}
              </p>
            </div>

            <input
              id="emergency-photo-upload"
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
