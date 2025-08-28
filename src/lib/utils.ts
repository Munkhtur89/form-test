import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// File to base64 conversion function
export const fileToBase64 = (file: File): Promise<string> => {
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

// Health form validation function
export const validateHealthForm = (
  formData: {
    contractId: string;
    phoneNumber: string;
    mail: string;
    hospitalName: string;
    hospitalVisitDate: string;
    claimType: File[];
    paymentReceipt: File[];
    testResult: File[];
    prescriptionForm: File[];
  },
  bankInfo: {
    driverBankId: number;
    driverBankAccount: string;
    driverBankAccountName: string;
    bankAccountLastname: string;
    bankAccountRegnum: string;
  },
  toast: {
    error: (message: string) => void;
  }
): boolean => {
  if (!formData.contractId) {
    toast.error("Гэрээний мэдээлэл олдсонгүй");
    return false;
  }
  if (!formData.phoneNumber) {
    toast.error("Утасны дугаар оруулна уу");
    return false;
  }
  if (!formData.mail) {
    toast.error("Мэйл хаяг оруулна уу");
    return false;
  }
  if (!formData.hospitalName) {
    toast.error("Эмнэлгийн нэр оруулна уу");
    return false;
  }
  if (!formData.hospitalVisitDate) {
    toast.error("Эмнэлэгт үзүүлсэн огноо оруулна уу");
    return false;
  }
  if (formData.claimType.length === 0) {
    toast.error("Нөхөн төлбөрийн маягт оруулна уу");
    return false;
  }
  if (formData.paymentReceipt.length === 0) {
    toast.error("Төлбөрийн баримт оруулна уу");
    return false;
  }
  if (formData.testResult.length === 0) {
    toast.error("Шинжилгээний хариу оруулна уу");
    return false;
  }
  if (formData.prescriptionForm.length === 0) {
    toast.error("Жорын маягт оруулна уу");
    return false;
  }
  if (!bankInfo.driverBankId) {
    toast.error("Банк сонгоно уу");
    return false;
  }
  if (!bankInfo.driverBankAccount) {
    toast.error("Банкны дансны дугаар оруулна уу");
    return false;
  }
  if (!bankInfo.driverBankAccountName) {
    toast.error("Дансны эзэний нэр оруулна уу");
    return false;
  }
  if (!bankInfo.bankAccountLastname) {
    toast.error("Дансны эзэний овог оруулна уу");
    return false;
  }
  if (!bankInfo.bankAccountRegnum) {
    toast.error("Дансны эзэний регистрийн дугаар оруулна уу");
    return false;
  }

  // Check bank account number length (must be exactly 18 digits)
  if (bankInfo.driverBankAccount && bankInfo.driverBankAccount.length !== 18) {
    toast.error("Дансны дугаар 18 оронтой байх ёстой!");
    return false;
  }

  return true;
};
