import React, { useState } from "react";
import deepLinks from "@/lib/deepLinks";
import { FormValues } from "@/types/form";
import { TbInfoHexagonFilled } from "react-icons/tb";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface BankInfoProps {
  formValues: FormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

const isMongolianText = (text: string) => {
  const mongolianRegex =
    /^[\u0400-\u04FF\u1800-\u18AF\u202F\u2000-\u206F\u0020]+$/;
  return mongolianRegex.test(text);
};

const isValidRegNumber = (text: string) => {
  const mongolianLetters = text.substring(0, 2);
  const numbers = text.substring(2);
  const mongolianRegex = /^[А-Яа-яЁёӨөҮү]{2}$/;
  const numbersRegex = /^\d{8}$/;

  return mongolianRegex.test(mongolianLetters) && numbersRegex.test(numbers);
};

export default function BankInfo({
  formValues,
  handleChange,
  setFormValues,
}: BankInfoProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "bankAccountLastname" || name === "driverBankAccountName") {
      if (!isMongolianText(value) && value !== "") {
        toast.error("Зөвхөн монгол үсгээр бичнэ үү!");
        return;
      }
    }

    if (name === "bankAccountRegnum") {
      if (value !== "" && !isValidRegNumber(value)) {
        toast.error("Регистр 2 үсэг, 8 тоогоор бүрдэнэ!");
        return;
      }
    }

    if (name === "driverBankAccount") {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, "");

      // If the input contains non-numeric characters, show error
      if (numericValue !== value) {
        toast.error("Зөвхөн тоо оруулна уу!");
        return;
      }

      // Update the input with the numeric value
      handleChange({
        ...e,
        target: {
          ...e.target,
          value: numericValue,
          name: "driverBankAccount",
        },
      });
      return;
    }

    handleChange(e);
  };

  return (
    <div>
      <h2 className="text-[16px] font-bold text-[#142a68] text-center my-8">
        БАНКНЫ МЭДЭЭЛЭЛ
      </h2>
      <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              Банк сонгох
              <TbInfoHexagonFilled className="text-blue-400" />
            </span>
          </div>
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between hover:border-blue-500 transition-all duration-200 bg-white"
            >
              {formValues?.driverBankId ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      deepLinks.find(
                        (bank) => bank.id === formValues?.driverBankId
                      )?.logo || ""
                    }
                    alt="Bank logo"
                    width={32}
                    height={32}
                    className="rounded-full shadow-sm"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {
                      deepLinks.find(
                        (bank) => bank.id === formValues?.driverBankId
                      )?.description
                    }
                  </span>
                </div>
              ) : (
                <span className="text-gray-500">Банк сонгоно уу</span>
              )}
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in">
                {deepLinks.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => {
                      setFormValues((prev: FormValues) => ({
                        ...prev,
                        driverBankId: bank.id,
                      }));
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                  >
                    <Image
                      src={bank?.logo}
                      alt={bank?.description}
                      width={32}
                      height={32}
                      className="rounded-full shadow-sm"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {bank?.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1a237e]">
              Данс эзэмшигчийн овог <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white">
                <input
                  type="text"
                  name="bankAccountLastname"
                  className="w-full pl-4 md:pl-6 pr-4 py-2.5 md:py-3.5 text-[14px] md:text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                  value={formValues.bankAccountLastname}
                  onChange={handleInputChange}
                  placeholder="Овог"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1a237e]">
              Данс эзэмшигчийн нэр <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white">
                <input
                  type="text"
                  name="driverBankAccountName"
                  className="w-full pl-4 md:pl-6 pr-4 py-2.5 md:py-3.5 text-[14px] md:text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                  value={formValues.driverBankAccountName}
                  onChange={handleInputChange}
                  placeholder="Нэр"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1a237e]">
              Данс эзэмшигчийн регистр <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white">
                <input
                  type="text"
                  name="bankAccountRegnum"
                  className="w-full pl-4 md:pl-6 pr-4 py-2.5 md:py-3.5 text-[14px] md:text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                  value={formValues.bankAccountRegnum}
                  onChange={(e) => {
                    const value = e.target.value;
                    // First 2 characters must be Mongolian Cyrillic including Ө, Ү
                    const firstPart = value
                      .slice(0, 2)
                      .replace(/[^А-Яа-яЁёӨөҮү]/g, "");
                    // Last 8 characters must be numbers
                    const secondPart = value
                      .slice(2, 10)
                      .replace(/[^0-9]/g, "");
                    // Combine both parts
                    const newValue = firstPart + secondPart;
                    // Update the input value
                    handleChange({
                      ...e,
                      target: {
                        ...e.target,
                        value: newValue,
                        name: "bankAccountRegnum",
                      },
                    });
                  }}
                  onKeyPress={(e) => {
                    const value = formValues?.bankAccountRegnum || "";
                    if (value.length < 2) {
                      // First 2 characters must be Mongolian Cyrillic including Ө, Ү
                      const pattern = /[А-Яа-яЁёӨөҮү]/;
                      if (!pattern.test(e.key)) {
                        e.preventDefault();
                        toast.error("Эхний 2 үсэг нь монгол үсэг байх ёстой!");
                      }
                    } else if (value.length >= 2 && value.length < 10) {
                      // Next 8 characters must be numbers
                      const pattern = /[0-9]/;
                      if (!pattern.test(e.key)) {
                        e.preventDefault();
                        toast.error("Дараагийн 8 орон нь тоо байх ёстой!");
                      }
                    } else {
                      // Don't allow more than 10 characters
                      e.preventDefault();
                    }
                  }}
                  maxLength={10}
                  required
                  pattern="[А-Яа-яЁёӨөҮү]{2}[0-9]{8}"
                  title="2 монгол үсэг, 8 оронтой тоо"
                  placeholder="Регистр"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1a237e]">
              Дансны дугаар (IBAN) <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white">
                <input
                  type="text"
                  name="driverBankAccount"
                  className="w-full pl-4 md:pl-6 pr-4 py-2.5 md:py-3.5 text-[14px] md:text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                  value={formValues.driverBankAccount}
                  onChange={handleInputChange}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value !== "" && value.length !== 18) {
                      toast.error("IBAN дансны дугаар 18 оронтой байх ёстой!");
                    }
                  }}
                  placeholder="Жишээ: MN123456789012345678"
                  maxLength={18}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
