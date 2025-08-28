import React from "react";
import ImageUploader from "../ImageUploader";
import CompensationAI from "../gurvan_health_ai/CompensationAI";
import PaymentReceiptAi from "../gurvan_health_ai/PaymentReceiptAi";
import TestResultAi from "../gurvan_health_ai/TestResultAi";
import PrescriptionAi from "../gurvan_health_ai/PrescriptionAi";

interface MedicineContentProps {
  selectedComponent: string;
  onFileChange: (field: string, files: File[]) => void;
}

const MedicineContent: React.FC<MedicineContentProps> = ({
  selectedComponent,
  onFileChange,
}) => {
  const handleFileChange = (field: string, files: File[]) => {
    onFileChange(field, files);
  };

  const renderContent = () => {
    switch (selectedComponent) {
      case "compensation":
        return (
          <div className="md:col-span-2">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <h3 className="text-blue-800 font-semibold mb-2">
                Бусад эмлэгээ
              </h3>
              <p className="text-blue-700 text-sm">
                Ердийн эмлэгээний маягтуудыг оруулна уу
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <ImageUploader
                  label="Нөхөн төлбөрийн маягт"
                  onFileChange={(files) => handleFileChange("claimType", files)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <ImageUploader
                  label="Төлбөрийн баримт"
                  onFileChange={(files) =>
                    handleFileChange("paymentReceipt", files)
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <ImageUploader
                  label="Шинжилгээний хариу"
                  onFileChange={(files) =>
                    handleFileChange("testResult", files)
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <ImageUploader
                  label="Жорын маягт"
                  onFileChange={(files) =>
                    handleFileChange("prescriptionForm", files)
                  }
                />
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="md:col-span-2">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
              <h3 className="text-green-800 font-semibold mb-2">
                Гурван гал эмлэг
              </h3>
              <p className="text-green-700 text-sm">
                Энэ эмлэгээнд зориулсан тусгай маягтуудыг оруулна уу
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CompensationAI
                onFileChange={(files) => handleFileChange("claimType", files)}
              />

              <PaymentReceiptAi
                onFileChange={(files) =>
                  handleFileChange("paymentReceipt", files)
                }
              />

              <TestResultAi
                onFileChange={(files) => handleFileChange("testResult", files)}
              />

              <PrescriptionAi
                onFileChange={(files) =>
                  handleFileChange("prescriptionForm", files)
                }
              />
            </div>
          </div>
        );

      case "test":
        return (
          <div className="md:col-span-2">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
              <h3 className="text-purple-800 font-semibold mb-2">
                Интермед эмлэгээ
              </h3>
              <p className="text-purple-700 text-sm">
                Энэ эмлэгээнд зориулсан тусгай маягтуудыг оруулна уу
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CompensationAI
                onFileChange={(files) =>
                  handleFileChange("claimType-intermed", files)
                }
              />

              <PaymentReceiptAi
                onFileChange={(files) =>
                  handleFileChange("paymentReceipt-intermed", files)
                }
              />

              <TestResultAi
                onFileChange={(files) =>
                  handleFileChange("testResult-intermed", files)
                }
              />

              <PrescriptionAi
                onFileChange={(files) =>
                  handleFileChange("prescriptionForm-intermed", files)
                }
              />
            </div>
          </div>
        );

      case "prescription":
        return (
          <div className="md:col-span-2">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
              <h3 className="text-orange-800 font-semibold mb-2">
                Соногодо эмлэгээ
              </h3>
              <p className="text-orange-700 text-sm">
                Энэ эмлэгээнд зориулсан тусгай маягтуудыг оруулна уу
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CompensationAI
                onFileChange={(files) =>
                  handleFileChange("claimType-songdo", files)
                }
              />

              <PaymentReceiptAi
                onFileChange={(files) =>
                  handleFileChange("paymentReceipt-songdo", files)
                }
              />

              <TestResultAi
                onFileChange={(files) =>
                  handleFileChange("testResult-songdo", files)
                }
              />

              <PrescriptionAi
                onFileChange={(files) =>
                  handleFileChange("prescriptionForm", files)
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
};

export default MedicineContent;
