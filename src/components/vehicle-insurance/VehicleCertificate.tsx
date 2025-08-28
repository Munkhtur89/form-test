"use client";

import React, { useState } from "react";
import { FormValues } from "@/types/form";
import Image from "next/image";
import toast from "react-hot-toast";
import { ShowAIToast } from "./ShowAIToast";
import { DocumentValidation } from "./types";
import { resizeImage } from "@/lib/imageUtils";
import { ScannerEffect } from "@/components/ui";
import Tsagdaa from "@/../public/logo/soyombo.png";

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

export default function VehicleCertificate({
  formValues,
  setFormValues,
  validationResults,
  setValidationResults,
}: VehicleCertificateProps) {
  const [isProcessingImage, setIsProcessingImage] = useState<number | null>(
    null
  );

  // Бичиг баримт таних функц
  const validateDocument = async (file: File): Promise<DocumentValidation> => {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        const extraPrompt = `
Энэ зураг тээврийн хэрэгслийн гэрчилгээ мөн үү?

**Тээврийн хэрэгслийн гэрчилгээ (лавлагаа, тодорхойлолт гэх мэт):**
- "ТЕХНИКИЙН ТОДОРХОЙЛОЛТ" гэсэн гарчиг
- "ГЭРЧИЛГЭЭ ОЛГОСОН БАЙГУУЛЛАГА" гэсэн хэсэг
- MGL лого, улсын дугаар, марк загвар, VIN дугаар
- "REFERENCE", "DIGITAL CERTIFICATE" гэсэн үгс

**Чухал:** Лавлагаа, тодорхойлолт, гэрчилгээ гэх мэт бүх нь тээврийн хэрэгслийн гэрчилгээ юм!

**Хэрэв дээрх зүйлс байвал:** Тээврийн хэрэгслийн гэрчилгээ (isValid: true)
**Хэрэв байхгүй бол:** Буруу бичиг баримт (isValid: false)

**Эцсийн заавар:**
- "REFERENCE", "DIGITAL CERTIFICATE", "ТЕХНИКИЙН ТОДОРХОЙЛОЛТ" гэсэн үгс байвал энэ бол тээврийн хэрэгслийн гэрчилгээ юм
- Хэрэв дээрх үгс байхгүй бол энэ бол буруу бичиг баримт юм

**Эцсийн тайлбар:**
- Энэ баримт нь тээврийн хэрэгслийн мэдээлэл агуулсан албан ёсны баримт юм
- Лавлагаа, тодорхойлолт, гэрчилгээ гэх мэт бүх нь тээврийн хэрэгслийн гэрчилгээ юм
- Хэрэв дээрх мэдээллүүд байвал isValid: true гэж оноох ёстой
`;

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
JSON хариулт:
{
  "isValid": true/false,
  "documentType": "Тээврийн хэрэгслийн гэрчилгээ/Буруу бичиг баримт",
  "side": "front",
  "message": "Товч тайлбар"
}
`,
                },
                { type: "image_url", image_url: { url: base64 } },
              ],
            },
          ],
          max_tokens: 2000,
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
                  documentType: "Тээврийн хэрэгслийн гэрчилгээ",
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
                documentType: "Тээврийн хэрэгслийн гэрчилгээ",
                message: "Зурган дээрх мэдээллийг уншихад алдаа гарлаа",
              });
            }
          } else {
            resolve({
              isValid: false,
              documentType: "Тээврийн хэрэгслийн гэрчилгээ",
              message: "AI шалгалтад алдаа гарлаа",
            });
          }
        } catch {
          resolve({
            isValid: false,
            documentType: "Тээврийн хэрэгслийн гэрчилгээ",
            message: "Серверийн алдаа",
          });
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // AI зураг боловсруулах функц
  const processImageWithAI = async (file: File, imageIndex: number) => {
    setIsProcessingImage(imageIndex);

    try {
      const resizedFile = await resizeImage(file, 512, 512, 0.7);
      console.log(
        `Зураг resize хийгдлээ: ${file.size} -> ${resizedFile.size} bytes`
      );

      const validation = await validateDocument(resizedFile);

      setValidationResults((prev) => ({
        ...prev,
        [imageIndex]: validation,
      }));

      console.log(
        "AI side:",
        validation.side,
        "imageIndex:",
        imageIndex,
        "documentType:",
        validation.documentType
      );

      if (validation.documentType === "Буруу бичиг баримт") {
        setFormValues((prev) => {
          const arr = [...prev.driverPhotos];
          arr[imageIndex] = null;
          return { ...prev, driverPhotos: arr };
        });
        setValidationResults((prev) => {
          const newResults = { ...prev };
          delete newResults[imageIndex];
          return newResults;
        });
        toast.error(validation.message || "Буруу бичиг баримтын зураг байна!");
        setIsProcessingImage(null);
        return;
      }

      if (imageIndex === 4) {
        if (
          validation.documentType === "Тээврийн хэрэгслийн гэрчилгээ" &&
          validation.isValid
        ) {
          showAIToast("Тээврийн хэрэгслийн гэрчилгээ танигдлаа!", true);
        } else {
          showAIToast(
            "Зөвхөн Тээврийн хэрэгслийн гэрчилгээний зураг оруулна уу!",
            false
          );
          setFormValues((prev) => {
            const arr = [...prev.driverPhotos];
            arr[4] = null;
            return { ...prev, driverPhotos: arr };
          });
          return;
        }
      }

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
    } catch (error) {
      console.error("AI processing error:", error);
      toast.error("AI боловсруулалтад алдаа гарлаа");
    } finally {
      setIsProcessingImage(null);
    }
  };

  // Файл upload хийх үед AI боловсруулах
  const handleFileUploadWithAI = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetIndex: number
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      const file = files[0];

      setFormValues((prev) => {
        const newPhotos = [...prev.driverPhotos];
        newPhotos[targetIndex] = file;
        return { ...prev, driverPhotos: newPhotos };
      });

      // Attachments руу бас нэмэх
      const fileName = `Тээврийн хэрэгслийн гэрчилгээ - ${file.name}`;

      const newAttachment = {
        fileName: fileName,
        image_base64: "", // AI боловсруулалтын дараа base64 болгоно
        file: file,
      };

      setFormValues((prev) => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment],
      }));

      await processImageWithAI(file, targetIndex);
    }
  };

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
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
                Тээврийн хэрэгслийн гэрчилгээ
              </h4>
              <p className="text-sm text-gray-600">
                Зөвхөн нэг зураг шаардлагатай
              </p>
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
              Тээврийн хэрэгслийн гэрчилгээний зургаа чирж оруулах эсвэл{" "}
              <label
                htmlFor="vehicle-certificate-photos"
                className="text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors"
              >
                browse files
              </label>
            </span>

            <input
              id="vehicle-certificate-photos"
              name="vehicleCertificatePhotos"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFileUploadWithAI(e, 4)}
            />
          </div>

          <div className="mt-6">
            <div className="flex flex-col items-center relative">
              <div className="w-full max-w-sm mx-auto sm:max-w-none">
                {formValues?.driverPhotos[4] && (
                  <div className="relative group">
                    <Image
                      src={URL.createObjectURL(formValues?.driverPhotos[4])}
                      width={100}
                      height={100}
                      alt="Тээврийн хэрэгслийн гэрчилгээ"
                      className="w-full h-64 object-contain rounded-xl border-2 border-gray-200 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                    />
                    {isProcessingImage === 4 && (
                      <ScannerEffect isProcessing={true} />
                    )}
                    {validationResults[4] &&
                      validationResults[4].isValid === false && (
                        <div className="absolute bottom-2 left-2 right-2 bg-red-100 border border-red-400 text-red-700 rounded px-4 py-2 z-20 text-sm shadow">
                          <b>Алдаа:</b> {validationResults[4].message}
                        </div>
                      )}
                    {validationResults[4] &&
                      validationResults[4].isValid === true && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white rounded-full p-3 shadow-lg z-20">
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        type="button"
                        className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors duration-200 transform hover:scale-110"
                        onClick={() => {
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
                        }}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-sm font-medium text-gray-700">
                        Тээврийн хэрэгслийн гэрчилгээ
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
