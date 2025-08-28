import React, { useState } from "react";
import { UploadedFile } from "@/types/police";
import { CompensationModal } from "../ui";
import { ArrowRight, CheckCircle, FileText, XCircle } from "lucide-react";
import Image from "next/image";
import medical from "@/../public/drugs.png";
import { motion } from "framer-motion";

interface TestResultAiProps {
  onFileChange: (files: File[]) => void;
}

interface TestResultAiData {
  isCompensationForm: boolean;
  isPrescriptionForm: boolean;
  fileName: string;
  aiResponse?: string;
}

interface TestResultUploadedFile extends UploadedFile {
  testResultData?: TestResultAiData;
}

const TestResultAi: React.FC<TestResultAiProps> = ({ onFileChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState<TestResultUploadedFile[]>(
    []
  );
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
    const processingFile: TestResultUploadedFile = {
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
                text: `Энэ зургийг харж, дараах асуултуудад хариулна уу:

1. Энэ бол эмнэлгийн шинжилгээний хариу баримт мөн үү? (тийм/үгүй)
2. Энэ бол эмийн жорын маягт мөн үү? (тийм/үгүй)

Хэрэв энэ бол эмийн жорын маягт бол дараах мэдээллийг гаргана уу:
- Өвчтөний нэр, нас, хүйс
- Эмчийн нэр
- Эмнэлгийн нэр
- Жор бичсэн огноо
- Эмийн жагсаалт (нэр, тун, хэрэглэх арга)

Хэрэв энэ бол шинжилгээний хариу баримт бол дараах мэдээллийг гаргана уу:
- Өвчтөний нэр, нас, хүйс
- Эмнэлгийн нэр
- Шинжилгээний төрөл
- Шинжилгээний огноо
- Үр дүн

Зөвхөн монгол хэлээр хариулна уу.`,
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

      // Шинжилгээний хариу баримт эсэхийг шалгах
      const isCompensationForm =
        cleanResponse.includes("шинжилгээ") ||
        cleanResponse.includes("эмнэлгийн") ||
        cleanResponse.includes("лаборатори") ||
        cleanResponse.includes("анализ") ||
        cleanResponse.includes("үр дүн") ||
        cleanResponse.includes("хариу") ||
        cleanResponse.includes("баримт") ||
        cleanResponse.includes("тест");

      // Жорын маягт эсэхийг шалгах
      const isPrescriptionForm =
        cleanResponse.includes("жор") ||
        cleanResponse.includes("эмийн") ||
        cleanResponse.includes("эм") ||
        cleanResponse.includes("таблет") ||
        cleanResponse.includes("сироп") ||
        cleanResponse.includes("инъекц") ||
        cleanResponse.includes("хэрэглэх") ||
        cleanResponse.includes("уух") ||
        cleanResponse.includes("rp:") ||
        cleanResponse.includes("s:");

      // Үр дүнг буцаах
      const result = {
        isCompensationForm,
        isPrescriptionForm,
        fileName: file.name,
        aiResponse: aiResponse,
      };

      // Файлын мэдээллийг шинэчлэх - processing төлөвөөс бодит төлөв рүү
      const updatedFile: TestResultUploadedFile = {
        ...processingFile,
        isProcessing: false,
        validation: {
          isValid: result.isCompensationForm || result.isPrescriptionForm,
          photoType: result.isPrescriptionForm
            ? "Эмийн жорын маягт"
            : result.isCompensationForm
            ? "Шинжилгээний хариу баримт"
            : "Бусад баримт",
          message: result.isPrescriptionForm
            ? "Эмийн жорын маягт амжилттай танигдлаа!"
            : result.isCompensationForm
            ? "Шинжилгээний хариу баримт амжилттай танигдлаа!"
            : "Энэ бол эмнэлгийн баримт биш байна",
        },
        testResultData: result,
      };

      // Файлыг шинэчлэх
      setUploadedFiles((prev) =>
        prev.map((f) => (f === processingFile ? updatedFile : f))
      );

      // Эцэг компонентэд файлыг дамжуулах
      onFileChange([file]);
    } catch (error) {
      // Алдааны үед файлыг шинэчлэх
      const errorFile: TestResultUploadedFile = {
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
        className="flex flex-col gap-4 p-4 bg-white rounded-[20px] "
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

          <div className="flex  gap-1 items-start cursor-pointer pt-4 ">
            <h2 className="text-[14px] font-[600] text-[#585d6b] pl-2  w-[160px]">
              Эмнэлгийн жорын маягт
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
        title="Эмнэлгийн жорын маягт оруулах"
        description="Эмнэлгийн жорын маягтыг оруулж AI-аар шалгах"
        fileLabel="Зураг чирж оруулах эсвэл browse"
        fileDescription="PNG, JPG, JPEG, WEBP, PDF файлууд - Шинжилгээний хариу баримт болон эмийн жорын маягтын зургууд"
        closeButtonText="Хаах"
        confirmButtonText="Болсон"
        showConfirmButton={true}
      />
    </>
  );
};

export default TestResultAi;
