import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { UploadedFile } from "@/types/police";
import FileUploadGrid from "./FileUploadGrid";

interface CompensationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (index: number) => void;
  onFileChange: (files: File[]) => void;
  error: string;
  title?: string;
  description?: string;
  acceptTypes?: string;
  fileLabel?: string;
  fileDescription?: string;
  closeButtonText?: string;
  confirmButtonText?: string;
  showConfirmButton?: boolean;
}

const CompensationModal: React.FC<CompensationModalProps> = ({
  isOpen,
  onOpenChange,
  uploadedFiles,
  onRemoveFile,
  onFileChange,
  error,
  title = "Файл оруулах",
  acceptTypes = "image/*,.pdf",
  fileLabel = "Зураг чирж оруулах эсвэл browse",
  closeButtonText = "Хаах",
  confirmButtonText = "Болсон",
  showConfirmButton = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      classNames={{
        base: "mx-4",
        wrapper: "items-center justify-center",
        backdrop: "bg-black/50",
      }}
    >
      <ModalContent className="shadow-2xl bg-white rounded-lg">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-black font-bold">
              {title}
            </ModalHeader>
            <ModalBody className="text-black">
              {/* Файл оруулах хэсэг */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center bg-gray-50 mb-6 ">
                <input
                  type="file"
                  multiple
                  accept={acceptTypes}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    onFileChange(files);
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center my-4">
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {fileLabel}
                  </p>
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* Оруулсан файлуудын жагсаалт */}
              <div className="max-w-[800px]">
                <FileUploadGrid
                  uploadedFiles={uploadedFiles}
                  onRemoveFile={onRemoveFile}
                  title="Оруулсан файлууд"
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="solid" onPress={onClose} className="rounded-lg">
                <h1 className="text-black">{closeButtonText}</h1>
              </Button>
              {showConfirmButton && uploadedFiles.length > 0 && (
                <Button color="primary" onPress={onClose}>
                  {confirmButtonText}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CompensationModal;
