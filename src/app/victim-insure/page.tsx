"use client";

import React, { useState, useEffect, Suspense } from "react";
import {  useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import ContractInfo from "@/components/vehicle-insurance/ContractInfo";
import DriverInfo from "@/components/vehicle-insurance/DriverInfo";
import AccidentInfo from "@/components/vehicle-insurance/AccidentInfo";
import BankInfo from "@/components/vehicle-insurance/BankInfo";
import FileUpload from "@/components/vehicle-insurance/FileUpload";
// import HomeAddress from "@/components/vehicle-insurance/HomeAddress";
import { FormValues } from "@/types/form";
import VictimSearch from "@/components/vehicle-insurance/Victim-search";
import AddFile from "@/components/vehicle-insurance/AddFile";
import VictimInfo from "@/components/victim-info/VictimInfo";
import { initialFormValues } from "@/lib/constants";
// import ChatGPTWidget from "@/components/ChatGPTWidget";

function VehicleInsuranceFormContent() {
  // PDF үүсгэх функц
  const generatePDF = async () => {
    try {
      // Формын өгөгдлийг PDF-д зориулж бэлтгэх
      const pdfData = {
        contractInfo: {
          contractNumber: formValues.contractNumber || "Байхгүй",
          startDate: formValues.startDate || "Байхгүй",
          endDate: formValues.endDate || "Байхгүй",
          ownerRegister: formValues.ownerRegister || "Байхгүй",
          serialNumber: formValues.serialNumber || "Байхгүй",
          contractProductName: formValues.contractProductName || "Байхгүй",
        },
        vehicleInfo: {
          brand: formValues.contractProductName || "Байхгүй",
          model: formValues.serialNumber || "Байхгүй",
          plateNumber: formValues.plateNumber || "Байхгүй",
        },
        driverInfo: {
          name:
            `${formValues.driverName || ""} ${
              formValues.driverLastname || ""
            }`.trim() || "Байхгүй",
          registrationNumber: formValues.driverRegNum || "Байхгүй",
          phone: formValues.driverPhone || "Байхгүй",
        },
        accidentInfo: {
          date: formValues.caseDate || "Байхгүй",
          location: formValues.caseLocation || "Байхгүй",
          description: formValues.caseDescription || "Байхгүй",
        },
        bankInfo: {
          bankName: formValues.driverBankAccountName
            ? `Банк ID: ${formValues.driverBankId}`
            : "Байхгүй",
          accountNumber: formValues.driverBankAccount || "Байхгүй",
          bankRegNum: formValues.bankAccountRegnum || "Байхгүй",
          bankLastname: formValues.bankAccountLastname || "Байхгүй",
        },
        victimInfo: {
          name:
            `${formValues.victimName || ""} ${
              formValues.victimLastname || ""
            }`.trim() || "Байхгүй",
          registrationNumber: formValues.victimRegNum || "Байхгүй",
          xplateNumber: formValues.xplateNumber || "Байхгүй",
          phone: formValues.victimPhone || "Байхгүй",
        },
        // Бүх attachments датааг нэмэх
        attachments: [
          ...(formValues.accidentPhotos || []).map((photo: File) => ({
            name: photo.name || "Ослын зураг",
            type: photo.type || "image",
            size: photo.size || "Байхгүй",
            url: URL.createObjectURL(photo),
            category: "Ослын зураг",
          })),
          ...(formValues.driverPhotos || [])
            .map(
              (photo: File | null) =>
                photo && {
                  name: photo.name || "Жолоочийн зураг",
                  type: photo.type || "image",
                  size: photo.size || "Байхгүй",
                  url: URL.createObjectURL(photo),
                  category: "Жолоочийн зураг",
                }
            )
            .filter(Boolean),
          ...(formValues.attachments || []).map(
            (attachment: {
              fileName: string;
              file: File | null;
              image_base64: string;
            }) => {
              // Файлын нэрээс ангилал тодорхойлох
              let category = "Хавсралт";
              const fileName = attachment.fileName.toLowerCase();

              if (
                fileName.includes("үнэмлэх") ||
                fileName.includes("license")
              ) {
                if (fileName.includes("урд") || fileName.includes("front")) {
                  category = "Жолооны үнэмлэх (урд тал)";
                } else if (
                  fileName.includes("ард") ||
                  fileName.includes("back")
                ) {
                  category = "Жолооны үнэмлэх (ард тал)";
                } else {
                  category = "Жолооны үнэмлэх";
                }
              } else if (
                fileName.includes("лавлагаа") ||
                fileName.includes("reference")
              ) {
                category = "Жолоочийн лавлагаа";
              } else if (
                fileName.includes("мэдээлэл") ||
                fileName.includes("info")
              ) {
                category = "Жолоочийн мэдээлэл";
              } else if (fileName.includes("акт") || fileName.includes("act")) {
                category = "Ослын акт";
              } else if (
                fileName.includes("зураг") ||
                fileName.includes("photo") ||
                fileName.includes("image")
              ) {
                category = "Зураг";
              } else if (
                fileName.includes("баримт") ||
                fileName.includes("document")
              ) {
                category = "Баримт";
              }

              return {
                name: attachment.fileName || "Хавсралт",
                type: attachment.file?.type || "file",
                size: attachment.file?.size || "Байхгүй",
                url:
                  attachment.image_base64 ||
                  (attachment.file ? URL.createObjectURL(attachment.file) : ""),
                category: category,
              };
            }
          ),
        ],
        // Нэмэлт мэдээлэл
        additionalInfo: {
          phone: formValues.phone || "Байхгүй",
          mail: formValues.mail || "Байхгүй",
          homeAddress: formValues.homeAddress || "Байхгүй",
          caseCityId: formValues.caseCityId || "Байхгүй",
          caseDistrictId: formValues.caseDistrictId || "Байхгүй",
          policeCalled: formValues.policeCalled ? "Тийм" : "Үгүй",
          accidentCalled: formValues.accidentCalled ? "Тийм" : "Үгүй",
          inspected: formValues.inspected ? "Тийм" : "Үгүй",
          insurerAgreement: formValues.insurerAgreement ? "Тийм" : "Үгүй",
          agreementAmount: formValues.agreementAmount || "Байхгүй",
        },
      };

      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfData),
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
      link.download = "mandal-daatgal.pdf";
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
  // const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [isContractLoading, setIsContractLoading] = useState(false);
  // const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  // const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [claimId, setClaimId] = useState(0);
  const [formBool, setFormBool] = useState(false);

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
        setClaimId(data?.data?.claimId);
        setFormBool(data?.data?.form);
      } catch (err) {
        console.error("Хайлтын алдаа:", err);
      }
    };

    if (token) {
      searchClaim();
    }
  }, [token]); // Added token as a dependency

  const searchContract = async () => {
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
            plateNumber: formValues.plateNumber,
            registerPart: formValues.registerPart,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Хайлт амжилтгүй боллоо");
      }

      const data = await response.json();
      console.log("Хайлтын үр дүн:", data);
      if (data?.data?.contractId === null) {
        toast.error("Тээврийн хэрэгсэл үүсээгүй байна");
        return;
      }
      // Update form values with the response data
      setFormValues((prev) => ({
        ...prev,
        contractNumber: data?.data?.insurName || "",
        startDate: data?.data?.startDate || "",
        endDate: data?.data?.endDate || "",
        ownerRegister: data?.data?.registerPart || "",
        serialNumber: data?.data?.frameNumber || "",
        contractId: data?.data?.contractId || "",
        contractProductName: data?.data?.contractProductName || "",
      }));
    } catch (err) {
      console.error("Хайлтын алдаа:", err);
    } finally {
      setIsContractLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      const radioValue = value === "yes" ? 1 : 0;
      setFormValues((prev) => ({
        ...prev,
        [name]: radioValue,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type:
      | "driver"
      | "accident"
      | "document"
      | "licenseFront"
      | "licenseBack"
      | "driverReference"
      | "insuranceContract"
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
      setFormValues((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
        ...(type === "accident" && {
          accidentPhotos: [...prev.accidentPhotos, ...files],
        }),
        ...(type === "driver" && {
          driverPhotos: [...prev.driverPhotos, ...files],
        }),
        ...(type === "insuranceContract" && {
          insuranceContractPhotos: [
            ...(prev.insuranceContractPhotos || []),
            ...files,
          ],
        }),
      }));
    }
  };

  // const handleFormUpdate = async () => {
  //   try {
  //     // Validate form before updating
  //     const emptyFields = validateForm(formValues);
  //     if (emptyFields.length > 0) {
  //       toast.error(`Дараах талбаруудыг бөглөнө үү: ${emptyFields.join(", ")}`);
  //       return;
  //     }

  //     setIsUpdateLoading(true);
  //     const attachments = await Promise.all(
  //       formValues.attachments.map(async (attachment) => ({
  //         fileName: attachment?.fileName,
  //         image_base64: attachment.file
  //           ? await convertToBase64(attachment.file)
  //           : attachment.image_base64,
  //       }))
  //     );

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/v1/miniapp/claim/update `,
  //       {
  //         method: "POST",
  //         headers: {
  //           "X-Openerp-Token": process.env.NEXT_PUBLIC_API_TOKEN || "",
  //         },
  //         body: JSON.stringify({
  //           token: token,
  //           policeCalled: formValues.policeCalled,
  //           accidentCalled: formValues.accidentCalled,
  //           caseDate: formValues.caseDate,
  //           caseCityId: formValues.homeCityId,
  //           caseDistrictId: formValues.homeDistrictId,
  //           caseLocation: formValues.caseLocation,
  //           caseDescription: formValues.caseDescription,
  //           driverName: formValues.driverName,
  //           driverLastname: formValues.driverLastname,
  //           driverRegNum: formValues.driverRegNum,
  //           driverPhone: formValues.driverPhone,
  //           driverBankId: formValues.driverBankId,
  //           driverBankAccount: formValues.driverBankAccount,
  //           driverBankAccountName: formValues.driverBankAccountName,
  //           bankAccountLastname: formValues.bankAccountLastname,
  //           bankAccountRegnum: formValues.bankAccountRegnum,
  //           victimName: formValues.victimName,
  //           victimLastname: formValues.victimLastname,
  //           victimRegNum: formValues.victimRegNum,
  //           inspected: formValues.inspected,
  //           insurerAgreement: formValues.insurerAgreement,
  //           agreementAmount: formValues.agreementAmount,
  //           attachments,
  //           phone: "",
  //           email: "",
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.status === "error") {
  //       throw new Error(data.message || "Алдаа гарлаа");
  //     }

  //     console.log("Хэрэглэгч шинэчлэгдлээ:", data);
  //     toast.success("Амжилттай шинэчлэгдлээ");

  //     // PDF үүсгэх
  //     await generatePDF();

  //     router.push("/");
  //   } catch (error) {
  //     console.error("Error updating form:", error);
  //     toast.error(error instanceof Error ? error.message : "Алдаа гарлаа");
  //   } finally {
  //     setIsUpdateLoading(false);
  //   }
  // };

  // const handleFormUpdate2 = async () => {
  //   try {
  //     // Файл байгаа эсэхийг шалгах
  //     if (formValues.attachments.length === 0) {
  //       toast.error("Зураг хавсаргана уу!");
  //       return;
  //     }

  //     setIsUpdateLoading(true);

  //     // Файлуудыг base64 болгох
  //     const attachments = await Promise.all(
  //       formValues.attachments.map(async (attachment) => ({
  //         fileName: attachment.fileName,
  //         image_base64: attachment.file
  //           ? await convertToBase64(attachment.file)
  //           : attachment.image_base64,
  //       }))
  //     );

  //     // API руу илгээх
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/v1/miniapp/claim/update2`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "X-Openerp-Token": process.env.NEXT_PUBLIC_API_TOKEN || "",
  //         },
  //         body: JSON.stringify({
  //           token: token,
  //           attachments,
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.status === "error") {
  //       throw new Error(data.message || "Алдаа гарлаа");
  //     }

  //     toast.success("Амжилттай шинэчлэгдлээ");
  //     router.push("/");
  //   } catch (error) {
  //     console.error("Error updating form:", error);
  //     toast.error(error instanceof Error ? error.message : "Алдаа гарлаа");
  //   } finally {
  //     setIsUpdateLoading(false);
  //   }
  // };

  // const handleFormSubmit = async () => {
  //   try {
  //     // Validate form before submitting
  //     const emptyFields = validateForm(formValues);
  //     if (emptyFields.length > 0) {
  //       toast.error(`Дараах талбаруудыг бөглөнө үү: ${emptyFields.join(", ")}`);
  //       return;
  //     }

  //     setIsSubmitLoading(true);
  //     const attachments = await Promise.all(
  //       formValues.attachments.map(async (attachment) => ({
  //         fileName: attachment.fileName,
  //         image_base64: attachment.file
  //           ? await convertToBase64(attachment.file)
  //           : attachment.image_base64,
  //       }))
  //     );

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/v1/miniapp/claim/create `,
  //       {
  //         method: "POST",
  //         headers: {
  //           "X-Openerp-Token": process.env.NEXT_PUBLIC_API_TOKEN || "",
  //         },
  //         body: JSON.stringify({
  //           contractId: parseInt(formValues.contractId),
  //           policeCalled: formValues.policeCalled,
  //           accidentCalled: formValues.accidentCalled,
  //           caseDate: formValues.caseDate,
  //           caseCityId: formValues.homeCityId,
  //           caseDistrictId: formValues.homeDistrictId,
  //           caseLocation: formValues.caseLocation,
  //           caseDescription: formValues.caseDescription,
  //           driverName: formValues.driverName,
  //           driverLastname: formValues.driverLastname,
  //           driverRegNum: formValues.driverRegNum,
  //           driverPhone: formValues.driverPhone,
  //           driverBankId: formValues.driverBankId,
  //           driverBankAccount: formValues.driverBankAccount,
  //           driverBankAccountName: formValues.driverBankAccountName,
  //           bankAccountLastname: formValues.bankAccountLastname,
  //           bankAccountRegnum: formValues.bankAccountRegnum,
  //           victimName: formValues.victimName,
  //           victimLastname: formValues.victimLastname,
  //           victimRegNum: formValues.victimRegNum,
  //           inspected: formValues.inspected,
  //           insurerAgreement: formValues.insurerAgreement,
  //           agreementAmount: formValues.agreementAmount,
  //           attachments,
  //           phone: "",
  //           email: "",
  //         }),
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.status === "error") {
  //       throw new Error(data.message || "Алдаа гарлаа");
  //     }

  //     console.log("Хэрэглэгч үүслээ:", data);
  //     toast.success("Амжилттай илгээгдлээ");
  //     router.push("/");
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     toast.error(error instanceof Error ? error.message : "Алдаа гарлаа");
  //   } finally {
  //     setIsSubmitLoading(false);
  //   }
  // };

  // Add validateForm function before the return statement
  // const validateForm = (values: FormValues): string[] => {
  //   const emptyFields: string[] = [];

  //   // Required fields for all forms
  //   const requiredFields = {
  //     // plateNumber: "Улсын дугаар",
  //     // registerPart: "Регистрийн дугаар",
  //     caseDate: "Ослын огноо",
  //     caseDescription: "Ослын тайлбар",
  //     driverName: "Жолоочийн нэр",
  //     driverLastname: "Жолоочийн овог",
  //     driverRegNum: "Жолоочийн регистрийн дугаар",
  //     driverPhone: "Жолоочийн утас",
  //     driverBankId: "Банк",
  //     driverBankAccount: "Банкны данс",
  //     driverBankAccountName: "Дансны эзэмшигчийн нэр",
  //     bankAccountLastname: "Дансны эзэмшигчийн овог",
  //     bankAccountRegnum: "Дансны эзэмшигчийн регистрийн дугаар",
  //     victimName: "Хохирогчийн нэр",
  //     victimLastname: "Хохирогчийн овог",
  //     victimRegNum: "Хохирогчийн регистрийн дугаар",
  //   };

  //   // Check each required field
  //   Object.entries(requiredFields).forEach(([field, label]) => {
  //     if (
  //       !values[field as keyof FormValues] ||
  //       values[field as keyof FormValues] === ""
  //     ) {
  //       emptyFields.push(label);
  //     }
  //   });

  //   // Check bank account number length (must be exactly 18 digits)
  //   if (values.driverBankAccount && values.driverBankAccount.length !== 18) {
  //     emptyFields.push("Дансны дугаар 18 оронтой байх ёстой");
  //   }

  //   // Check if at least one photo is uploaded
  //   if (values.attachments.length === 0) {
  //     emptyFields.push("Зураг");
  //   }

  //   return emptyFields;
  // };

  return (
    <>
      <div className="min-h-screen  py-12 px-0 sm:px-6 lg:px-8 ">
        <div className="max-w-[1000px] mx-auto mb-20 flex justify-center ">
          <div className="flex  items-start justify-start">
            {formBool === false ? (
              <div className=" bg-gray-100 w-full p-8 rounded-lg ">
                <h2 className="text-[16px] font-bold text-center text-[#142a68] ">
                  АЛБАН ЖУРМЫН ДААТГАЛЫН ДААТГУУЛАГЧИЙН НӨХӨН ТӨЛБӨРИЙН МЭДҮҮЛЭГ
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

                {!claimId && (
                  <>
                    <VictimSearch
                      formValues={formValues}
                      handleChange={handleChange}
                      searchContract={searchContract}
                      isContractLoading={isContractLoading}
                    />

                    {formValues.contractNumber && (
                      <>
                        <h2 className="text-[16px] font-bold text-center text-[#142a68] mb-8">
                          ТЭЭВРИЙН ХЭРЭГСЛИЙН ДААТГАЛЫН ГЭРЭЭНИЙ МЭДЭЭЛЭЛ
                        </h2>

                        <ContractInfo
                          formValues={formValues}
                          // handleChange={handleChange}
                          isContractLoading={isContractLoading}
                        />
                      </>
                    )}
                  </>
                )}

                <h2 className="text-[16px] font-bold text-center text-[#142a68] mb-8 mt-10">
                  ОСОЛ БОЛОХ ҮЕД ЖОЛОО БАРЬЖ ЯВСАН ЖОЛООЧИЙН МЭДЭЭЛЭЛ
                </h2>

                <DriverInfo
                  formValues={formValues}
                  handleChange={handleChange}
                  handleFileUpload={handleFileUpload}
                  setFormValues={setFormValues}
                />

                <h2 className="text-[16px] font-bold text-center text-[#142a68] mb-8">
                  ОСЛЫН МЭДЭЭЛЭЛ
                </h2>

                <AccidentInfo
                  formValues={formValues}
                  handleChange={handleChange}
                  handleFileUpload={handleFileUpload}
                  setFormValues={setFormValues}
                />

                <FileUpload handleFileUpload={handleFileUpload} />

                <VictimInfo
                  formValues={formValues}
                  handleChange={handleChange}
                  // setFormValues={setFormValues}
                  // setFormValues={setFormValues}
                />
                <BankInfo
                  formValues={formValues}
                  handleChange={handleChange}
                  setFormValues={setFormValues}
                />
                {/* <button
                  onClick={claimId ? handleFormUpdate : handleFormSubmit}
                  disabled={isSubmitLoading || isUpdateLoading}
                  className="w-full cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg mt-4
                border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitLoading || isUpdateLoading ? (
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
                      {claimId ? "Шинэчлэж байна..." : "Илгээж байна..."}
                    </div>
                  ) : (
                    "Илгээх"
                  )}
                </button> */}
              </div>
            ) : (
              <div>
                <AddFile handleFileUpload={handleFileUpload} />
                <div>
                  {/* <button
                    onClick={handleFormUpdate2}
                    disabled={isSubmitLoading || isUpdateLoading}
                    className="w-full cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg mt-4
                border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitLoading || isUpdateLoading ? (
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
                        {claimId ? "Илгээж байна..." : "Илгээж байна..."}
                      </div>
                    ) : (
                      "Илгээх"
                    )}
                  </button> */}
                </div>
              </div>
            )}

            {/* <ChatGPTWidget apiKey={process.env.NEXT_PUBLIC_OPENAI_API_KEY!} /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default function VehicleInsuranceForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehicleInsuranceFormContent />
    </Suspense>
  );
}
