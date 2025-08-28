"use client";

import React, { useState } from "react";
import { FormValues } from "@/types/form";
import Image from "next/image";
import toast from "react-hot-toast";
import { ShowAIToast } from "./ShowAIToast";
import { DocumentValidation } from "./types";
import { resizeImage } from "@/lib/imageUtils";

import FileUploadGrid from "@/components/ui/FileUploadGrid";
import { UploadedFile } from "@/types/police";
import Tsagdaa from "@/../public/logo/star-.png";

// AI хариултыг харуулах тусгай toast функц
function showAIToast(message: string, isSuccess: boolean = true) {
  toast.custom(<ShowAIToast message={message} isSuccess={isSuccess} />, {
    duration: 6000,
  });
}

// Файлыг base64 болгох функц
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

interface VehicleCertificateProps {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
  validationResults: {
    [key: number]: DocumentValidation;
  };
  setValidationResults: React.Dispatch<
    React.SetStateAction<{
      [key: number]: DocumentValidation;
    }>
  >;
}

export default function Assessment({
  setFormValues,
  setValidationResults,
}: VehicleCertificateProps) {
  // Removed unused isProcessingImage state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Бичиг баримт таних функц
  const validateDocument = async (file: File): Promise<DocumentValidation> => {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        const extraPrompt = `
Та Монгол хэл дээрх авто машины эвдрэл, хохирлын "Үнэлгээний тайлан" баримтыг зурагнаас танина. Доорх шинж тэмдгүүд ихэвчлэн харагдана:

**Ерөнхий шинж тэмдгүүд:**
- Гарчигт: "АШИД БИЛГҮҮН ХХК", "АРВИЖИХ ЭСТИМЕЙТ ҮНЭЛГЭЭ ХХК" эсвэл ижил төрлийн үнэлгээний байгууллагын нэр
- "ДААТГАЛЫН ХОХИРЛЫН ҮНЭЛГЭЭ", "АВТО МАШИН ТЕХНИКИЙН ҮНЭЛГЭЭНИЙ ТАЙЛАН" эсвэл "эвдрэл, хохирлын үнэлгээний тайлан"
- Огноо, тайлангийн дугаар (№), газар зэрэг мэдээлэл

**Машины мэдээлэл:**
- Марк, загвар (жишээ: Toyota Land Cruiser 300 GX.R)
- Арлын дугаар (VIN) - урт тоо/үсэг
- Улсын дугаар (жишээ: 1272 УНС)
- Өнгө, хурдны хайрцаг, түлш, хүч дамжуулах
- Үйлдвэрлэсэн он, орж ирсэн он
- Зах зээлийн үнэ

**Холбогдох талууд:**
- Захиалагч (ихэвчлэн "Мандал даатгал" ХК)
- Эзэмшигч (нэр, хаяг)
- Үнэлгээчин, гүйцэтгэгч

**Эвдрэл, зардлын мэдээлэл:**
- Эвдэрсэн эд анги, зардлын нэр
- Эвдрэлийн зэрэг (Их/Дунд/Бага)
- Үнэлгээ (тоо)
- Үнэлгээний тайлбар (Солих, Засах, Ажлын хөлс гэх мэт)
- Шууд зардлын дүн, шууд бус зардлын дүн
- Нийт дүн

**Нэмэлт мэдээлэл:**
- Үзлэгийн үр дүн, техникийн байдал
- Үнэлгээний арга, материал
- Үнэлгээний баталгаа, хуулийн заалт
- Гарын үсэг, тамга

**Машины зургийн цуглуулга:**
- 3x3 торон хэлбэртэй ойрын зургууд
- Машины гадна талын хэсгүүд: гэрэл, тор, бампер, хамар, дугуй, хажуугийн банз
- Маркийн бичиг/лого (жишээ: LAND CRUISER, BMW, Mercedes, Audi гэх мэт)
- Хамгаалалтын тунгалаг хальсны ирмэгүүд
- Өөр өөр өнгөтэй их бие (хар, цагаан, улаан, цэнхэр, саарал гэх мэт)
- Хар/цагаан хуванцар тор, агааржуулалтын нүхнүүд
- Дугуй/дөрвөлжин гэрлийн угсралтууд
- Цэвэр шугамуудтай гадна тал
- Ямарч марк, загварын машин байж болно
- Зүгээр ямарч хамаагүй машины зураг байхад болно

**Үйлчилгээний баримт, төлбөрийн баримт:**
- "SARIMT.MN" лого, "Ашидбилгүүн" компанийн нэр
- "ТТД" (Гүйлгээний дугаар), "ДДТД" (Дэлгэрэнгүй дугаар), "Огноо" зэрэг мэдээлэл
- "Даатгалын нөхөн олговрыг зохицуулах үйлчилгээ" гэсэн үйлчилгээний нэр
- "Нийт үнэ", "НХАТ", "Бүгд үнэ" зэрэг нийт дүнгүүд
- "ITXXXXXXXX" хэлбэрийн код
- QR код агуулсан баримт

**Төлбөрийн баримтын шинж тэмдгүүд:**
- Гарчигт: "ТӨЛБӨРИЙН БАРИМТ"
- Огноо, цаг (жишээ: 2024-10-14 12:30:40)
- Борлуулагчийн мэдээлэл: ТТД, Нэр (жишээ: АШИДБИЛГҮҮН), Хаяг, Банкны нэр, Дансны дугаар
- Худалдан авагчийн мэдээлэл: ТТД, Нэр, Хаяг, Утас
- Үйлчилгээний жагсаалт: "даатгал, даатгалын зуучлал, давхар даатгал, эд хөрөнгийн бүртгэлийн үйлчилгээ"
- Нийт дүнгийн мэдээл: Бараа, ажил үйлчилгээний үнэ, НХАТ, Нийт дүн
- Гарын үсэг, нэр, тамга, QR код

**Чухал тайлбар:**
- "Даатгалын нөхөн олговрыг зохицуулах үйлчилгээ" гэсэн үйлчилгээний нэр агуулсан баримт нь үнэлгээний тайлангийн нэг хэсэг бөгөөд даатгалын үнэлгээний үйл явцтай холбоотой
- Энэ төрлийн баримт нь үнэлгээний тайлангийн төлбөрийн хэсэг эсвэл холбогдох баримт байж болно
- "Буруу бичиг баримт" гэж ангилахгүй, харин "Үнэлгээний тайлан" эсвэл "Холбогдох баримт" гэж ангилна

**Баримтын төрлүүд:**
- Үнэлгээний тайлан (үндсэн тайлан)
- Үнэлгээний төлбөрийн баримт (холбогдох баримт)
- Даатгалын нөхөн олговрын үйлчилгээний баримт (холбогдох баримт)
- Төлбөрийн баримт (үнэлгээний тайлангийн холбогдох баримт)
- Эдгээр бүгд үнэлгээний тайлангийн хэсэг бөгөөд "Буруу бичиг баримт" гэж ангилахгүй

**Хүлээн зөвшөөрөх баримтууд:**
- "ТӨЛБӨРИЙН БАРИМТ" гарчигтай баримт
- "АШИДБИЛГҮҮН" компанийн баримт
- "даатгал, даатгалын зуучлал" гэсэн үйлчилгээ агуулсан баримт
- Эдгээр нь үнэлгээний тайлангийн холбогдох баримт бөгөөд хүлээн зөвшөөрнө

Зорилго: Зөвхөн ийм төрлийн үнэлгээний тайлан, төлбөрийн баримт, эсвэл холбогдох баримтуудыг шүүн дүгнэж, боломжтой мэдээллийг JSON хэлбэрээр шахаж гаргах. 

**Хүлээн зөвшөөрөх баримтууд:**
- Үнэлгээний тайлан
- Төлбөрийн баримт (үнэлгээний тайлангийн холбогдох баримт)
- Даатгалын нөхөн олговрын үйлчилгээний баримт
- "АШИДБИЛГҮҮН" компанийн баримт
- "даатгал, даатгалын зуучлал" гэсэн үйлчилгээ агуулсан баримт
- Машины зургийн цуглуулга (3x3 торон хэлбэртэй машины зургууд)

Бусад төрлийн баримт бол "Буруу бичиг баримт" гэж ангил.

Чанарын үнэлгээ:
- good: текст ихэнхдээ тод, тасарсан/блэгэр бага, эргэсэн ч уншигдана
- poor: бүдэг, хэт гялбаа, хүрээ тасарсан, уншихад хүндрэлтэй

Зөвхөн JSON буцаа. Кодын хашаа, тайлбар битгий оруул.`;

        const apiRequestBody = {
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    extraPrompt +
                    `
JSON форматтай хариулт өг:
{
  "isValid": true/false,
  "documentType": "Үнэлгээний тайлан" | "Буруу бичиг баримт",
  "side": "front",
  "quality": "good/poor",
  "issues": ["аль боломжит алдаа"],
  "message": "хэрэглэгчид өгөх товч тайлбар"
}
`,
                },
                { type: "image_url", image_url: { url: base64 } },
              ],
            },
          ],
          max_tokens: 1200,
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
            const content = data.choices[0].message.content;

            try {
              let cleanContent = content.trim();
              if (cleanContent.startsWith("```json")) {
                cleanContent = cleanContent
                  .replace("```json", "")
                  .replace("```", "")
                  .trim();
              } else if (cleanContent.startsWith("```")) {
                cleanContent = cleanContent.replace(/```/g, "").trim();
              }

              const parsedData = JSON.parse(cleanContent);

              if (
                parsedData.isValid !== undefined &&
                parsedData.documentType &&
                parsedData.message
              ) {
                resolve(parsedData);
              } else {
                resolve({
                  isValid: false,
                  documentType: "Үнэлгээний тайлан",
                  message: "AI-ийн хариулт бүрэн бус байна",
                });
              }
            } catch (parseError) {
              console.error(
                "JSON parse error:",
                parseError,
                "Content:",
                content
              );
              resolve({
                isValid: false,
                documentType: "Үнэлгээний тайлан",
                message: "Зурган дээрх мэдээллийг уншихад алдаа гарлаа",
              });
            }
          } else {
            resolve({
              isValid: false,
              documentType: "Үнэлгээний тайлан",
              message: "AI шалгалтад алдаа гарлаа",
            });
          }
        } catch {
          resolve({
            isValid: false,
            documentType: "Үнэлгээний тайлан",
            message: "Серверийн алдаа",
          });
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // AI зураг боловсруулах функц
  const processImageWithAI = async (file: File) => {
    try {
      const resizedFile = await resizeImage(file, 1024, 1024, 0.8);
      console.log(
        `Зураг resize хийгдлээ: ${file.size} -> ${resizedFile.size} bytes`
      );

      const validation = await validateDocument(resizedFile);

      console.log(
        "AI validation:",
        validation.documentType,
        "isValid:",
        validation.isValid
      );

      if (validation.documentType === "Буруу бичиг баримт") {
        // Remove the invalid file from uploadedFiles
        setUploadedFiles((prev) =>
          prev.filter((f, idx) => idx !== uploadedFiles.length - 1)
        );
        toast.error(validation.message || "Буруу бичиг баримтын зураг байна!");
        return false;
      }

      if (
        (validation.documentType === "Үнэлгээний тайлан" ||
          validation.documentType === "Төлбөрийн баримт" ||
          validation.documentType === "Машины зургийн цуглуулга") &&
        validation.isValid
      ) {
        const documentTypeText =
          validation.documentType === "Төлбөрийн баримт"
            ? "Төлбөрийн баримт"
            : "Үнэлгээний тайлан";
        showAIToast(`${documentTypeText} танигдлаа!`, true);

        // Update the file validation status
        setUploadedFiles((prev) =>
          prev.map((f, idx) =>
            idx === prev.length - 1
              ? {
                  ...f,
                  isProcessing: false,
                  validation: {
                    isValid: validation.isValid,
                    photoType: validation.documentType,
                    message: validation.message,
                  },
                }
              : f
          )
        );

        // Attachments массивт base64 утгыг шинэчилж өгөх
        try {
          const base64 = await convertToBase64(file);
          setFormValues((prev) => {
            const newAttachments = [...prev.attachments];
            // Хамгийн сүүлд нэмсэн attachment-ыг олж base64 утгыг шинэчилнэ
            const lastAttachmentIndex = newAttachments.length - 1;
            if (lastAttachmentIndex >= 0) {
              newAttachments[lastAttachmentIndex] = {
                ...newAttachments[lastAttachmentIndex],
                image_base64: base64,
              };
            }
            return { ...prev, attachments: newAttachments };
          });
        } catch (error) {
          console.error("Base64 conversion error:", error);
        }

        return true;
      } else {
        showAIToast(
          "Зөвхөн үнэлгээний тайлан эсвэл төлбөрийн баримтын зураг оруулна уу!",
          false
        );
        // Remove invalid file
        setUploadedFiles((prev) =>
          prev.filter((f, idx) => idx !== uploadedFiles.length - 1)
        );
        return false;
      }
    } catch (error) {
      console.error("AI processing error:", error);
      toast.error("AI боловсруулалтад алдаа гарлаа");
      // Remove file on error
      setUploadedFiles((prev) =>
        prev.filter((f, idx) => idx !== uploadedFiles.length - 1)
      );
      return false;
    }
  };

  // Файл upload хийх үед AI боловсруулах - олон файл дэмжих
  const handleFileUploadWithAI = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      // Add file with processing state
      const tempUploadedFile: UploadedFile = {
        file: file,
        preview: URL.createObjectURL(file),
        isProcessing: true,
        validation: null,
      };

      setUploadedFiles((prev) => [...prev, tempUploadedFile]);

      // Attachments руу бас нэмэх
      const fileName = `Үнэлгээний тайлан - ${file.name}`;

      const newAttachment = {
        fileName: fileName,
        image_base64: "", // AI боловсруулалтын дараа base64 болгоно
        file: file,
      };

      setFormValues((prev) => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment],
      }));

      // Process with AI
      const isValid = await processImageWithAI(file);

      if (isValid) {
        // Update formValues if needed
        setFormValues((prev) => {
          const newPhotos = [...prev.driverPhotos];
          if (!newPhotos[4]) {
            newPhotos[4] = file; // Set first file as main
          }
          return { ...prev, driverPhotos: newPhotos };
        });
      }
    }

    // Reset input
    e.target.value = "";
  };

  // Remove file handler for grid - нэг файл устгах
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

    // If removing the last file, clear formValues
    if (uploadedFiles.length === 1) {
      setFormValues((prev: FormValues) => ({
        ...prev,
        driverPhotos: prev.driverPhotos.map((item, i) =>
          i === 4 ? null : item
        ),
        attachments: prev.attachments.filter(
          (
            _: {
              fileName: string;
              image_base64: string;
              file: File | null;
            },
            i: number
          ) => i !== 4
        ),
      }));
      setValidationResults((prev) => {
        const newResults = { ...prev };
        delete newResults[4];
        return newResults;
      });
    }
  };

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold">
              <Image
                src={Tsagdaa}
                alt="Үнэлгээний тайлан"
                className="w-full h-full object-contain"
                width={32}
                height={32}
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Үнэлгээ</h4>
              <p className="text-sm text-gray-600">Олон зураг оруулж болно</p>
            </div>
          </div>
        </div>
      </div>

      <div className="transition-all duration-500 ease-in-out overflow-hidden max-h-[1000px] opacity-100">
        <div className="p-6">
          <div className="w-full border-2 border-dashed border-blue-300 rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 hover:border-blue-400 cursor-pointer hover:bg-blue-50">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <span className="mt-2 text-base text-blue-700 font-medium text-center">
              Үнэлгээний зургуудаа чирж оруулах эсвэл{" "}
              <label
                htmlFor="vehicle-assessment-photos"
                className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors"
              >
                browse files
              </label>
            </span>
            <span className="mt-1 text-sm text-gray-500">
              Олон зураг сонгож болно (Ctrl/Cmd дарж сонгоно уу)
            </span>

            <input
              id="vehicle-assessment-photos"
              name="vehicleCertificatePhotos"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => handleFileUploadWithAI(e)}
            />
          </div>

          {/* Show FileUploadGrid when files are uploaded */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <FileUploadGrid
                uploadedFiles={uploadedFiles}
                onRemoveFile={handleRemoveFile}
                title="Үнэлгээний тайлан"
                className=""
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
