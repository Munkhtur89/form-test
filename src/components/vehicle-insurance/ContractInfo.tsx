import React from "react";
import { FormValues } from "@/types/form";
import dynamic from "next/dynamic";
import car from "../../../public/SNE9MmMGF1.json";
import { CiBarcode } from "react-icons/ci";
import { BsCalendar2Date, BsCalendarDate } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { PiBarcodeDuotone } from "react-icons/pi";
import { FaInbox } from "react-icons/fa";
// import { Spotlight } from "./components/spotlight";
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});
interface ContractInfoProps {
  formValues: FormValues;
  isContractLoading: boolean;
}

export default function ContractInfo({
  formValues,
  isContractLoading,
}: ContractInfoProps) {
  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-2xl max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 p-4 sm:p-8 rounded-b-2xl">
        {/* Зүүн тал */}
        <div className="bg-[#202f3f] rounded-3xl p-4 sm:p-8 flex flex-col items-center w-full sm:w-[300px] h-[200px] sm:h-[350px] justify-center">
          {formValues.contractNumber ? (
            <Lottie
              animationData={car}
              loop={true}
              height={100}
              width={100}
              className="w-[200px] sm:w-[400px] h-[200px] sm:h-[500px] object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-sm text-center px-4">
                Гэрчилгээний дугаараа оруулна уу
              </span>
            </div>
          )}
        </div>

        {/* Баруун тал */}
        <div className="bg-[#f4f8fe] p-4 sm:p-8 rounded-xl w-full">
          {isContractLoading ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <CiBarcode className="text-[#000000] text-[20px] " />
                  <span className="text-[#000000] text-[12px] sm:text-sm">
                    Гэрээний дугаар
                  </span>
                </div>
                <span className="text-[14px] sm:text-base font-semibold text-gray-900">
                  {formValues?.contractNumber}
                </span>
              </div>

              <div className="flex justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <BsCalendar2Date className="text-[#000000] text-[18px] " />
                  <span className="text-[#000000] text-[12px] sm:text-sm">
                    Эхлэх огноо
                  </span>
                </div>
                <span className="text-[14px] sm:text-base font-semibold text-gray-900">
                  {formValues?.startDate}
                </span>
              </div>
              <div className="flex  justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <BsCalendarDate className="text-[#000000] text-[18px] " />
                  <span className="text-[#000000] text-[12px] sm:text-sm">
                    Дуусах огноо
                  </span>
                </div>
                <span className="text-[14px] sm:text-base font-semibold text-gray-900">
                  {formValues?.endDate}
                </span>
              </div>
              <div className="flex  justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <ImProfile className="text-[#000000] text-[18px] " />
                  <span className="text-[#000000] text-[12px] sm:text-sm">
                    Өмчлөгчийн регистр
                  </span>
                </div>
                <span className="text-[14px] sm:text-base font-semibold text-gray-900">
                  {formValues?.ownerRegister}
                </span>
              </div>
              <div className="flex  justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <PiBarcodeDuotone className="text-[#000000] text-[20px] " />
                  <span className="text-[#000000] text-sm">Арлын дугаар</span>
                </div>
                <span className="text-[14px] sm:text-base font-semibold text-gray-900">
                  {formValues?.serialNumber}
                </span>
              </div>
              <div className="flex justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex items-start gap-2">
                  <FaInbox className="text-[#000000] text-[20px] " />
                  <span className="text-[#000000] text-sm">Бүтээгдэхүүн</span>
                </div>
                <span className="text-[10px] sm:text-base text-end font-semibold text-gray-900">
                  {formValues?.contractProductName}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
