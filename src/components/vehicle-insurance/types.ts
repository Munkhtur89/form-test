// DriverInfo-д ашиглагдах төрөлүүд
import { FormValues } from "@/types/form";

export interface DriverInfoProps {
  formValues: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload?: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "driver" | "accident" | "document"
  ) => void;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

export interface DocumentValidation {
  isValid: boolean;
  documentType: string;
  side?: "front" | "back";
  quality?: "good" | "poor";
  issues?: string[];
  extractedData?: {
    lastName?: string;
    firstName?: string;
    regNumber?: string;
    licenseNumber?: string;
    licenseType?: string;
    certificateNumber?: string;
    validUntil?: string;
  };
  message: string;
}
