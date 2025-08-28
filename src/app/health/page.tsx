"use client";

import React, { useEffect, useState, Suspense } from "react";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { MdConfirmationNumber } from "react-icons/md";
import { FiAlertCircle } from "react-icons/fi";

import ervvlM from "../../../public/ervvlmend.json";
import { BsCalendar2DateFill, BsCalendarDate } from "react-icons/bs";
import { PiCashRegisterLight } from "react-icons/pi";
import BankInfo from "@/components/vehicle-insurance/BankInfo";
import { FormValues } from "@/types/form";
import { useRouter, useSearchParams } from "next/navigation";
import AddFile from "@/components/vehicle-insurance/AddFile";
import MedicineTypeSelector from "@/components/health-insurance/MedicineTypeSelector";
import MedicineContent from "@/components/health-insurance/MedicineContent";

// import { Spotlight } from "./components/spotlight";
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});
// File to base64 conversion function
const fileToBase64 = (file: File): Promise<string> => {
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

const initialFormValues: FormValues = {
  accidentPhotos: [],
  driverPhotos: [],
  startDate: "",
  endDate: "",
  plateNumber: "",
  xplateNumber: "",
  contractNumber: "",
  ownerRegister: "",
  serialNumber: "",
  isValid: "",
  registerPart: "",
  contractId: "",
  driverImage: null,
  policeCalled: 0,
  accidentCalled: 0,
  caseDate: "",
  victimPhone: "",
  caseCityId: 11,
  caseDistrictId: 22,
  caseLocation: "",
  caseDescription: "",
  driverName: "",
  driverLastname: "",
  driverRegNum: "",
  driverPhone: "",
  driverBankId: 0,
  driverBankAccount: "",
  driverBankAccountName: "",
  bankAccountLastname: "",
  insuranceContractPhotos: [],
  bankAccountRegnum: "",
  victimName: "",
  victimLastname: "",
  victimRegNum: "",
  inspected: 0,
  insurerAgreement: 0,
  agreementAmount: "",
  attachments: [],
  homeAddress: "",
  homeCityId: 0,
  homeDistrictId: 0,
  phone: "",
  mail: "",
  contractProductName: "",
  invoicedAmount: 0,
  policePhotos: [],
};

export default function MandatoryInsuranceForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MandatoryInsuranceFormContent />
    </Suspense>
  );
}

