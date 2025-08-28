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

export default function SearchForm({
  formValues,
  handleChange,
  searchContract,
  isContractLoading,
}: SearchFormProps) {
  // Улсын дугаар зөвхөн 4 тоо + 3 кирилл үсэг
  const plateMask = (value: string) => {
    // Зөвхөн тоо болон кирилл үсгийг зөвшөөрнө
    const cleaned = value.replace(/[^0-9А-ЯӨҮа-яөүЁё]/gi, "");

    // Тоонуудыг эхэнд, үсгийг төгсгөлд байрлуулна
    const numbers = cleaned.match(/[0-9]/g)?.join("") || "";
    const letters =
      cleaned
        .match(/[А-ЯӨҮЁа-яөүё]/g)
        ?.map((letter) => {
          // Жижиг үсгийг том болгох
          if (letter === "а") return "А";
          if (letter === "ө") return "Ө";
          if (letter === "ү") return "Ү";
          if (letter === "ё") return "Ё";
          return letter.toUpperCase();
        })
        .join("") || "";

    // Тоонуудыг 4 оронтой болгох
    const formattedNumbers = numbers.slice(0, 4);
    // Үсгийг 3 үсэгтэй болгох
    const formattedLetters = letters.slice(0, 3);

    return formattedNumbers + formattedLetters;
  };

  // Регистрийн дугаар зөвхөн 4 оронтой тоо
  const registerMask = (value: string) =>
    value.replace(/[^0-9]/g, "").slice(0, 4);

  const isValid =
    formValues.plateNumber.length === 7 &&
    /^[0-9]{4}[А-ЯӨҮЁ]{3}$/.test(formValues.plateNumber) &&
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

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = registerMask(e.target.value);
    handleChange({
      ...e,
      target: {
        ...e.target,
        value: masked,
        name: "registerPart",
      },
    });
  };

  // Хайх товч дарахад шалгах
  const handleSearch = () => {
    if (isContractLoading) {
      console.log("Хайлт ажиллаж байна...");
      return;
    }

    if (formValues.registerPart.length === 0) {
      toast.error("Регистрийн дугаарын сүүлийн 4 орон оруулна уу!");
      return;
    }

    if (formValues.plateNumber.length === 0) {
      toast.error("Улсын дугаараа оруулна уу!");
      return;
    }

    if (!isValid) {
      console.log("Талбарууд буруу бөглөгдсөн байна");
      toast.error("Бүх талбарыг зөв бөглөнө үү!");
    } else console.log("Хайлт амжилттай эхэлж байна");

    searchContract();
  };

  return (
    <div className="w-full py-5 md:py-10 rounded-[20px] my-5  flex flex-col items-center bg-transparent">
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl px-2 md:px-4 py-6 border border-gray-200 w-full max-w-md md:max-w-full">
          <div className="flex flex-col items-start w-full md:w-auto">
            <label className="text-[14px] font-semibold text-gray-700 mb-2 ml-1">
              Улсын дугаар
            </label>
            <input
              type="text"
              name="plateNumber"
              className="rounded-2xl md:rounded-l-2xl md:rounded-r-none px-4 md:px-6 py-3 md:py-4 text-xl md:text-2xl border-2 border-gray-200 font-bold bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors w-full md:w-auto"
              placeholder="0000ААА"
              required
              value={formValues.plateNumber}
              onChange={handlePlateChange}
              style={{ minWidth: 0, letterSpacing: "2px" }}
              maxLength={7}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col items-start w-full md:w-auto mt-4 md:mt-0">
            <label className="text-[14px] font-semibold text-gray-700 mb-2 ml-1">
              Регистрийн дугаарын сүүлийн 4 орон
            </label>
            <input
              type="text"
              name="registerPart"
              className="rounded-2xl md:rounded-none px-4 md:px-6 py-3 md:py-4 text-xl md:text-2xl border-2 border-gray-200 font-bold bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors w-full md:w-auto"
              placeholder="0000"
              required
              value={formValues.registerPart}
              onChange={handleRegisterChange}
              style={{ minWidth: 0, letterSpacing: "2px" }}
              maxLength={4}
              autoComplete="off"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isContractLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-800 ml-0 sm:ml-2 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 cursor-pointer flex items-center justify-center rounded-2xl mt-4 md:mt-8 px-6 md:px-8 py-3 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl w-full md:w-auto"
          >
            {isContractLoading ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
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
              <FaSearch className="text-white text-xl" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
