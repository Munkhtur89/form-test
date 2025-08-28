import React, { useState } from "react";
import { UploadedFile } from "@/types/police";
import { CompensationModal } from "../ui";
import { ArrowRight, CheckCircle, FileText, XCircle } from "lucide-react";
import Image from "next/image";
import medical from "@/../public/dna-test.png";
import { motion } from "framer-motion";

interface PrescriptionAiProps {
  onFileChange: (files: File[]) => void;
}

interface PrescriptionAiData {
  isCompensationForm: boolean;
  fileName: string;
  aiResponse?: string;
}

interface PrescriptionUploadedFile extends UploadedFile {
  prescriptionData?: PrescriptionAiData;
}

const PrescriptionAi: React.FC<PrescriptionAiProps> = ({ onFileChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    PrescriptionUploadedFile[]
  >([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Modal нээх/хаах функцууд
  const openModal = () => setIsModalOpen(true);

  // Зургийг resize хийх функц
  const resizeImage = (
    file: File,
    maxWidth: number = 1024,
    maxHeight: number = 1024
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img") as HTMLImageElement;

      img.onload = () => {
        // Зургийн хэмжээг тооцоолох
        let { width, height } = img;

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

        // Canvas-ийн хэмжээг тохируулах
        canvas.width = width;
        canvas.height = height;

        // Зургийг canvas дээр зурах
        ctx?.drawImage(img, 0, 0, width, height);

        // Base64 болгон хөрвүүлэх
        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8);
        const base64Data = resizedBase64.split(",")[1];
        resolve(base64Data);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const processCompensationForm = async (file: File) => {
    setError("");

    // Файлыг эхлүүлэх - processing төлөвтэй
    const processingFile: PrescriptionUploadedFile = {
      file: file,
      preview: URL.createObjectURL(file),
      isProcessing: true,
      validation: {
        isValid: false,
        photoType: "Шалгаж байна...",
        message: "",
      },
    };

    setUploadedFiles((prev) => [...prev, processingFile]);

    try {
      // Зургийг resize хийж base64 болгон хөрвүүлэх
      const base64 = await resizeImage(file);

      // Файлын төрлийг тодорхойлох (resize хийсний дараа JPEG болсон)
      const dataUrl = `data:image/jpeg;base64,${base64}`;

      const apiRequestBody = {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Энэ зурагт байгаа эмнэлгийн шинжилгээний хариу баримтыг таних хэрэгтэй. 

Та дараах зүйлсийг хийгээрэй:

1. Энэ бол эмнэлгийн шинжилгээний хариу баримт мөн үү? (Тийм/Үгүй)

2. Хэрэв тийм бол дараах мэдээллийг дэлгэрэнгүй гаргана уу:

   **Ерөнхий мэдээлэл:**
   - Эмнэлгийн нэр
   - Эмнэлгийн хаяг, утас
   - Баримтын дугаар, баркод
   - Хэвлэсэн огноо

   **Өвчтний мэдээлэл:**
   - Өвчтний нэр, нас, хүйс
   - Регистр дугаар
   - Эцэг/эхийн нэр

   **Шинжилгээний мэдээлэл:**
   - Шинжилгээний төрөл (цусны шинжилгээ, биохимийн шинжилгээ, улт авианы шинжилгээ, шээсний шинжилгээ, иммунологийн шинжилгээ, кардиотокографи гэх мэт)
   - Ашигласан анализатор/төхөөрөмж
   - Сорьц авсан огноо, цаг
   - Шинжилгээ хийсэн огноо, цаг
   - Баталгаажуулсан огноо, цаг

   **Шинжилгээний үр дүнгүүд:**
   - Үзүүлэлтүүдийн нэр
   - Хариу утгууд
   - Нэгжүүд
   - Лавлах хэмжээ
   - Хэвийн эсэх, өөрчлөлт байгаа эсэх (↑ өсөлттэй, ↓ бууралттай, H өндөр, L бага)

   **Хариуцсан ажилтнууд:**
   - Сорьц авсан хүн
   - Шинжилгээ хийсэн лаборант
   - Баталгаажуулсан эмч
   - Хүсэлт гаргасан хүн

3. Хэрэв энэ бол эмнэлгийн шинжилгээний хариу биш бол "Энэ бол эмнэлгийн шинжилгээний хариу биш" гэж хариулна уу.

**Чухал:** Зөвхөн монгол хэлээр хариулна уу. Бүх тоон утгууд, нэгжүүд, огноонуудыг яг баримт дээрх шиг бичнэ үү.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 8000,
        temperature: 0.2,
      };

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          headers: {
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(apiRequestBody),
        }
      );

      if (!response.ok) {
        throw new Error("AI-тай холбогдоход алдаа гарлаа");
      }

      const responseData = await response.json();

      // AI-ийн хариуг боловсруулах
      const aiResponse = responseData.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error("AI-ийн хариу хоосон байна");
      }

      // AI-ийн хариуг боловсруулах
      const cleanResponse = aiResponse.toLowerCase().trim();
      const isCompensationForm =
        cleanResponse.includes("тийм") ||
        cleanResponse.includes("шинжилгээ") ||
        cleanResponse.includes("эмнэлгийн") ||
        cleanResponse.includes("лаборатори") ||
        cleanResponse.includes("анализ") ||
        cleanResponse.includes("үр дүн") ||
        cleanResponse.includes("хариу") ||
        cleanResponse.includes("баримт");

      // Үр дүнг буцаах
      const result = {
        isCompensationForm,
        fileName: file.name,
        aiResponse: aiResponse,
      };

      // Файлын мэдээллийг шинэчлэх - processing төлөвөөс бодит төлөв рүү
      const updatedFile: PrescriptionUploadedFile = {
        ...processingFile,
        isProcessing: false,
        validation: {
          isValid: isCompensationForm,
          photoType: isCompensationForm
            ? "Шинжилгээний хариу баримт"
            : "Бусад баримт",
          message: isCompensationForm
            ? "Шинжилгээний хариу баримт амжилттай танигдлаа!"
            : "Энэ бол шинжилгээний хариу баримт биш байна",
        },
        prescriptionData: result,
      };

      // Файлыг шинэчлэх
      setUploadedFiles((prev) =>
        prev.map((f) => (f === processingFile ? updatedFile : f))
      );

      // Эцэг компонентэд файлыг дамжуулах
      onFileChange([file]);
    } catch (error) {
      // Алдааны үед файлыг шинэчлэх
      const errorFile: PrescriptionUploadedFile = {
        ...processingFile,
        isProcessing: false,
        validation: {
          isValid: false,
          photoType: "Алдаа",
          message: error instanceof Error ? error.message : "Алдаа гарлаа",
        },
      };

      setUploadedFiles((prev) =>
        prev.map((f) => (f === processingFile ? errorFile : f))
      );

      setError(error instanceof Error ? error.message : "Алдаа гарлаа");
    }
  };

  const handleFileChange = async (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        await processCompensationForm(file);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Алдаа гарлаа");
      }
    }

    // Эцэг компонентэд файлыг дамжуулах
    onFileChange(files);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      return newFiles;
    });
  };

  return (
    <>
      {/* Modal нээх товч */}
      <div
        className="flex flex-col gap-4 p-4  max-h-[200px]  bg-white rounded-[20px] "
        onClick={openModal}
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-start "
        >
          <div className="flex flex-row  items-center bg-blue-50 rounded-full p-2 w-12 h-12">
            <Image src={medical.src} alt="Up" width={100} height={100} />
          </div>

          <div className="flex  gap-1 items-center cursor-pointer pt-4 ">
            <h2 className="text-[14px] font-[600] text-[#585d6b] pl-2  w-[160px]">
              Шинжилгээний хариу
            </h2>
            <ArrowRight className="w-4 h-4 text-blue-900 ml-2" />
          </div>
        </motion.div>

        {/* Статистик мэдээлэл */}
        {uploadedFiles.length > 0 && (
          <div className="px-4">
            <div className="flex items-center justify-between">
              {/* Нийт файл */}
              <div className="bg-white rounded-lg  text-center flex flex-row gap-1 items-center">
                <div className="text-xs text-gray-600 font-medium">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-[18px] font-bold text-gray-800">
                  {uploadedFiles.length}
                </div>
              </div>

              {/* Амжилттай */}
              <div className="bg-white rounded-lg  text-center flex flex-row gap-1 items-center">
                <div className="text-xs text-green-700 font-medium">
                  <CheckCircle className="w-4 h-4 text-green-700" />
                </div>
                <div className="text-[18px] font-bold text-green-600">
                  {
                    uploadedFiles.filter(
                      (f) => f.validation?.isValid && !f.isProcessing
                    ).length
                  }
                </div>
              </div>

              {/* Алдаатай */}
              <div className="bg-white rounded-lg  text-center flex flex-row gap-1 items-center">
                <div className="text-xs text-red-700 font-medium">
                  <XCircle className="w-4 h-4 text-red-700" />
                </div>

                <div className="text-[18px] font-bold text-red-600">
                  {
                    uploadedFiles.filter(
                      (f) => !f.validation?.isValid && !f.isProcessing
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HeroUI Modal */}
      <CompensationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        uploadedFiles={uploadedFiles}
        onRemoveFile={handleRemoveFile}
        onFileChange={handleFileChange}
        error={error}
        title="Шинжилгээний хариу баримт оруулах"
        description="Шинжилгээний хариу баримтыг оруулж AI-аар шалгах"
        fileLabel="Зураг чирж оруулах эсвэл browse"
        fileDescription="PNG, JPG, JPEG, WEBP, PDF файлууд - Шинжилгээний хариу баримтын зургууд"
        closeButtonText="Хаах"
        confirmButtonText="Болсон"
        showConfirmButton={true}
      />
    </>
  );
};

export default PrescriptionAi;
