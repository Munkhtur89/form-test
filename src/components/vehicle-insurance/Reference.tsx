import React, { useState, useEffect } from "react";
import { ShowAIToast } from "./ShowAIToast";
import {
  CheckCircle,
  AlertCircle,
  Upload,
  Sparkles,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { resizeImage } from "@/lib/imageUtils";
import { ScannerEffect } from "@/components/ui";

interface DocumentValidation {
  isValid: boolean;
  documentType: string;
  side?: "front" | "back" | "lavlagaa";
  quality?: "good" | "poor";
  issues?: string[];
  extractedData?: {
    lastName?: string;
    firstName?: string;
    regNumber?: string;
    birthDate?: string;
    gender?: string;
    address?: string;
    lavlagaaNumber?: string;
    issuedDate?: string;
    validUntil?: string;
    hasQRCode?: boolean;
  };
  message: string;
}

interface ReferenceProps {
  onImageSelected?: (file: File) => void;
}

export default function Reference({ onImageSelected }: ReferenceProps) {
  const [validation, setValidation] = useState<DocumentValidation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Toast автоматаар 3 секундийн дараа алга болгох
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Иргэний үнэмлэх болон лавлагаа AI-р таних функц
  const validateDocument = async (file: File): Promise<DocumentValidation> => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const extraPrompt = `
Энэ зураг Монгол улсын иргэний үнэмлэх эсвэл иргэний үнэмлэхний ЛАВЛАГАА баримтын зураг мөн үү?
- Хэрвээ иргэний үнэмлэх бол documentType-д "Иргэний үнэмлэх", side-д 'front' эсвэл 'back' гэж оноо. Овог, нэр, регистрийн дугаар, төрсөн огноо, хүйс, зураг дээрх мэдээллийг JSON-д гаргаж өг.
- Хэрвээ иргэний үнэмлэхний лавлагаа бол documentType-д "Иргэний үнэмлэхний лавлагаа", side-д 'lavlagaa' гэж оноо. Овог, нэр, регистрийн дугаар, төрсөн огноо, хүйс, хаяг, лавлагааны дугаар, олгосон огноо, хүчинтэй хугацаа, зураг дээрх QR код байгаа эсэхийг JSON-д гаргаж өг.
- Хэрвээ өөр төрлийн бичиг баримт бол documentType-д "Буруу бичиг баримт" гэж бичиж, isValid: false гэж өг.
- Message талбарт хэрэглэгчид ойлгомжтой, эелдэг тайлбар бич.

JSON форматтай хариулт өг:
{
  "isValid": true/false,
  "documentType": "Иргэний үнэмлэх/Иргэний үнэмлэхний лавлагаа/Буруу бичиг баримт",
  "side": "front/back/lavlagaa",
  "quality": "good/poor",
  "issues": ["алдааны жагсаалт"],
  "extractedData": {
    "lastName": "овог",
    "firstName": "нэр",
    "regNumber": "регистрийн дугаар",
    "birthDate": "төрсөн огноо",
    "gender": "хүйс",
    "address": "хаяг",
    "lavlagaaNumber": "лавлагааны дугаар",
    "issuedDate": "олгосон огноо",
    "validUntil": "хүчинтэй хугацаа",
    "hasQRCode": true/false
  },
  "message": "Тайлбар"
}
`;
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
                { type: "image_url", image_url: { url: base64 } },
              ],
            },
          ],
          max_tokens: 900,
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
                documentType: "Буруу бичиг баримт",
                message: "AI хариултыг уншихад алдаа гарлаа.",
              });
            }
          } else {
            resolve({
              isValid: false,
              documentType: "Буруу бичиг баримт",
              message: "AI хариулт ирсэнгүй.",
            });
          }
        } catch {
          resolve({
            isValid: false,
            documentType: "Буруу бичиг баримт",
            message: "AI боловсруулалтад алдаа гарлаа.",
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setIsProcessing(true);
    if (onImageSelected) onImageSelected(file); // form руу дамжуулна

    try {
      // Зураг resize хийх
      const resizedFile = await resizeImage(file, 1024, 1024, 0.8);
      console.log(
        `Зураг resize хийгдлээ: ${file.size} -> ${resizedFile.size} bytes`
      );

      const result = await validateDocument(resizedFile);
      setValidation(result);

      if (
        result.isValid &&
        (result.documentType === "Иргэний үнэмлэх" ||
          result.documentType === "Иргэний үнэмлэхний лавлагаа")
      ) {
        setToast({
          message: `${result.documentType} амжилттай танигдлаа!`,
          isSuccess: true,
        });
      } else {
        setToast({
          message:
            result.message ||
            "Зөвхөн иргэний үнэмлэх эсвэл лавлагааны зураг оруулна уу!",
          isSuccess: false,
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setToast({
        message: "Зураг боловсруулалтад алдаа гарлаа.",
        isSuccess: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setValidation(null);
    setPreviewUrl(null);
    setToast(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm  ">
      {/* Card Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                Иргэний үнэмлэхний лавлагаа
              </h4>
              <p className="text-sm text-gray-600">
                Албан бичгийн лавлагааны зургаа оруулна уу
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">
              AI дэмжлэгтэй
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {!validation && !isProcessing && (
          <div className="w-full border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-100">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Иргэний үнэмлэхний лавлагаа
                </h3>
                <p className="text-sm text-gray-600">
                  Зөвхөн нэг зураг шаардлагатай
                </p>
              </div>
            </div>

            <span className="mt-2 text-base text-blue-700 font-medium text-center">
              Лавлагааны зургаа чирж оруулах эсвэл{" "}
              <label
                htmlFor="file-upload"
                className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors"
              >
                browse files
              </label>
            </span>
            <p className="text-sm text-gray-600 mt-2 text-center">
              AI автоматаар зурган дээрх мэдээллийг уншиж бөглөх болно
            </p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </div>
        )}

        {isProcessing && (
          <div className="w-full h-64 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl relative">
            <ScannerEffect
              isProcessing={true}
              text="AI лавлагаа сканнердаж байна"
            />
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-blue-400 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-500 mb-2">
                AI боловсруулж байна
              </div>
              <div className="text-sm text-gray-400">
                Хэдэн секундын дараа үр дүн гарах болно
              </div>
            </div>
          </div>
        )}

        {validation && validation.isValid && !isProcessing && (
          <div className="space-y-6">
            {previewUrl && (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <Image
                    src={previewUrl}
                    width={400}
                    height={300}
                    alt="Uploaded document"
                    className="w-full h-auto max-h-[300px] object-contain bg-gray-50"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {validation.documentType}
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors duration-200 transform hover:scale-110"
                    onClick={resetForm}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">
                {validation.message || "Баримт бичиг амжилттай танигдлаа!"}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200 transform hover:scale-105"
              >
                Шинээр оруулах
              </button>
            </div>
          </div>
        )}

        {validation && !validation.isValid && !isProcessing && (
          <div className="space-y-6">
            {previewUrl && (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <Image
                    src={previewUrl}
                    width={400}
                    height={300}
                    alt="Uploaded document"
                    className="w-full h-auto max-h-[300px] object-contain bg-gray-50"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Алдаатай
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors duration-200 transform hover:scale-110"
                    onClick={resetForm}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">
                {validation.message ||
                  "Зөвхөн иргэний үнэмлэх эсвэл лавлагааны зураг оруулна уу!"}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200 transform hover:scale-105"
              >
                Дахин оролдох
              </button>
            </div>
          </div>
        )}

        {toast && (
          <ShowAIToast message={toast.message} isSuccess={toast.isSuccess} />
        )}
      </div>
    </div>
  );
}