function MandatoryInsuranceFormContent() {
  const [registerNumber, setRegisterNumber] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("compensation");
  const [formData, setFormData] = useState({
    contractNumber: "",
    startDate: "",
    endDate: "",
    ownerRegister: "",
    branchNumber: "",
    phoneNumber: "",
    hospitalVisitDate: "",
    hospitalName: "",
    description: "",
    claimType: [] as File[],
    paymentReceipt: [] as File[],
    testResult: [] as File[],
    prescriptionForm: [] as File[],
    bankName: "",
    accountHolderLastName: "",
    accountHolderFirstName: "",
    accountHolderRegister: "",
    contractId: "",
    accountHolderBankAccount: "",
    driverBankId: 0,
    driverBankAccount: "",
    driverBankAccountName: "",
    bankAccountLastname: "",
    bankAccountRegnum: "",
    phone: "",
    mail: "",
    invoicedAmount: 0,
    attachments: [] as {
      fileName: string;
      file?: File;
      image_base64?: string;
    }[],
    accidentPhotos: [] as File[],
    driverPhotos: [] as File[],
  });

  const [bankInfo, setBankInfo] = useState<FormValues>(initialFormValues);
  const [isContractLoading, setIsContractLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formBool, setFormBool] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmit();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "hospitalName") {
      // Зөвхөн кирилл үсэг, зай, цэг, таслал зэргийг зөвшөөрөх
      const cyrillicOnly = value.replace(/[^А-ЯӨҮа-яөү\s.,-]/g, "");

      // Хэрэв оруулсан утга нь цэвэр кирилл биш бол сануулга харуулах
      if (value !== cyrillicOnly) {
        toast.error("Зөвхөн кирилл үсэг оруулна уу");
      }

      setFormData((prev) => ({
        ...prev,
        [name]: cyrillicOnly,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRegisterNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value.toUpperCase();

    // Remove any non-alphanumeric characters
    value = value.replace(/[^А-ЯӨҮ0-9]/g, "");

    // If first two characters are letters, keep them
    const firstTwoChars = value.substring(0, 2).replace(/[^А-ЯӨҮ]/g, "");

    // Get remaining characters (numbers only)
    const remainingChars = value.substring(2).replace(/[^0-9]/g, "");

    // Combine and limit to 10 characters
    const formattedValue = (firstTwoChars + remainingChars).substring(0, 10);

    setRegisterNumber(formattedValue);
  };

  const validateRegisterNumber = (register: string) => {
    // Check if register number is 10 characters long
    if (register.length !== 10) {
      toast.error("Регистрийн дугаар 10 оронтой байх ёстой");
      return false;
    }

    // Check if first 2 characters are letters
    const firstTwoChars = register.substring(0, 2);
    if (!/^[А-ЯӨҮ]{2}$/.test(firstTwoChars)) {
      toast.error("Регистрийн дугаарын эхний 2 орон үсэг байх ёстой");
      return false;
    }

    // Check if last 8 characters are numbers
    const lastEightChars = register.substring(2);
    if (!/^\d{8}$/.test(lastEightChars)) {
      toast.error("Регистрийн дугаарын сүүлийн 8 орон тоо байх ёстой");
      return false;
    }

    return true;
  };

  const searchId = async () => {
    if (!registerNumber) {
      toast.error("Регистрийн дугаар оруулна уу");
      return;
    }

    if (!validateRegisterNumber(registerNumber)) {
      return;
    }

    try {
      setIsContractLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/miniapp/contract/search`,
        {
          method: "POST",
          headers: {
            "X-Openerp-Token": process.env.NEXT_PUBLIC_API_TOKEN || "",
          },
          body: JSON.stringify({
            plateNumber: "",
            registerPart: registerNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Хайлт амжилтгүй боллоо");
      }

      const data = await response.json();

      toast.success("Хайлт амжилттай боллоо");
      console.log("Хайлтын үр дүн:", data);
      if (data?.data?.contractId === null) {
        toast.error(
          "Даатгалын мэдээлэл олдсонгүй, та 75752000 утсаар лавлана уу!"
        );
        return;
      }
      // Update form values with the response data
      setFormData((prev) => ({
        ...prev,
        contractId: data.data.contractId || "",
        contractNumber: data.data.insurName || "",
        ownerRegister: data.data.registerPart || "",
        startDate: data.data.startDate || "",
        endDate: data.data.endDate || "",
      }));
    } catch (err) {
      console.error("Хайлтын алдаа:", err);
    } finally {
      setIsContractLoading(false);
    }
  };
  const handleChangeBank = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      const radioValue = value === "yes" ? 1 : 0;
      setBankInfo((prev) => ({
        ...prev,
        [name]: radioValue,
      }));
    } else {
      setBankInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  // claim search
  useEffect(() => {
    const searchClaim = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/miniapp/claim/search?token=${token}`,
          {
            method: "POST",
            headers: {
              "X-Openerp-Token": process.env.NEXT_PUBLIC_API_TOKEN || "",
            },
            body: JSON.stringify({
              token: token,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Хайлт амжилтгүй боллоо");
        }

        const data = await response.json();
        console.log("Хайлтын үр дүн:", data);
        // setClaimId(data?.data?.claimId);
        setFormBool(data?.data?.form);
      } catch (err) {
        console.error("Хайлтын алдаа:", err);
      }
    };

    if (token) {
      searchClaim();
    }
  }, [token]); // Added token as a dependency

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

  const handleFormUpdate2 = async () => {
    try {
      // Файл байгаа эсэхийг шалгах
      if (formData.attachments.length === 0) {
        toast.error("Зураг хавсаргана уу!");
        return;
      }

      setIsUpdateLoading(true);

      // API руу илгээх
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/miniapp/claim/update2`,
        {
          method: "POST",
          headers: {
            "X-Openerp-Token": process.env.NEXT_PUBLIC_API_TOKEN || "",
          },
          body: JSON.stringify({
            token: token,
            attachments: formData.attachments.map((attachment) => ({
              fileName: attachment.fileName,
              image_base64: attachment.image_base64,
            })),
          }),
        }
      );

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.message || "Алдаа гарлаа");
      }

      toast.success("Амжилттай шинэчлэгдлээ");
      router.push("/");
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error(error instanceof Error ? error.message : "Алдаа гарлаа");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "driver" | "accident" | "document"
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      const newAttachments = await Promise.all(
        files.map(async (file) => ({
          fileName: file.name,
          image_base64: await convertToBase64(file),
          file: file,
        }))
      );
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
        ...(type === "accident" && {
          accidentPhotos: [...prev.accidentPhotos, ...files],
        }),
        ...(type === "driver" && {
          driverPhotos: [...prev.driverPhotos, ...files],
        }),
      }));
    }
  };

  const pushFilesToAttachments = async (
    files: File[],
    fileCategory: number
  ) => {
    const arr = [];
    for (const file of files) {
      const base64Data = await fileToBase64(file);
      arr.push({
        fileCategory,
        image_base64: base64Data,
      });
    }
    return arr;
  };

  // PDF үүсгэх функц
  const generatePDF = async () => {
    try {
      // Файлуудыг base64 болгон хөрвүүлэх
      const claimTypeBase64 = await Promise.all(
        (formData.claimType || []).map(async (file: File) => ({
          fileName: file.name || "Нөхөн төлбөрийн маягт",
          category: "Нөхөн төлбөрийн маягт",
          image_base64: await convertToBase64(file),
        }))
      );

      const paymentReceiptBase64 = await Promise.all(
        (formData.paymentReceipt || []).map(async (file: File) => ({
          fileName: file.name || "Төлбөрийн баримт",
          category: "Төлбөрийн баримт",
          image_base64: await convertToBase64(file),
        }))
      );

      const testResultBase64 = await Promise.all(
        (formData.testResult || []).map(async (file: File) => ({
          fileName: file.name || "Шинжилгээний хариу",
          category: "Шинжилгээний хариу",
          image_base64: await convertToBase64(file),
        }))
      );

      const prescriptionFormBase64 = await Promise.all(
        (formData.prescriptionForm || []).map(async (file: File) => ({
          fileName: file.name || "Жорын маягт",
          category: "Жорын маягт",
          image_base64: await convertToBase64(file),
        }))
      );

      // Формын өгөгдлийг PDF-д зориулж бэлтгэх
      const pdfData2 = {
        contractInfo: {
          contractNumber: formData.contractNumber || "Байхгүй",
          startDate: formData.startDate || "Байхгүй",
          endDate: formData.endDate || "Байхгүй",
          ownerRegister: formData.ownerRegister || "Байхгүй",
          branchNumber: formData.branchNumber || "Байхгүй",
        },
        materialInfo: {
          phoneNumber: formData.phoneNumber || "Байхгүй",
          mail: formData.mail || "Байхгүй",
          hospitalName: formData.hospitalName || "Байхгүй",
          hospitalVisitDate: formData.hospitalVisitDate || "Байхгүй",
          invoicedAmount: formData.invoicedAmount || 0,
        },
        bankInfo: {
          driverBankId: bankInfo.driverBankId || 0,
          driverBankAccount: bankInfo.driverBankAccount || "Байхгүй",
          driverBankAccountName: bankInfo.driverBankAccountName || "Байхгүй",
          bankAccountLastname: bankInfo.bankAccountLastname || "Байхгүй",
          bankAccountRegnum: bankInfo.bankAccountRegnum || "Байхгүй",
        },
        // Бүх attachments датааг нэмэх
        attachments: [
          ...claimTypeBase64,
          ...paymentReceiptBase64,
          ...testResultBase64,
          ...prescriptionFormBase64,
          ...(await Promise.all(
            (formData.attachments || []).map(async (attachment) => ({
              fileName: attachment.fileName || "Хавсралт",
              category: "Хавсралт",
              image_base64: attachment.file
                ? await convertToBase64(attachment.file)
                : attachment.image_base64 || null,
            }))
          )),
        ],
      };

      const response = await fetch("/api/health-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfData2),
      });

      if (!response.ok) {
        throw new Error("PDF үүсгэхэд алдаа гарлаа");
      }

      // PDF файлыг blob болгон авах
      const pdfBlob = await response.blob();
      const url = window.URL.createObjectURL(pdfBlob);

      // PDF файлыг татах
      const link = document.createElement("a");
      link.href = url;
      link.download = "jargalan-eruul-mendiin-daatgal.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF файл амжилттай үүсгэгдлээ!");
    } catch (error) {
      console.error("PDF үүсгэхэд алдаа:", error);
      toast.error("PDF үүсгэхэд алдаа гарлаа");
    }
  };

  // ... existing code ...

  const handleFormSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.contractId) {
        toast.error("Гэрээний мэдээлэл олдсонгүй");
        return;
      }
      if (!formData.phoneNumber) {
        toast.error("Утасны дугаар оруулна уу");
        return;
      }
      if (!formData.mail) {
        toast.error("Мэйл хаяг оруулна уу");
        return;
      }
      if (!formData.hospitalName) {
        toast.error("Эмнэлгийн нэр оруулна уу");
        return;
      }
      if (!formData.hospitalVisitDate) {
        toast.error("Эмнэлэгт үзүүлсэн огноо оруулна уу");
        return;
      }
      if (formData.claimType.length === 0) {
        toast.error("Нөхөн төлбөрийн маягт оруулна уу");
        return;
      }
      if (formData.paymentReceipt.length === 0) {
        toast.error("Төлбөрийн баримт оруулна уу");
        return;
      }
      if (formData.testResult.length === 0) {
        toast.error("Шинжилгээний хариу оруулна уу");
        return;
      }
      if (formData.prescriptionForm.length === 0) {
        toast.error("Жорын маягт оруулна уу");
        return;
      }
      if (!bankInfo.driverBankId) {
        toast.error("Банк сонгоно уу");
        return;
      }
      if (!bankInfo.driverBankAccount) {
        toast.error("Банкны дансны дугаар оруулна уу");
        return;
      }
      if (!bankInfo.driverBankAccountName) {
        toast.error("Дансны эзэний нэр оруулна уу");
        return;
      }
      if (!bankInfo.bankAccountLastname) {
        toast.error("Дансны эзэний овог оруулна уу");
        return;
      }
      if (!bankInfo.bankAccountRegnum) {
        toast.error("Дансны эзэний регистрийн дугаар оруулна уу");
        return;
      }

      // Check bank account number length (must be exactly 18 digits)
      if (
        bankInfo.driverBankAccount &&
        bankInfo.driverBankAccount.length !== 18
      ) {
        toast.error("Дансны дугаар 18 оронтой байх ёстой!");
        return;
      }

      // setIsLoading(true);

      console.log("Form submission started...");

      // generatePDF функцийн дататай ижилхэн PDF data үүсгэх
      const claimTypeBase64 = await Promise.all(
        (formData.claimType || []).map(async (file: File) => ({
          fileName: file.name || "Нөхөн төлбөрийн маягт",
          category: "Нөхөн төлбөрийн маягт",
          image_base64: await convertToBase64(file),
        }))
      );

      const paymentReceiptBase64 = await Promise.all(
        (formData.paymentReceipt || []).map(async (file: File) => ({
          fileName: file.name || "Төлбөрийн баримт",
          category: "Төлбөрийн баримт",
          image_base64: await convertToBase64(file),
        }))
      );

      const testResultBase64 = await Promise.all(
        (formData.testResult || []).map(async (file: File) => ({
          fileName: file.name || "Шинжилгээний хариу",
          category: "Шинжилгээний хариу",
          image_base64: await convertToBase64(file),
        }))
      );

      const prescriptionFormBase64 = await Promise.all(
        (formData.prescriptionForm || []).map(async (file: File) => ({
          fileName: file.name || "Жорын маягт",
          category: "Жорын маягт",
          image_base64: await convertToBase64(file),
        }))
      );
      // PDF үүсгэх функц

      // PDF үүсгэх функц
      const pdfData = {
        contractInfo: {
          contractNumber: formData.contractNumber || "Байхгүй",
          startDate: formData.startDate || "Байхгүй",
          endDate: formData.endDate || "Байхгүй",
          ownerRegister: formData.ownerRegister || "Байхгүй",
          branchNumber: formData.branchNumber || "Байхгүй",
        },
        materialInfo: {
          phoneNumber: formData.phoneNumber || "Байхгүй",
          mail: formData.mail || "Байхгүй",
          hospitalName: formData.hospitalName || "Байхгүй",
          hospitalVisitDate: formData.hospitalVisitDate || "Байхгүй",
          invoicedAmount: formData.invoicedAmount || 0,
        },
        bankInfo: {
          driverBankId: bankInfo.driverBankId || 0,
          driverBankAccount: bankInfo.driverBankAccount || "Байхгүй",
          driverBankAccountName: bankInfo.driverBankAccountName || "Байхгүй",
          bankAccountLastname: bankInfo.bankAccountLastname || "Байхгүй",
          bankAccountRegnum: bankInfo.bankAccountRegnum || "Байхгүй",
        },
        // Бүх attachments датааг нэмэх
        attachments: [
          ...claimTypeBase64,
          ...paymentReceiptBase64,
          ...testResultBase64,
          ...prescriptionFormBase64,
          ...(await Promise.all(
            (formData.attachments || []).map(async (attachment) => ({
              fileName: attachment.fileName || "Хавсралт",
              category: "Хавсралт",
              image_base64: attachment.file
                ? await convertToBase64(attachment.file)
                : attachment.image_base64 || null,
            }))
          )),
        ],
      };

      // ... existing code ...

      // ... existing code ...

      console.log("PDF data prepared, calling generatePDF...");

      // generatePDF функцийг ашиглан PDF үүсгэх
      const pdfResponse = await fetch("/api/health-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfData),
      });

      if (!pdfResponse.ok) {
        throw new Error("PDF үүсгэхэд алдаа гарлаа");
      }

      console.log("PDF generated successfully");

      // PDF файлыг blob болгон авах
      const pdfBlob = await pdfResponse.blob();

      // PDF файлыг base64 болгох
      let pdfBase64: string;
      try {
        pdfBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result && typeof reader.result === "string") {
              const base64 = reader.result.split(",")[1];
              if (base64) {
                resolve(base64);
              } else {
                reject(new Error("Base64 хөрвүүлэлт амжилтгүй"));
              }
            } else {
              reject(new Error("FileReader үр дүн хоосон"));
            }
          };
          reader.onerror = () => reject(new Error("FileReader алдаа"));
          reader.readAsDataURL(pdfBlob);
        });
        console.log("PDF converted to base64 successfully");
      } catch (error) {
        console.error("PDF base64 conversion error:", error);
        throw new Error("PDF-г base64 болгон хөрвүүлэхэд алдаа гарлаа");
      }

      const attachments = [
        ...(await pushFilesToAttachments(formData.claimType, 506)),
        ...(await pushFilesToAttachments(formData.paymentReceipt, 507)),
        ...(await pushFilesToAttachments(formData.testResult, 509)),
        ...(await pushFilesToAttachments(formData.prescriptionForm, 510)),
        // PDF файлыг attachments руу нэмэх
        {
          fileCategory: 511, // PDF-д зориулсан category
          image_base64: pdfBase64,
        },
      ];

      console.log("Attachments prepared, sending to API...");
      console.log(
        "PDF base64 length:",
        pdfBase64 ? pdfBase64.length : "undefined"
      );

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/miniapp/claim/create`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "X-Openerp-Token": process.env.NEXT_PUBLIC_API_TOKEN || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractId: formData.contractId,
          caseDate: formData.hospitalVisitDate,
          caseDescription: formData.hospitalName,

          driverBankId: bankInfo.driverBankId,
          driverBankAccount: bankInfo.driverBankAccount,
          driverBankAccountName: bankInfo.driverBankAccountName,
          bankAccountLastname: bankInfo.bankAccountLastname,
          bankAccountRegnum: bankInfo.bankAccountRegnum,
          // Empty values for other fields
          invoicedAmount: formData.invoicedAmount,
          phone: formData.phoneNumber,
          email: formData.mail,
          policeCalled: "",
          accidentCalled: "",
          caseCityId: "",
          caseDistrictId: "",
          caseLocation: "",
          driverName: "",
          driverLastname: "",
          driverRegNum: "",
          driverPhone: "",
          victimName: "",
          victimLastname: "",
          victimRegNum: "",
          inspected: "",
          insurerAgreement: "",
          agreementAmount: "",
          attachments: attachments,
        }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API алдаа: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API response data:", data);

      if (data.status === "error") {
        throw new Error(data.message || "Алдаа гарлаа");
      }

      console.log("Хэрэглэгч үүслээ:", data);
      toast.success("Амжилттай илгээгдлээ");
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "Алдаа гарлаа");
    } finally {
      // setIsLoading(false);
    }
  };

  // ... existing code ...

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white py-6 px-2 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto ">
        {formBool === false ? (
          <div className="bg-gray-100 w-full p-4 sm:p-8 rounded-lg sm:rounded-3xl">
            <h2 className="text-[14px] sm:text-[16px] font-bold text-center text-[#142a68] mb-6 sm:mb-10 w-full sm:w-[50%] mx-auto">
              ЖАРГАЛАН ЭРҮҮЛ МЭНДИЙН ДААТГАЛЫН ДААТГУУЛАГЧИЙН НӨХӨН ТӨЛБӨРИЙН
              МЭДҮҮЛЭГ
            </h2>

            {/* PDF татах товч */}
            <div className="flex justify-end mb-4">
              <button
                onClick={generatePDF}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                📄 PDF Татах
              </button>
            </div>

            <div className="bg-blue-100/60 p-3 sm:p-4 rounded-xl mb-6 sm:mb-8 items-center gap-2 sm:gap-4 border border-blue-200 w-full max-w-3xl mx-auto">
              <p className="text-sm sm:text-base text-blue-700 font-semibold pb-2 sm:pb-4">
                РЕГИСТРИЙН ДУГААР ОРУУЛНА УУ
              </p>
              <div className="flex-1 flex gap-2 justify-center">
                <input
                  id="registerNumber"
                  name="registerNumber"
                  type="text"
                  placeholder="АА00000000"
                  value={registerNumber}
                  onChange={handleRegisterNumberChange}
                  maxLength={10}
                  className="flex-1 rounded-lg border border-blue-300 shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 sm:px-4 py-2 text-base sm:text-lg text-gray-900 bg-white uppercase"
                />
                <button
                  onClick={searchId}
                  disabled={isContractLoading}
                  className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-400 text-white px-4 sm:px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isContractLoading ? (
                    "Хайж байна..."
                  ) : (
                    <h1 className="text-white text-xl">Хайх</h1>
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* id card */}

              {formData.contractId && (
                <div className="w-full max-w-3xl mx-auto rounded-2xl bg-white overflow-hidden mb-6 sm:mb-8 border border-blue-200">
                  <div className="h-16 sm:h-20 w-full bg-blue-50 via-blue-300 to-purple-300 relative">
                    <Lottie
                      animationData={ervvlM}
                      loop={false}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="items-center justify-between px-3 sm:px-4 mt-2 pb-2">
                    <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <MdConfirmationNumber
                          size={18}
                          className="sm:w-[20px] sm:h-[20px]"
                          color="blue"
                        />
                        <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                          Гэрээний дугаар:
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                        {formData?.contractNumber}
                      </span>
                    </div>
                    <hr className="mx-3 sm:mx-4" />
                    <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <BsCalendar2DateFill
                          size={16}
                          className="sm:w-[18px] sm:h-[18px]"
                          color="blue"
                        />
                        <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                          Эхлэх огноо:
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                        {formData?.startDate}
                      </span>
                    </div>
                    <hr className="mx-3 sm:mx-4" />
                    <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <BsCalendarDate
                          size={16}
                          className="sm:w-[18px] sm:h-[18px]"
                          color="blue"
                        />
                        <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                          Дуусах огноо:
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                        {formData?.endDate}
                      </span>
                    </div>
                    <hr className="mx-3 sm:mx-4" />
                    <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <PiCashRegisterLight
                          size={18}
                          className="sm:w-[20px] sm:h-[20px]"
                          color="blue"
                        />
                        <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                          Регистрын дугаар:
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                        {formData?.ownerRegister}
                      </span>
                    </div>
                    <hr className="mx-3 sm:mx-4" />
                    <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <FiAlertCircle
                          size={18}
                          className="sm:w-[20px] sm:h-[20px]"
                          color="blue"
                        />
                        <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                          Саб дугаар:
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium text-sm sm:text-base font-sans">
                        {formData?.branchNumber}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className=" pb-6 mb-8">
                <h2 className="text-[16px] font-bold text-center text-[#142a68] mb-10 mt-10 ">
                  МАТЕРИАЛ БҮРДҮҮЛЭЛТИЙН МЭДЭЭЛЭЛ
                </h2>

                <div>
                  <div className="bg-white mb-6 p-6 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 ">
                    <div className="flex flex-col gap-1">
                      <label
                        className="block text-sm font-bold text-[#142a68] mb-1 sm:mb-2"
                        htmlFor="phoneNumber"
                      >
                        Таны утасны дугаар
                      </label>
                      <div className="relative group">
                        <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                        <input
                          id="phoneNumber"
                          type="tel"
                          name="phoneNumber"
                          placeholder="00000000"
                          value={formData.phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/[^0-9]/.test(value)) {
                              toast.error("Зөвхөн тоо оруулна уу");
                              return;
                            }
                            setFormData((prev) => ({
                              ...prev,
                              phoneNumber: value,
                            }));
                          }}
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={8}
                          className="w-full pl-6 pr-4 py-2.5 sm:py-3.5 text-[14px] sm:text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        className="block text-sm font-bold text-[#142a68] mb-2"
                        htmlFor="hospitalName"
                      >
                        Таны мэйл хаяг
                      </label>
                      <div className="relative group">
                        <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                        <input
                          id="mail"
                          placeholder="example@gmail.com"
                          type="text"
                          name="mail"
                          value={formData.mail}
                          onChange={handleChange}
                          className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        className="block text-sm font-bold text-[#142a68] mb-2"
                        htmlFor="hospitalName"
                      >
                        Үйлчилгээ авсан эмнэлгийн нэр
                      </label>
                      <div className="relative group">
                        <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                        <input
                          id="hospitalName"
                          placeholder="Эмнэлгийн нэр"
                          type="text"
                          name="hospitalName"
                          value={formData.hospitalName}
                          onChange={handleChange}
                          className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        className="block text-sm font-bold text-[#142a68] mb-2"
                        htmlFor="hospitalVisitDate"
                      >
                        Эмнэлэгт үзүүлсэн огноо
                      </label>
                      <div className="relative group">
                        <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                        <input
                          id="hospitalVisitDate"
                          type="datetime-local"
                          name="hospitalVisitDate"
                          value={formData.hospitalVisitDate}
                          onChange={handleChange}
                          className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        className="block text-sm font-bold text-[#142a68] mb-2"
                        htmlFor="invoicedAmount"
                      >
                        Нэхэмжлэх дүн
                      </label>
                      <div className="relative group">
                        <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                        <input
                          id="invoicedAmount"
                          placeholder="00000"
                          type="text"
                          name="invoicedAmount"
                          value={
                            formData.invoicedAmount
                              ? formData.invoicedAmount.toLocaleString("mn-MN")
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, "");
                            setFormData((prev) => ({
                              ...prev,
                              invoicedAmount: value ? parseInt(value) : 0,
                            }));
                          }}
                          className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-1">
                    {/* <label
                    className="block text-sm font-bold text-[#142a68] mb-2"
                    htmlFor="description"
                  >
                    Дэлгэрэнгүй тайлбар
                  </label>
                  <div className="relative group">
                    <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                    <textarea
                      id="description"
                      placeholder="Дэлгэрэнгүй тайлбар"
                      name="description"
                      value={formData.description}
                      onChange={handleTextAreaChange}
                      className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300 min-h-[80px]"
                    />
                  </div> */}
                  </div>

                  {/* Эмлэгээ сонгох tabbar */}
                  <MedicineTypeSelector
                    selectedComponent={selectedComponent}
                    onSelectComponent={setSelectedComponent}
                  />

                  {/* Эмлэгээний компонентууд */}
                  <MedicineContent
                    selectedComponent={selectedComponent}
                    onFileChange={(field, files) => {
                      setFormData((prev) => ({
                        ...prev,
                        [field]: files,
                      }));
                    }}
                  />
                </div>
                <div className="mt-10">
                  <BankInfo
                    formValues={bankInfo}
                    handleChange={handleChangeBank}
                    setFormValues={setBankInfo}
                  />
                </div>
              </div>

              {/*  <div className="flex justify-center mt-6 sm:mt-8 w-full ">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 cursor-pointer to-blue-400 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 font-bold text-base sm:text-lg transition-all duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Илгээж байна..." : "Илгээх"}
                </button>
              </div> */}
            </form>
          </div>
        ) : (
          <div>
            <AddFile handleFileUpload={handleFileUpload} />
            <div>
              <button
                onClick={handleFormUpdate2}
                disabled={isUpdateLoading}
                className="w-full cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg mt-4
              border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
              active:border-b-[2px] active:brightness-90 active:translate-y-[2px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdateLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isUpdateLoading ? "Илгээж байна..." : "Илгээж байна..."}
                  </div>
                ) : (
                  "Илгээх"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
