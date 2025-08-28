import React, { useState, useEffect } from "react";
import { FormValues } from "@/types/form";
import regionData from "@/lib/cleaned_region_data.json";

interface HomeAddressProps {
  formValues: FormValues;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const HomeAddress: React.FC<HomeAddressProps> = ({
  formValues,
  handleChange,
}) => {
  const [districts, setDistricts] = useState<
    Array<{ id: number; name: string; type: string }>
  >([]);

  useEffect(() => {
    const region = regionData.result.find(
      (region) => region.parent_id === Number(formValues?.homeCityId)
    );

    if (region) {
      setDistricts(region.children);
    } else {
      setDistricts([]);
    }
  }, [formValues?.homeCityId]);

  return (
    <div className="bg-white rounded-lg  mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* <div className="relative">
          <label className="block text-sm font-bold text-[#1a237e] pb-2">
            Осол болсон бүс/хот
          </label>
          <select
            name="homeCityId"
            value={formValues?.homeCityId}
            onChange={handleChange}
            className="w-full text-black px-4 py-2  border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
          >
            <option value="">Сонгоно уу</option>
            {regionData.result.map((region) => (
              <option key={region?.parent_id} value={region?.parent_id}>
                {region?.parent?.split(" - ")[1]}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
        </div> */}

        {districts.length > 0 && (
          <div className="relative">
            <label className="block text-sm font-bold text-[#1a237e] pb-2">
              Осол болсон сум/дүүрэг{" "}
            </label>
            <select
              name="homeDistrictId"
              value={formValues?.homeDistrictId}
              onChange={handleChange}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
            >
              <option value="">Сонгоно уу</option>
              {districts.map((district) => (
                <option key={district?.id} value={district?.id}>
                  {district?.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeAddress;
