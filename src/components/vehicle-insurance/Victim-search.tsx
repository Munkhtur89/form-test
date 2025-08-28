import React from "react";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

interface SearchFormProps {
  formValues: {
    plateNumber: string;
    registerPart: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchContract: () => void;
  isContractLoading: boolean;
}

export default function VictimSearch({
  formValues,
  handleChange,
  searchContract,
  isContractLoading,
}: SearchFormProps) {
  // Улсын дугаар зөвхөн 4 тоо + 3 кирилл үсэг
  const plateMask = (value: string) => {
    // Зөвхөн тоо болон кирилл үсгийг зөвшөөрөх
    const cleaned = value.replace(/[^0-9А-ЯӨҮа-яөү]/gi, "");

    // Эхний 4 орон нь тоо байх ёстой
    const numbers = cleaned.match(/^\d{0,4}/)?.[0] || "";

    // Үлдсэн хэсэг нь кирилл үсэг байх ёстой
    const letters = cleaned
      .slice(numbers.length)
      .replace(/[^А-ЯӨҮа-яөү]/g, "")
      .toUpperCase()
      .slice(0, 3);

    return numbers + letters;
  };

  // Регистрийн дугаар зөвхөн 4 оронтой тоо
  //   const registerMask = (value: string) =>
  //     value.replace(/[^0-9]/g, "").slice(0, 4);

  const isValid =
    formValues.plateNumber.length === 7 &&
    /^[0-9]{4}[А-ЯӨҮ]{3}$/.test(formValues.plateNumber) &&
    formValues.registerPart.length === 4 &&
    /^[0-9]{4}$/.test(formValues.registerPart);

  // Input бүрд тусдаа handler ашиглана
  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = plateMask(e.target.value);
    handleChange({
      ...e,
      target: {
        ...e.target,
        value: masked,
        name: "plateNumber",
      },
    });
  };

  //   const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const masked = registerMask(e.target.value);
  //     handleChange({
  //       ...e,
  //       target: {
  //         ...e.target,
  //         value: masked,
  //         name: "registerPart",
  //       },
  //     });
  //   };

  // Хайх товч дарахад шалгах
  const handleSearch = () => {
    console.log("Хайлт эхэлж байна:", {
      plateNumber: formValues.plateNumber,
      isValid,
      isContractLoading,
    });
    if (formValues.plateNumber === "") {
      toast.error("Улсын дугаарыг оруулна уу!");
      return;
    }

    if (isContractLoading) {
      console.log("Хайлт ажиллаж байна...");
      return;
    }

    if (!isValid) {
      console.log("Талбарууд буруу бөглөгдсөн байна");
      // toast.error("Бүх талбарыг зөв бөглөнө үү!");
    } else console.log("Хайлт амжилттай эхэлж байна");
    searchContract();
  };

  return (
    <div className="relative overflow-hidden py-30 md:py-20 rounded-[20px] my-5 md:my-10">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-4 md:py-6 border border-gray-100 w-[90%] md:w-auto">
          <div className="flex flex-col items-start w-full md:w-auto">
            <label className="text-[12px] md:text-[14px] font-semibold text-gray-700 mb-2 ml-1">
              Улсын дугаар
            </label>
            <input
              type="text"
              name="plateNumber"
              className="rounded-2xl md:rounded-l-2xl px-4 md:px-6 py-3 md:py-4 text-lg md:text-2xl border-2 border-gray-200 font-bold bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors w-full md:w-auto"
              placeholder="0000ААА"
              required
              value={formValues.plateNumber}
              onChange={handlePlateChange}
              style={{ minWidth: 150, letterSpacing: "2px" }}
              maxLength={7}
              autoComplete="off"
            />
          </div>

          {/* <div className="flex flex-col items-start">
            <label className="text-[14px] font-semibold text-gray-700 mb-2 ml-1">
              Регистрийн дугаарын сүүлийн 4 орон
            </label>
            <input
              type="text"
              name="registerPart"
              className="px-6 py-4 text-2xl border-2 border-gray-200 font-bold bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors border-l-0"
              placeholder="6703"
              required
              value={formValues.registerPart}
              onChange={handleRegisterChange}
              style={{ minWidth: 100, letterSpacing: "2px" }}
              maxLength={4}
              autoComplete="off"
            />
          </div> */}

          <button
            onClick={handleSearch}
            disabled={isContractLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 cursor-pointer flex items-center justify-center rounded-2xl mt-4 md:mt-8 md:ml-2 px-6 md:px-8 py-3 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl w-full md:w-auto"
          >
            {isContractLoading ? (
              <svg
                className="animate-spin h-5 w-5 md:h-6 md:w-6 text-white"
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
            ) : (
              <FaSearch className="text-white text-lg md:text-xl" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
