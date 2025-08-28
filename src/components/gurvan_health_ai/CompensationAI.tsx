import React, { useState } from "react";
import { UploadedFile } from "@/types/police";
import { CompensationModal } from "../ui";
import Image from "next/image";
import Up from "@/../public/registration-form.png";
import { ArrowRight, CheckCircle, FileText, XCircle } from "lucide-react";
import { motion } from "framer-motion";
interface CompensationFormProps {
  onFileChange: (files: File[]) => void;
}

interface CompensationData {
  isCompensationForm: boolean;
  fileName: string;
  aiResponse?: string;
}

interface CompensationUploadedFile extends UploadedFile {
  id: string;
  compensationData?: CompensationData;
}

const CompensationForm: React.FC<CompensationFormProps> = ({
  onFileChange,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    CompensationUploadedFile[]
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
    const processingFile: CompensationUploadedFile = {
      id: Date.now().toString(),
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
                text: `Энэ зурган дээрх баримт нь Мандал Даатгал компанийн эрүүл мэндийн даатгалын нөхөн төлбөрийн маягт мөн үү? 

      Мандал Даатгал компанийн нөхөн төлбөрийн маягтын онцлог шинж чанарууд:

      **Эхний хуудасны шинж чанарууд:**
      - "HEALTH INSURANCE CLAIMS FORM" эсвэл "Эрүүл мэндийн даатгалын нөхөн төлбөрийн маягт" гэсэн гарчиг
      - "Mandal Daatgal" эсвэл "Мандал Даатгал" гэсэн компанийн нэр
      - "POLICYHOLDER DETAILS" эсвэл "Даатгуулагчийн талаарх мэдээл" хэсэг
      - "PAYMENT DETAILS" эсвэл "Банкны мэдээл" хэсэг
      - Регистрийн дугаар, утасны дугаар, банкны мэдээл зэрэг талбарууд

      **Хоёр дахь хуудасны шинж чанарууд:**
      - "MEDICAL EXPENSES" эсвэл "Эмнэлгийн зардал" хэсэг
      - "TREATMENT DETAILS" эсвэл "Эмчилгээний дэлгэрэнгүй" хэсэг
      - Эмнэлгийн нэр, эмчийн нэр, эмчилгээний огноо зэрэг мэдээл
      - Зардлын дэлгэрэнгүй мэдээл

      **Гурав дахь хуудасны шинж чанарууд:**
      - "DECLARATION" эсвэл "Таньж байна" хэсэг
      - Гарын үсэг, огноо зэрэг

      Энэ зурган дээрх баримт нь дээрх шинж чанаруудтай таарч байна уу? Хэрэв тийм бол "Тийм, энэ нь Мандал Даатгал компанийн эрүүл мэндийн даатгалын нөхөн төлбөрийн маягт мөн" гэж хариулна уу. Хэрэв тийм биш бол "Буруу баримт" гэж хариулна уу.`,
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
        max_tokens: 1000,
      };

      // API дуудалт
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      if (!response.ok) {
        throw new Error("API дуудалт амжилтгүй");
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "";

      // AI хариултыг шалгах
      const isCompensationForm =
        aiResponse.includes("Тийм") || aiResponse.includes("Мандал Даатгал");

      // Файлын мэдээллийг шинэчлэх - processing төлөвөөс бодит төлөв рүү
      const updatedFile: CompensationUploadedFile = {
        ...processingFile,
        isProcessing: false,
        validation: {
          isValid: isCompensationForm,
          photoType: isCompensationForm
            ? "Нөхөн төлбөрийн маягт"
            : "Буруу баримт",
          message: aiResponse,
        },
        compensationData: {
          isCompensationForm,
          fileName: file.name,
          aiResponse,
        },
      };

      // Файлыг шинэчлэх
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === processingFile.id ? updatedFile : f))
      );

      // Эцэг компонентэд файлыг дамжуулах
      onFileChange([file]);
    } catch (error) {
      // Алдааны үед файлыг шинэчлэх
      const errorFile: CompensationUploadedFile = {
        ...processingFile,
        isProcessing: false,
        validation: {
          isValid: false,
          photoType: "Алдаа",
          message: error instanceof Error ? error.message : "Алдаа гарлаа",
        },
      };

      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === processingFile.id ? errorFile : f))
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
        className="flex flex-col gap-4 p-2 bg-white rounded-[20px] [200px]   cursor-pointer py-4 "
        onClick={openModal}
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-start ml-2"
        >
          <div className="flex flex-row gap-1 items-center bg-blue-50 rounded-full p-2 w-12 h-12">
            <Image src={Up.src} alt="Up" width={100} height={100} />
          </div>

          <div className="flex flex-row gap-1 items-center">
            <h2 className="text-[14px] font-[600] text-[#585d6b] pl-2 pt-4 w-[160px]">
              Нөхөн төлбөрийн маягт
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
        title="Нөхөн төлбөрийн маягт оруулах"
        description="Нөхөн төлбөрийн маягтыг оруулж AI-аар шалгах"
        fileLabel="Зураг чирж оруулах эсвэл browse"
        fileDescription="PNG, JPG, JPEG, WEBP, PDF файлууд"
        closeButtonText="Хаах"
        confirmButtonText="Болсон"
        showConfirmButton={true}
      />
    </>
  );
};

export default CompensationForm;
