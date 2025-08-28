import React from "react";
import Image from "next/image";
import { FormValues } from "@/types/form";
import HomeAddress from "./HomeAddress";
// import PolicePhotoUpload from "./PolicePhotoUpload";
import Tsagdaa from "@/../public/logo/pen-and-paper.png";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AccidentInfoProps {
  formValues: FormValues;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type:
      | "driver"
      | "accident"
      | "document"
      | "licenseFront"
      | "licenseBack"
      | "driverReference"
      | "insuranceContract"
  ) => void;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

export default function AccidentInfo({
  formValues,
  handleChange,
  handleFileUpload,
  setFormValues,
}: AccidentInfoProps) {
  const validateRequiredFields = () => {
    if (!formValues.driverPhone) {
      toast.error("Утасны дугаар заавал оруулна уу");
      return false;
    }
    if (!formValues.caseDate) {
      toast.error("Осол болсон огноо заавал оруулна уу");
      return false;
    }
    if (!formValues.caseDescription) {
      toast.error("Ослын дэлгэрэнгүй тайлбар заавал оруулна уу");
      return false;
    }
    if (formValues.accidentPhotos.length === 0) {
      toast.error("Ослын зураг заавал оруулна уу");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRequiredFields()) {
      // Form is valid, proceed with submission
      console.log("Form is valid, proceeding with submission");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 bg-white border border-gray-200 rounded-xl  duration-300">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1a237e]">
                Утасны дугаар <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>

                <input
                  type="text"
                  name="driverPhone"
                  placeholder="Таны утасны дугаар"
                  className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg   focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                  value={formValues.driverPhone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, "");
                    if (value.length <= 8) {
                      setFormValues((prev) => ({
                        ...prev,
                        driverPhone: value,
                      }));
                    }
                  }}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
            </div> */}

            {/* <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1a237e]">
                Осол болсон огноо <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                <input
                  type="datetime-local"
                  name="caseDate"
                  className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                  value={formValues.caseDate}
                  onChange={handleChange}
                />
              </div>
            </div> */}

            {/* <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1a237e]">
                Цагдаа дуудсан эсэх <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="font-semibold text-sm text-gray-700">
                    {formValues.policeCalled === 1 ? "Тийм" : "Үгүй"}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="policeCalled"
                      className="sr-only peer"
                      checked={formValues.policeCalled === 1}
                      onChange={(e) => {
                        setFormValues((prev) => ({
                          ...prev,
                          policeCalled: e.target.checked ? 1 : 0,
                        }));
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div> */}

            {/* Цагдаа дуудсан бол зураг оруулах талбар */}

            {/* <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1a237e]">
                Даатгалын шуурхай алба ослын газарт үзлэг хийсэн эсэх{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="font-semibold text-sm text-gray-700">
                    {formValues.accidentCalled === 1 ? "Тийм" : "Үгүй"}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="accidentCalled"
                      className="sr-only peer"
                      checked={formValues.accidentCalled === 1}
                      onChange={(e) => {
                        setFormValues((prev) => ({
                          ...prev,
                          accidentCalled: e.target.checked ? 1 : 0,
                        }));
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div> */}
            {/* 
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1a237e]">
                Даатгагчтай тохиролцсон эсэх
                <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="font-semibold text-sm text-gray-700">
                    {formValues.inspected === 1 ? "Тийм" : "Үгүй"}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="inspected"
                      className="sr-only peer"
                      checked={formValues.inspected === 1}
                      onChange={(e) => {
                        setFormValues((prev) => ({
                          ...prev,
                          inspected: e.target.checked ? 1 : 0,
                        }));
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div> */}

            {/* {formValues.inspected === 1 ? (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#1a237e]">
                  Тохирсон үнийн дүн <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                  <div className="relative">
                    <input
                      type="text"
                      name="agreementAmount"
                      className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg shadow-md focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300 pr-20"
                      value={
                        formValues.agreementAmount
                          ? Number(
                              formValues.agreementAmount.replace(/[^\d]/g, "")
                            ).toLocaleString("mn-MN")
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, "");
                        setFormValues((prev) => ({
                          ...prev,
                          agreementAmount: raw,
                        }));
                      }}
                      placeholder="Тохирсон үнийн дүн"
                      inputMode="numeric"
                      pattern="^[0-9]*$"
                      min={0}
                      autoComplete="off"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 select-none">
                      ₮
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )} */}
          </div>
          <HomeAddress formValues={formValues} handleChange={handleChange} />

          {/* <div className="mt-8 space-y-2">
            <label className="block text-sm font-bold text-[#1a237e]">
              Ослын дэлгэрэнгүй тайлбар <span className="text-red-500">*</span>
            </label>
            <textarea
              name="caseDescription"
              rows={6}
              className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={formValues.caseDescription}
              onChange={handleChange}
            />
          </div> */}

          <div className="mt-8 space-y-2 bg-white rounded-xl border border-gray-200 ">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold">
                    <Image
                      src={Tsagdaa.src}
                      alt="Тээврийн хэрэгслийн гэрчилгээ"
                      className="w-full h-full object-contain"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Гар өргөдөл</h4>
                    <p className="text-sm text-gray-600">
                      Олон файл оруулах боломжтой
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-8 flex flex-col items-center justify-center m-6 ">
              <svg
                className="mx-auto h-12 w-12 text-blue-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mt-2 text-base text-blue-700 font-medium">
                Зураг чирж оруулна уу эсвэл{" "}
                <label
                  htmlFor="accident-photos"
                  className="underline cursor-pointer text-blue-600"
                >
                  browse files
                </label>
              </span>
              <input
                id="accident-photos"
                name="accidentPhotos"
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFileUpload(e, "accident")}
              />
            </div>

            {/* Uploaded Files UI */}
            {formValues?.accidentPhotos?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                <div className="font-semibold text-gray-700 mb-2">
                  Оруулсан файлууд
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {formValues?.accidentPhotos?.map((photo, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
                        <Image
                          src={URL.createObjectURL(photo)}
                          alt={`Accident photo ${index + 1}`}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {photo.name}
                        </div>
                        <a
                          href={URL.createObjectURL(photo)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 underline"
                        >
                          Preview / Татах
                        </a>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        {/* Амжилттай icon (жишээ болгож үргэлж check харуулна) */}
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <button
                          type="button"
                          className="ml-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                          onClick={() => {
                            setFormValues((prev: FormValues) => ({
                              ...prev,
                              accidentPhotos: prev.accidentPhotos.filter(
                                (_: File, i: number) => i !== index
                              ),
                              attachments: prev.attachments.filter(
                                (
                                  _: {
                                    fileName: string;
                                    image_base64: string;
                                    file: File | null;
                                  },
                                  i: number
                                ) => i !== index + prev.driverPhotos.length
                              ),
                            }));
                          }}
                          title="Устгах"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Цагдааны оруулсан зурагнууд */}
            {/* {formValues?.policePhotos?.length > 0 && (
              <div className="col-span-1 md:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                  <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Цагдааны оруулсан зурагнууд
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {formValues?.policePhotos?.map((photo, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
                          <Image
                            src={URL.createObjectURL(photo)}
                            alt={`Police photo ${index + 1}`}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            {photo.name}
                          </div>
                          <a
                            href={URL.createObjectURL(photo)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 underline"
                          >
                            Preview / Татах
                          </a>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <button
                            type="button"
                            className="ml-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                            onClick={() => {
                              setFormValues((prev: FormValues) => ({
                                ...prev,
                                policePhotos: (prev?.policePhotos || []).filter(
                                  (_: File, i: number) => i !== index
                                ),
                              }));
                            }}
                            title="Устгах"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </form>
  );
}
