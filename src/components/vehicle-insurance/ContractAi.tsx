"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PolicePhotoValidation, UploadedFile } from "@/types/police";

import TrafficPolice from "../aiVehicleCheck/TrafficPolice";
import Procedure from "../aiVehicleCheck/Procedure";
import Emergency from "../aiVehicleCheck/Emergency";
import Court from "../aiVehicleCheck/Court";

import Tsagdaa from "@/../public/logo/tsagdaa_joloo.png";
import Soyombo from "@/../public/logo/tsagdaa.png";
import Ontsgoi from "@/../public/logo/ontsgoi.webp";
import Shuuh from "@/../public/logo/shuuh.png";
import Tsaguur from "@/../public/logo/tsag_uur.png";
import more from "@/../public/logo/more.png";
import Test from "../aiVehicleCheck/test";
import Weather from "../aiVehicleCheck/Weather";

interface ContractProps {
  onImageSelected?: (files: File[]) => void;
  onDataExtracted?: (data: PolicePhotoValidation["extractedData"]) => void;
  multiple?: boolean;
  onAttachmentsUpdate?: (files: { file: File; base64: string }[]) => void;
}

export default function ContractAi({
  onImageSelected,
  onDataExtracted,
  multiple = true,
  onAttachmentsUpdate,
}: ContractProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Зураг оруулсан файлуудыг хадгалах state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Зураг оруулсан үед дуудагдах функц
  const handleImageSelected = async (files: File[]) => {
    if (onImageSelected) {
      onImageSelected(files);
    }

    // Parent form-ийн attachments руу илгээх
    if (onAttachmentsUpdate) {
      try {
        // Файлуудыг base64 болгон хөрвүүлэх
        const filesWithBase64 = await Promise.all(
          files.map(async (file) => {
            const base64 = await convertFileToBase64(file);
            return { file, base64 };
          })
        );

        onAttachmentsUpdate(filesWithBase64);
      } catch (error) {
        console.error("Base64 conversion error:", error);
        // Хэрэв base64 хөрвүүлэхэд алдаа гарвал зөвхөн файл объектуудыг дамжуулна
        const filesWithoutBase64 = files.map((file) => ({ file, base64: "" }));
        onAttachmentsUpdate(filesWithoutBase64);
      }
    }
  };

  // Файлыг base64 болгон хөрвүүлэх функц
  const convertFileToBase64 = (file: File): Promise<string> => {
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

  // Tabbar menu data
  const tabItems = [
    {
      id: 0,
      title: "Замын цагдаа",
      description: (
        <TrafficPolice
          onImageSelected={handleImageSelected}
          onDataExtracted={onDataExtracted}
          multiple={multiple}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      ),
      icon: Tsagdaa,
    },
    {
      id: 1,
      title: "Хэв журам",
      description: (
        <Procedure
          onImageSelected={handleImageSelected}
          onDataExtracted={onDataExtracted}
          multiple={multiple}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      ),
      icon: Soyombo,
    },
    {
      id: 2,
      title: "Онцгой байдал",
      description: (
        <Emergency
          onImageSelected={handleImageSelected}
          onDataExtracted={onDataExtracted}
          multiple={multiple}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      ),
      icon: Ontsgoi,
    },
    {
      id: 3,
      title: "Шүүх",
      description: (
        <Court
          onImageSelected={handleImageSelected}
          onDataExtracted={onDataExtracted}
          multiple={multiple}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      ),
      icon: Shuuh,
    },
    {
      id: 4,
      title: "Цаг уур",
      description: (
        <Weather
          onImageSelected={handleImageSelected}
          onDataExtracted={onDataExtracted}
          multiple={multiple}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      ),
      icon: Tsaguur,
    },
    {
      id: 5,
      title: "Бусад",
      description: (
        <Test
          onImageSelected={handleImageSelected}
          onDataExtracted={onDataExtracted}
          multiple={multiple}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      ),
      icon: more,
    },
  ];

  return (
    <motion.div
      className="border-gray-200 rounded-lg overflow-hidden mb-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tabbar Menu */}
      <div className="bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-100 relative">
          {tabItems.map((tab) => {
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-[14px] font-medium transition-all duration-200 flex items-center justify-center relative ${
                  activeTab === tab.id
                    ? "text-blue-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                whileHover={{
                  scale: 1.02,
                  backgroundColor:
                    activeTab === tab.id
                      ? "rgba(239, 246, 255, 0.8)"
                      : "rgba(249, 250, 251, 0.8)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={tab.icon as unknown as string}
                    alt={tab.title}
                    className="h-10 w-10 mr-2 object-contain"
                  />
                </motion.div>

                {tab.title}

                {/* Active indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    layoutId="activeTab"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-center"
            >
              <motion.h4
                className="text-lg font-semibold text-gray-800 mb-2"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {tabItems[activeTab].title}
              </motion.h4>

              <motion.div
                className="flex items-center justify-center mb-3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Image
                  src={tabItems[activeTab].icon as unknown as string}
                  alt={tabItems[activeTab].title}
                  className="h-10 w-10 text-blue-600"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {tabItems[activeTab].description}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
