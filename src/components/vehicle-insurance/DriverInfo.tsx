"use client";

import React, { useState } from "react";
import { FormValues } from "@/types/form";
import Image from "next/image";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";
import { ShowAIToast } from "./ShowAIToast";
import { DriverInfoProps, DocumentValidation } from "./types";
// import Reference from "./Reference";
// import { motion, AnimatePresence } from "framer-motion";
import { resizeImage } from "@/lib/imageUtils";
import { ScannerEffect } from "@/components/ui";
import Tsagdaa from "@/../public/logo/soyombo.png";
import Joloo from "@/../public/logo/tsagdaa_joloo.png";
import Vnemleh from "@/../public/logo/user.png";
import VehicleCertificate from "./VehicleCertificate";
import Assessment from "./Assessment";

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

export default function DriverInfo({
  formValues,
  handleChange,

  setFormValues,
}: DriverInfoProps) {
  console.log(formValues);

  // Expand/collapse төлөв
  const [isProcessingImage, setIsProcessingImage] = useState<number | null>(
    null
  );
  const [validationResults, setValidationResults] = useState<{
    [key: number]: DocumentValidation;
  }>({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [currentValidation, setCurrentValidation] =
    useState<DocumentValidation | null>(null);
  const [driverDocTab, setDriverDocTab] = useState<"license" | "reference">(
    "license"
  );
  // const [showType, setShowType] = useState<"card" | "lavlagaa">("card");

  // Бичиг баримт таних функц
  const validateDocument = async (file: File): Promise<DocumentValidation> => {
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        // Зургийн төрлийг тодорхойлох
        const expectedDocument = "";
        const extraPrompt = `
Энэ зураг Монгол улсын бичиг баримтын зураг мөн үү? Ямар бичиг баримт болохыг (иргэний үнэмлэх, жолооны үнэмлэх, тээврийн хэрэгслийн гэрчилгээ, бусад) тодорхой хэл. Мөн энэ зураг урд тал уу, ард тал уу гэдгийг маш тодорхой хэл.

**Иргэний үнэмлэх:**
- Урд талд: хүний зураг, овог, нэр, регистрийн дугаар, төрсөн огноо, хүйс, гарын үсэг, эрх бүхий байгууллагын тамга, "МОНГОЛ УЛСЫН ИРГЭНИЙ ҮНЭМЛЭХ" гэсэн бичиг байна.
- Ард талд: чип, QR код, Монгол улсын газрын зураг, "Улсын бүртгэлийн ерөнхий газар" гэсэн бичиг, хүчинтэй хугацаа, "MNG" гэсэн тэмдэглэгээ байна.

**Жолооны үнэмлэх:**
- Урд талд: "ЖОЛООДОХ ЭРХИЙН ҮНЭМЛЭХ" гэсэн бичиг, хүний зураг, овог нэр, төрсөн огноо, хүчинтэй хугацаа, QR код, ангилал, эрх олгосон байгууллага, дугаар байна.
- Ард талд: "MONGOLIAN DRIVING LICENSE" гэсэн бичиг, ангилалын хүснэгт, дугаар, тайлбар текстүүд байна.

**Жолооны үнэмлэхийн лавлагаа:**
- Энэ бол нэг талтай бичиг баримт бөгөөд дотор талд дараах мэдээлэл байна:
  * "ЦАГДААГИЙН ЕРӨНХИЙ ГАЗАР ЖОЛООЧИЙН ЛАВЛАГАА, МЭДЭЭЛЭЛ" гэсэн гарчиг
  * "ТӨРИЙН ҮЙЛЧИЛГЭЭНИЙ НЭГДСЭН СИСТЕМЭЭР ДАМЖУУЛАН МЭДЭЭЛЭЛ ХАРИУЦАГЧААС ОЛГОХ ЛАВЛАГАА, ТОДОРХОЙЛОЛТ" гэсэн дээд гарчиг
  * Монгол улсын төрийн сүлд (алтан өнгөтэй)
  * Зүүн талд: хүний зураг, "Регистр:" дугаар, "Төрсөн огноо:"
  * Баруун талд: "Ургийн овог:", "Эцэг/эхийн нэр:", "Нэр:", "Төрсөн газар:", "Хүйс:", "Цусны бүлэг:", "Жолоочийн үнэмлэхийн дугаар:", "Жолооч болсон огноо:", "Үнэмлэх олгосон огноо:"
  * Доод хэсэгт: "ТЭЭВРИЙН ХЭРЭГСЛИЙН АНГИЛАЛ" хүснэгт, "Жолооны үнэмлэхийн төлөв:", "Үнэмлэхийн хүчинтэй хугацаа:", "Бүртгэгдсэн мэдээлэл:"
  * Доод зүүн талд: QR код
  * Доод баруун талд: "Мэдээлэл хариуцагч байгууллагын хаяг", холбоо барих утас

**Тээврийн хэрэгслийн гэрчилгээ:**
- Энэ бол нэг талтай бичиг баримт бөгөөд дотор талд дараах мэдээлэл байна:
  * "ТЕХНИКИЙН ТОДОРХОЙЛОЛТ" (Technical specifications) - зүүн талд
  * "ГЭРЧИЛГЭЭ ОЛГОСОН БАЙГУУЛЛАГА" (Certificate issuing authority) - баруун талд
  * "MGL" лого, "MONGOLIA" гэсэн бичиг
  * Улсын дугаар (жишээ: 3789УБК, 3415УКУ)
  * Марк, загвар (жишээ: LEXUS.RX350h, Toyota Land Cruiser-J200)
  * Ангилал, хөдөлгүүрийн багтаамж (жишээ: 2487, В, Евро V)
  * Бүх жин, өөрийн жин
  * Даац, суудлын тоо
  * Төрөл, зориулалт
  * Арлын дугаар (VIN), хөдөлгүүрийн дугаар
  * Үйлдвэрлэсэн он, импортолсон огноо
  * Өнгө, өмчлөгч, хаяг
  * Баруун талд: тэмдэг, гарын үсэг, огноо, баримтын дугаар

**Тээврийн хэрэгслийн гэрчилгээ лавлагаа таниул:**
- Энэ бол нэг талтай бичиг баримт бөгөөд дотор талд дараах мэдээлэл байна:
  * **Дээд хэсэгт:** "ТӨРИЙН ҮЙЛЧИЛГЭЭНИЙ НЭГДСЭН СИСТЕМЭЭР ДАМЖУУЛАН МЭДЭЭЛЭЛ ХАРИУЦАГЧААС ОЛГОХ ЛАВЛАГАА, ТОДОРХОЙЛОЛТ" гэсэн том гарчиг
  * **Төв хэсэгт:** "АВТО ТЭЭВРИЙН ҮНДЭСНИЙ ТӨВ" болон "АВТОТЭЭВРИЙН ХЭРЭГСЛИЙН ЦАХИМ ГЭРЧИЛГЭЭНИЙ ЛАВЛАГАА" гэсэн төв гарчиг
  * **Дугаар:** "Дугаар: 8657007455078" гэсэн хэлбэрээр
  * **Өмчлөгч болон эзэмшигчийн мэдээлэл:**
    - Зүүн талд: "Өмчлөгчийн нэр:", "Регистрийн дугаар:"
    - Баруун талд: "Эзэмшигчийн нэр:", "Регистрийн дугаар:"
  * **"ТЕХНИКИЙН ТОДОРХОЙЛОЛТ" хэсэгт:**
    - Зүүн баганад: Улсын дугаар, Марк, Загвар, Ангилал, Өөрийн жин, даац, Суудлын тоо, Төрөл, Зориулалт, Хүрдний байрлал
    - Баруун баганад: Урт, өргөн, өндөр, Арлын дугаар, Хөдөлгүүрийн багтаамж, Үйлдвэрлэсэн он, Импортолсон огноо, Өнгө, Тэнхлэгийн тоо, Хаалганы тоо, Техник хяналтын үзлэг
  * **Доод хэсэгт:** QR код, "Хүсэлт гаргасан хэлбэр: Төрийн үйлчилгээний цахим систем" гэсэн текст
  * **Холбоо барих мэдээлэл:** "Мэдээлэл хариуцагч байгууллагын хаяг:", "Мэдээлэл хариуцагч байгууллагын холбоо барих утас:"
  * **Жич:** "Жич: Цахим архивын лавлагаа нь архивын баримт, эх сурвалжид тулгуурлан гаргах хууль зүйн хүчин төгөлдөр, албаны ёсны баримт мөн." гэсэн тайлбар

**Чухал:**
- Тээврийн хэрэгслийн гэрчилгээ бол side: "front" гэж оноо (нэг талтай)
- Тээврийн хэрэгслийн гэрчилгээ лавлагаа бол side: "front" гэж оноо (нэг талтай)
- Иргэний үнэмлэх, жолооны үнэмлэх бол side: "front" эсвэл "back" гэж зөв оноо
- documentType талбарт бичиг баримтын нэрийг тодорхой бич
- **Тээврийн хэрэгслийн гэрчилгээ лавлагаа-г танихын тулд:**
  * "ТӨРИЙН ҮЙЛЧИЛГЭЭНИЙ НЭГДСЭН СИСТЕМЭЭР ДАМЖУУЛАН МЭДЭЭЛЭЛ ХАРИУЦАГЧААС ОЛГОХ ЛАВЛАГАА, ТОДОРХОЙЛОЛТ" гэсэн дээд гарчиг байх
  * "АВТО ТЭЭВРИЙН ҮНДЭСНИЙ ТӨВ" болон "АВТОТЭЭВРИЙН ХЭРЭГСЛИЙН ЦАХИМ ГЭРЧИЛГЭЭНИЙ ЛАВЛАГАА" гэсэн төв гарчиг байх
  * "ТЕХНИКИЙН ТОДОРХОЙЛОЛТ" хэсэгт зүүн, баруун баганад мэдээлэл байрласан байх
- Хэрвээ буруу бичиг баримт бол documentType-д "Буруу бичиг баримт" гэж бичиж, isValid: false гэж өг
- Message талбарт хэрэглэгчид ойлгомжтой, эелдэг тайлбар бич
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
JSON форматтай хариулт өг:
{
  "isValid": true/false,
  "documentType": "Иргэний үнэмлэх/Жолооны үнэмлэх/Жолооны үнэмлэхийн лавлагаа/Тээврийн хэрэгслийн гэрчилгээ/Тээврийн хэрэгслийн гэрчилгээ лавлагаа/Буруу бичиг баримт",
  "side": "front/back",
  "quality": "good/poor",
  "issues": ["алдааны жагсаалт"],
  "extractedData": {
    "lastName": "овог",
    "firstName": "нэр",
    "regNumber": "регистрийн дугаар",
    "licenseNumber": "жолооны үнэмлэхийн дугаар",
    "licenseType": "жолооны үнэмлэхийн ангилал",
    "validUntil": "хүчинтэй хугацаа",
    "plateNumber": "улсын дугаар",
    "makeModel": "марк загвар",
    "vinNumber": "арлын дугаар",
    "engineNumber": "хөдөлгүүрийн дугаар",
    "manufactureYear": "үйлдвэрлэсэн он",
    "ownerName": "өмчлөгч",
    "ownerAddress": "хаяг"
  },
  "message": "Тайлбар"
}
`,
                },
                { type: "image_url", image_url: { url: base64 } },
              ],
            },
          ],
          max_tokens: 4000,
          stream: false,
          temperature: 0.5,
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
              // JSON-г цэвэрлэх (backticks болон "json" гэсэн текст арилгах)
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

              // Шаардлагатай талбаруудыг шалгах
              if (
                parsedData.isValid !== undefined &&
                parsedData.documentType &&
                parsedData.message
              ) {
                resolve(parsedData);
              } else {
                resolve({
                  isValid: false,
                  documentType: expectedDocument,
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
                documentType: expectedDocument,
                message: "Зурган дээрх мэдээллийг уншихад алдаа гарлаа",
              });
            }
          } else {
            resolve({
              isValid: false,
              documentType: expectedDocument,
              message: "AI шалгалтад алдаа гарлаа",
            });
          }
        } catch {
          resolve({
            isValid: false,
            documentType: expectedDocument,
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
      // Зураг resize хийх
      const resizedFile = await resizeImage(file, 256, 256, 0.8);
      console.log(
        `Зураг resize хийгдлээ: ${file.size} -> ${resizedFile.size} bytes`
      );

      // Эхлээд бичиг баримт шалгах
      const validation = await validateDocument(resizedFile);

      // Шалгалтын үр дүнг хадгалах
      setValidationResults((prev) => ({
        ...prev,
        [imageIndex]: validation,
      }));

      // Debug: AI side утгыг шалгах
      console.log(
        "AI side:",
        validation.side,
        "imageIndex:",
        imageIndex,
        "documentType:",
        validation.documentType
      );

      // Хэрвээ буруу бичиг баримт бол зургыг устгана
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
        setShowValidationModal(false);
        setIsProcessingImage(null);
        return;
      }

      // 1. Иргэний үнэмлэх болон жолооны үнэмлэхийн зураг давхцлыг шалгах
      // Иргэний үнэмлэх: 0,1 | Жолооны үнэмлэх: 2,3
      if (imageIndex <= 1) {
        // Иргэний үнэмлэхийн зураг жолооны үнэмлэхийн зурагтай давхцаж байгаа эсэхийг шалгана
        const otherPhotos = [
          formValues.driverPhotos[2],
          formValues.driverPhotos[3],
        ];
        if (
          otherPhotos.some(
            (photo) =>
              photo &&
              formValues.driverPhotos[imageIndex] &&
              photo === formValues.driverPhotos[imageIndex]
          )
        ) {
          // Давхцсан бол хоёуланг нь устгана
          setFormValues((prev) => {
            const arr = [...prev.driverPhotos];
            arr[imageIndex] = null;
            arr[2] = null;
            arr[3] = null;
            return { ...prev, driverPhotos: arr };
          });
          setValidationResults((prev) => {
            const newResults = { ...prev };
            delete newResults[imageIndex];
            delete newResults[2];
            delete newResults[3];
            return newResults;
          });
          toast.error(
            "Иргэний үнэмлэх болон жолооны үнэмлэхийн зураг давхцаж байна!"
          );
          setShowValidationModal(false);
          setIsProcessingImage(null);
          return;
        }
      } else if (imageIndex === 2 || imageIndex === 3) {
        // Жолооны үнэмлэхийн зураг иргэний үнэмлэхийн зурагтай давхцаж байгаа эсэхийг шалгана
        const otherPhotos = [
          formValues.driverPhotos[0],
          formValues.driverPhotos[1],
        ];
        if (
          otherPhotos.some(
            (photo) =>
              photo &&
              formValues.driverPhotos[imageIndex] &&
              photo === formValues.driverPhotos[imageIndex]
          )
        ) {
          // Давхцсан бол хоёуланг нь устгана
          setFormValues((prev) => {
            const arr = [...prev.driverPhotos];
            arr[imageIndex] = null;
            arr[0] = null;
            arr[1] = null;
            return { ...prev, driverPhotos: arr };
          });
          setValidationResults((prev) => {
            const newResults = { ...prev };
            delete newResults[imageIndex];
            delete newResults[0];
            delete newResults[1];
            return newResults;
          });
          toast.error(
            "Иргэний үнэмлэх болон жолооны үнэмлэхийн зураг давхцаж байна!"
          );
          setShowValidationModal(false);
          setIsProcessingImage(null);
          return;
        }
      }

      // 2. Ард/урд талын зураг зөв байрлалтай эсэхийг шалгах
      // Иргэний үнэмлэх (0: урд, 1: ард), Жолооны үнэмлэх (2: урд, 3: ард)
      if (
        (imageIndex === 0 || imageIndex === 1) &&
        validation.documentType === "Иргэний үнэмлэх"
      ) {
        // Иргэний үнэмлэхийн урд талд зөвхөн урд талын зураг, ард талд зөвхөн ард талын зураг байх ёстой
        if (
          (imageIndex === 0 && validation.side === "back") ||
          (imageIndex === 1 && validation.side === "front")
        ) {
          // Буруу талд байвал зөв тал руу автоматаар зөөж байрлуулна
          const correctIndex = validation.side === "front" ? 0 : 1;
          const wrongIndex = validation.side === "front" ? 1 : 0;
          setFormValues((prev) => {
            const arr = [...prev.driverPhotos];
            // Хэрвээ зөв талд зураг байхгүй бол зөөж байрлуулна
            if (!arr[correctIndex]) {
              arr[correctIndex] = arr[wrongIndex];
              arr[wrongIndex] = null;
              return { ...prev, driverPhotos: arr };
            } else {
              // Хэрвээ зөв талд зураг байвал хоёуланг нь устгана
              arr[0] = null;
              arr[1] = null;
              return { ...prev, driverPhotos: arr };
            }
          });
          setValidationResults((prev) => {
            const newResults = { ...prev };
            delete newResults[0];
            delete newResults[1];
            return newResults;
          });
          if (!formValues.driverPhotos[correctIndex]) {
            toast.success("Зургыг зөв талд автоматаар байрлууллаа!");
          } else {
            toast.error(
              "Иргэний үнэмлэхийн урд/ард талын зураг зөрүүтэй байна!"
            );
          }
          setShowValidationModal(false);
          setIsProcessingImage(null);
          return;
        }
      }
      if (
        (imageIndex === 2 || imageIndex === 3) &&
        validation.documentType === "Жолооны үнэмлэх"
      ) {
        // Жолооны үнэмлэхийн урд талд зөвхөн урд талын зураг, ард талд зөвхөн ард талын зураг байх ёстой
        if (
          (imageIndex === 2 && validation.side === "back") ||
          (imageIndex === 3 && validation.side === "front")
        ) {
          // Буруу талд байвал зөв тал руу автоматаар зөөж байрлуулна
          const correctIndex = validation.side === "front" ? 2 : 3;
          const wrongIndex = validation.side === "front" ? 3 : 2;
          setFormValues((prev) => {
            const arr = [...prev.driverPhotos];
            if (!arr[correctIndex]) {
              arr[correctIndex] = arr[wrongIndex];
              arr[wrongIndex] = null;
              return { ...prev, driverPhotos: arr };
            } else {
              arr[2] = null;
              arr[3] = null;
              return { ...prev, driverPhotos: arr };
            }
          });
          setValidationResults((prev) => {
            const newResults = { ...prev };
            delete newResults[2];
            delete newResults[3];
            return newResults;
          });
          if (!formValues.driverPhotos[correctIndex]) {
            toast.success("Зургыг зөв талд автоматаар байрлууллаа!");
          } else {
            toast.error(
              "Жолооны үнэмлэхийн урд/ард талын зураг зөрүүтэй байна!"
            );
          }
          setShowValidationModal(false);
          setIsProcessingImage(null);
          return;
        }
      }

      // Хэрэв зөв бичиг баримт бол мэдээллийг бөглөх
      if (validation.isValid && validation.extractedData) {
        if (imageIndex === 0 || imageIndex === 1) {
          // Иргэний үнэмлэх - зөвхөн эндээс мэдээлэл авна
          if (
            validation.documentType === "Иргэний үнэмлэх" &&
            validation.isValid
          ) {
            setFormValues((prev: FormValues) => ({
              ...prev,
              driverName: validation.extractedData?.lastName || prev.driverName,
              driverLastname:
                validation.extractedData?.firstName || prev.driverLastname,
              driverRegNum:
                validation.extractedData?.regNumber || prev.driverRegNum,
            }));
            showAIToast(
              "Иргэний үнэмлэхний мэдээлэл автоматаар бөглөгдлөө!",
              true
            );
          } else {
            showAIToast("Зөвхөн Иргэний үнэмлэхний зураг оруулна уу!", false);
            setFormValues((prev) => {
              const arr = [...prev.driverPhotos];
              arr[imageIndex] = null;
              return { ...prev, driverPhotos: arr };
            });
            return;
          }
        } else if (imageIndex === 2 || imageIndex === 3) {
          // Жолооны үнэмлэх - мэдээллийг автоматаар бөглөх (зөрчилдөхгүй шалгана)
          if (
            validation.documentType === "Жолооны үнэмлэх" &&
            validation.isValid
          ) {
            const newLastName =
              validation.extractedData?.lastName?.trim() || "";
            const newFirstName =
              validation.extractedData?.firstName?.trim() || "";
            const newRegNumber =
              validation.extractedData?.regNumber?.trim() || "";

            if (!newLastName && !newFirstName && !newRegNumber) {
              showAIToast(
                "Жолооны үнэмлэх танигдлаа, гэхдээ шаардлагатай мэдээлэл илэрсэнгүй.",
                false
              );
            } else {
              const hasConflict =
                (!!formValues.driverName &&
                  !!newLastName &&
                  formValues.driverName.trim() !== newLastName) ||
                (!!formValues.driverLastname &&
                  !!newFirstName &&
                  formValues.driverLastname.trim() !== newFirstName) ||
                (!!formValues.driverRegNum &&
                  !!newRegNumber &&
                  formValues.driverRegNum.trim() !== newRegNumber);

              if (hasConflict) {
                showAIToast(
                  "Жолооны үнэмлэхээс уншсан мэдээлэл одоо байгаа утгатай зөрчилдөж байна. Өгөгдлийг өөрчлөөгүй.",
                  false
                );
              } else {
                setFormValues((prev: FormValues) => ({
                  ...prev,
                  driverName: newLastName || prev.driverName,
                  driverLastname: newFirstName || prev.driverLastname,
                  driverRegNum: newRegNumber || prev.driverRegNum,
                }));
                showAIToast(
                  "Жолоочийн мэдээлэл жолооны үнэмлэхнээс автоматаар бөглөгдлөө!",
                  true
                );
              }
            }
          } else {
            showAIToast("Зөвхөн Жолооны үнэмлэхний зураг оруулна уу!", false);
            setFormValues((prev) => {
              const arr = [...prev.driverPhotos];
              arr[imageIndex] = null;
              return { ...prev, driverPhotos: arr };
            });
            return;
          }
        } else if (imageIndex === 5) {
          // Жолоочийн лавлагаа (ЦЕГ-ийн лавлагаа)
          if (
            validation.documentType === "Жолооны үнэмлэхийн лавлагаа" &&
            validation.isValid
          ) {
            showAIToast("Жолоочийн лавлагаа зөв байна!", true);
          } else {
            showAIToast("Зөвхөн Жолоочийн лавлагааны зураг оруулна уу!", false);
            setFormValues((prev) => {
              const arr = [...prev.driverPhotos];
              arr[5] = null;
              return { ...prev, driverPhotos: arr };
            });
            return;
          }
        }
      } else if (!validation.isValid) {
        // Алдааны мэдээлэл
        showAIToast(validation.message, false);
      }

      // Шалгалтын үр дүнг хадгалах боловч popup нээхгүй
      setCurrentValidation(validation);

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

      // Зөв index-д хадгална
      setFormValues((prev) => {
        const newPhotos = [...prev.driverPhotos];
        newPhotos[targetIndex] = file;
        return { ...prev, driverPhotos: newPhotos };
      });

      // Attachments руу бас нэмэх
      let fileName = file.name;

      // Index-ээс хамааран нэр өгөх
      if (targetIndex === 0) {
        fileName = `Иргэний үнэмлэх урд тал - ${file.name}`;
      } else if (targetIndex === 1) {
        fileName = `Иргэний үнэмлэх ард тал - ${file.name}`;
      } else if (targetIndex === 2) {
        fileName = `Жолооны үнэмлэх урд тал - ${file.name}`;
      } else if (targetIndex === 3) {
        fileName = `Жолооны үнэмлэх ард тал - ${file.name}`;
      } else if (targetIndex === 5) {
        fileName = `Жолоочийн лавлагаа - ${file.name}`;
      }

      const newAttachment = {
        fileName: fileName,
        image_base64: "", // AI боловсруулалтын дараа base64 болгоно
        file: file,
      };

      setFormValues((prev) => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment],
      }));

      // AI боловсруулалт мөн зөв index-р дуудна
      await processImageWithAI(file, targetIndex);
    }
  };

  // Шалгалтын үр дүнг харуулах modal
  const ValidationModal = () => {
    if (!showValidationModal || !currentValidation) return null;

    return (
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            {currentValidation.isValid ? (
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
            )}
            <h3 className="text-lg font-bold text-gray-900">
              {currentValidation.isValid ? "Бичиг баримт зөв" : "Алдаа илрэлээ"}
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Бичиг баримт:</span>
              <span className="ml-2 text-gray-600">
                {currentValidation.documentType}
              </span>
            </div>

            {currentValidation.side && (
              <div>
                <span className="font-medium text-gray-700">Тал:</span>
                <span className="ml-2 text-gray-600">
                  {currentValidation.side === "front" ? "Урд тал" : "Ар тал"}
                </span>
              </div>
            )}

            {currentValidation.quality && (
              <div>
                <span className="font-medium text-gray-700">Чанар:</span>
                <span
                  className={`ml-2 ${
                    currentValidation.quality === "good"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {currentValidation.quality === "good" ? "Сайн" : "Муу"}
                </span>
              </div>
            )}

            {currentValidation.issues &&
              currentValidation.issues.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Асуудлууд:</span>
                  <ul className="mt-1 ml-4 text-sm text-red-600">
                    {currentValidation.issues.map(
                      (issue: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {issue}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                {currentValidation.message}
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => setShowValidationModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Хаах
            </button>
            {currentValidation.isValid && (
              <button
                onClick={() => {
                  toast.success("Мэдээлэл хадгалагдлаа!");
                  setShowValidationModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Хадгалах
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden mb-10">
        <div className="p-8">
          {/* Сонголтын хэсэг */}
          {/* <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Бичиг баримтын төрөл сонгох
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative cursor-pointer group">
                <input
                  type="radio"
                  name="idType"
                  value="card"
                  checked={showType === "card"}
                  onChange={() => setShowType("card")}
                  className="sr-only"
                />
                <div
                  className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                    showType === "card"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showType === "card"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {showType === "card" && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Иргэний үнэмлэхний зураг
                      </div>
                      <div className="text-sm text-gray-500">
                        Урд болон ард талын зураг
                      </div>
                    </div>
                  </div>
                </div>
              </label>

              <label className="relative cursor-pointer group">
                <input
                  type="radio"
                  name="idType"
                  value="lavlagaa"
                  checked={showType === "lavlagaa"}
                  onChange={() => setShowType("lavlagaa")}
                  className="sr-only"
                />
                <div
                  className={`p-6 border-2 rounded-xl transition-all duration-200 ${
                    showType === "lavlagaa"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showType === "lavlagaa"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {showType === "lavlagaa" && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Иргэний үнэмлэхний лавлагаа
                      </div>
                      <div className="text-sm text-gray-500">
                        Албан бичгийн лавлагаа
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div> */}

          {/* Сонголтоор харуулах хэсэг */}
          {/* <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              {showType === "lavlagaa" ? (
                <motion.div
                  key="lavlagaa"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className=" w-full h-auto"
                >
                  <Reference
                    onImageSelected={(file) =>
                      setFormValues((prev) => ({
                        ...prev,
                        lavlagaaImage: file,
                      }))
                    }
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="card"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className=" w-full"
                >
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                            1
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Иргэний үнэмлэхийн зураг
                            </h4>
                            <p className="text-sm text-gray-600">
                              Урд болон ард талын зургаа оруулна уу
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

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">
                              Урд тал
                            </span>
                          </div>
                          {formValues?.driverPhotos[0] ? (
                            <div className="relative group">
                              <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <Image
                                  src={URL.createObjectURL(
                                    formValues.driverPhotos[0]
                                  )}
                                  width={300}
                                  height={200}
                                  alt="Иргэний үнэмлэх урд тал"
                                  className="w-full h-48 object-cover"
                                />
                                {isProcessingImage === 0 && (
                                  <ScannerEffect isProcessing={true} />
                                )}
                              </div>
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  setFormValues((prev) => {
                                    const arr = [...prev.driverPhotos];
                                    arr[0] = null;
                                    return { ...prev, driverPhotos: arr };
                                  })
                                }
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                              <div className="space-y-3">
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
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    Зураг оруулах
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    PNG, JPG эсвэл JPEG
                                  </div>
                                </div>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUploadWithAI(e, 0)}
                              />
                            </label>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700">
                              Ард тал
                            </span>
                          </div>
                          {formValues?.driverPhotos[1] ? (
                            <div className="relative group">
                              <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                <Image
                                  src={URL.createObjectURL(
                                    formValues.driverPhotos[1]
                                  )}
                                  width={300}
                                  height={200}
                                  alt="Иргэний үнэмлэх ард тал"
                                  className="w-full h-48 object-cover"
                                />
                                {isProcessingImage === 1 && (
                                  <ScannerEffect isProcessing={true} />
                                )}
                              </div>
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  setFormValues((prev) => {
                                    const arr = [...prev.driverPhotos];
                                    arr[1] = null;
                                    return { ...prev, driverPhotos: arr };
                                  })
                                }
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                              <div className="space-y-3">
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
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    Зураг оруулах
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    PNG, JPG эсвэл JPEG
                                  </div>
                                </div>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUploadWithAI(e, 1)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}

          {/* Сонголт - Жолооны үнэмлэх / Жолоочийн лавлагаа (tab-like cards) */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDriverDocTab("license")}
              className={`text-left rounded-xl border p-4  jutransition-all duration-200 flex items-center gap-3 ${
                driverDocTab === "license"
                  ? "bg-yellow-50 border-yellow-300 shadow"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="w-10 h-10 rounded-lg  flex items-center justify-center">
                <Image
                  src={Joloo.src}
                  alt="Жолооны үнэмлэх"
                  className="w-full h-full object-contain"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <div className="font-medium text-gray-900">Жолооны үнэмлэх</div>
                <div className="text-sm text-gray-500">Урд/ард талын зураг</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setDriverDocTab("reference")}
              className={`text-left rounded-xl border p-4 transition-all duration-200 flex items-center gap-3 ${
                driverDocTab === "reference"
                  ? "bg-yellow-50 border-yellow-300 shadow"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="w-10 h-10 rounded-lg  flex items-center justify-center">
                <Image
                  src={Tsagdaa.src}
                  alt="Жолооны үнэмлэх"
                  className="w-full h-full object-contain"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  Жолоочийн лавлагаа,мэдээлэл
                </div>
                <div className="text-sm text-gray-500">
                  Нэг талын албан лавлагаа
                </div>
              </div>
            </button>
          </div>

          {/* Жолооны үнэмлэх зураг оруулах хэсэг */}
          {driverDocTab === "license" && (
            <div className="mt-5 bg-white  rounded-xl overflow-hidden ">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Урд тал */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Урд тал
                      </span>
                    </div>
                    {formValues?.driverPhotos[2] ? (
                      <div className="relative group">
                        <div className="relative overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={URL.createObjectURL(
                              formValues.driverPhotos[2]
                            )}
                            width={300}
                            height={200}
                            alt="Жолооны үнэмлэх урд тал"
                            className="w-full h-40 object-contain"
                          />
                          {isProcessingImage === 2 && (
                            <ScannerEffect isProcessing={true} />
                          )}
                          {validationResults[2] &&
                            validationResults[2].isValid && (
                              <div className="absolute top-2 left-2 bg-white/90 rounded-full p-1 shadow">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              </div>
                            )}
                        </div>
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            setFormValues((prev) => {
                              const arr = [...prev.driverPhotos];
                              arr[2] = null;
                              return { ...prev, driverPhotos: arr };
                            })
                          }
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="space-y-3">
                          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Зураг оруулах
                            </div>
                            <div className="text-xs text-gray-500">
                              PNG, JPG эсвэл JPEG
                            </div>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUploadWithAI(e, 2)}
                        />
                      </label>
                    )}
                  </div>

                  {/* Ард тал */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Ард тал
                      </span>
                    </div>
                    {formValues?.driverPhotos[3] ? (
                      <div className="relative group">
                        <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                          <Image
                            src={URL.createObjectURL(
                              formValues.driverPhotos[3]
                            )}
                            width={300}
                            height={200}
                            alt="Жолооны үнэмлэх ард тал"
                            className="w-full h-40 object-contain"
                          />
                          {isProcessingImage === 3 && (
                            <ScannerEffect isProcessing={true} />
                          )}
                          {validationResults[3] &&
                            validationResults[3].isValid && (
                              <div className="absolute top-2 left-2 bg-white/90 rounded-full p-1 shadow">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              </div>
                            )}
                        </div>
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            setFormValues((prev) => {
                              const arr = [...prev.driverPhotos];
                              arr[3] = null;
                              return { ...prev, driverPhotos: arr };
                            })
                          }
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="space-y-3">
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
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Зураг оруулах
                            </div>
                            <div className="text-xs text-gray-500">
                              PNG, JPG эсвэл JPEG
                            </div>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUploadWithAI(e, 3)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Жолоочийн лавлагаа (сонголтоор) */}
          {driverDocTab === "reference" && (
            <div className="mt-5 bg-white  rounded-xl overflow-hidden ">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 ">
                  Жолооны үнэмлэхний лавлагаа
                </span>
              </div>
              <div>
                {formValues?.driverPhotos[5] ? (
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 ">
                      <Image
                        src={URL.createObjectURL(formValues.driverPhotos[5])}
                        width={600}
                        height={360}
                        alt="Жолоочийн лавлагаа"
                        className="w-full h-60 object-contain"
                      />
                      {isProcessingImage === 5 && (
                        <ScannerEffect isProcessing={true} />
                      )}
                      {validationResults[5] && validationResults[5].isValid && (
                        <div className="absolute top-2 left-2 bg-white/90 rounded-full p-1 shadow">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setFormValues((prev) => {
                          const arr = [...prev.driverPhotos];
                          arr[5] = null;
                          return { ...prev, driverPhotos: arr };
                        })
                      }
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer">
                    <div className="space-y-3">
                      <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Лавлагааны зураг оруулах
                        </div>
                        <div className="text-xs text-gray-500">
                          PNG, JPG эсвэл JPEG
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUploadWithAI(e, 5)}
                    />
                  </label>
                )}
              </div>
            </div>
          )}
          {/* Мэдээлэл оруулах хэсэг */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden ">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center text-sm font-semibold">
                  <Image
                    src={Vnemleh.src}
                    alt="Жолооны үнэмлэх"
                    className="w-full h-full object-contain"
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Жолоочийн мэдээлэл
                  </h4>
                  <p className="text-sm text-gray-600">
                    AI автоматаар бөглөх эсвэл гараар оруулна уу
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="driverName"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Жолоочийн овог <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="driverName"
                      placeholder="Жолоочийн овог"
                      className="w-full pl-10 pr-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      value={formValues?.driverName}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        const pattern = /[А-Яа-яЁёӨөҮү\s]/;
                        if (!pattern.test(e.key)) {
                          e.preventDefault();
                          toast.error("Зөвхөн монгол үсгээр бичнэ үү!");
                        }
                      }}
                      required
                      pattern="[А-Яа-яЁёӨөҮү\s]+"
                      title="Зөвхөн монгол үсгээр бичнэ үү"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="driverLastname"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Жолоочийн нэр <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="driverLastname"
                      placeholder="Жолоочийн нэр"
                      className="w-full pl-10 pr-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      value={formValues?.driverLastname}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        const pattern = /[А-Яа-яЁёӨөҮү\s]/;
                        if (!pattern.test(e.key)) {
                          e.preventDefault();
                          toast.error("Зөвхөн монгол үсгээр бичнэ үү!");
                        }
                      }}
                      required
                      pattern="[А-Яа-яЁёӨөҮү\s]+"
                      title="Зөвхөн монгол үсгээр бичнэ үү"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="driverRegNum"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Регистрийн дугаар <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      name="driverRegNum"
                      placeholder="Регистрийн дугаар"
                      className="w-full pl-10 pr-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      value={formValues?.driverRegNum}
                      onChange={(e) => {
                        const value = e.target.value;
                        const firstPart = value
                          .slice(0, 2)
                          .replace(/[^А-Яа-яЁёӨөҮү]/g, "");
                        const secondPart = value
                          .slice(2, 10)
                          .replace(/[^0-9]/g, "");
                        const newValue = firstPart + secondPart;
                        handleChange({
                          ...e,
                          target: {
                            ...e.target,
                            value: newValue,
                            name: "driverRegNum",
                          },
                        });
                      }}
                      onKeyPress={(e) => {
                        const value = formValues?.driverRegNum || "";
                        if (value.length < 2) {
                          const pattern = /[А-Яа-яЁёӨөҮү]/;
                          if (!pattern.test(e.key)) {
                            e.preventDefault();
                            toast.error(
                              "Эхний 2 үсэг нь монгол үсэг байх ёстой!"
                            );
                          }
                        } else if (value.length >= 2 && value.length < 10) {
                          const pattern = /[0-9]/;
                          if (!pattern.test(e.key)) {
                            e.preventDefault();
                            toast.error("Дараагийн 8 орон нь тоо байх ёстой!");
                          }
                        } else {
                          e.preventDefault();
                        }
                      }}
                      required
                      maxLength={10}
                      pattern="[А-Яа-яЁёӨөҮү]{2}[0-9]{8}"
                      title="2 монгол үсэг, 8 оронтой тоо"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="driverRegNum"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Утасны дугаар <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                    </div>

                    <input
                      type="tel"
                      name="driverPhone"
                      placeholder="Утасны дугаар"
                      className="w-full pl-10 pr-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      value={formValues?.driverPhone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        if (value.length <= 8) {
                          handleChange({
                            ...e,
                            target: {
                              ...e.target,
                              value: value,
                              name: "driverPhone",
                            },
                          });
                        }
                      }}
                      required
                      maxLength={8}
                      pattern="[0-9]{8}"
                      title="8 оронтой тоо оруулна уу"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Тээврийн хэрэгслийн гэрчилгээний алхам */}
          <VehicleCertificate
            formValues={formValues}
            setFormValues={setFormValues}
            validationResults={validationResults}
            setValidationResults={setValidationResults}
          />

          <Assessment
            formValues={formValues}
            setFormValues={setFormValues}
            validationResults={validationResults}
            setValidationResults={setValidationResults}
          />
        </div>
      </div>
      {ValidationModal()}
    </>
  );
}
