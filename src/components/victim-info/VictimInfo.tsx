import React from "react";
import toast from "react-hot-toast";

interface VictimInfoProps {
  formValues: {
    victimName: string;
    victimLastname: string;
    victimRegNum: string;
    xplateNumber: string;
    victimPhone: string;
  };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function VictimInfo({
  formValues,
  handleChange,
}: VictimInfoProps) {
  return (
    <>
      <h2 className="text-[16px] font-bold text-center text-[#142a68] mb-8 mt-10">
        ХОХИРОГЧИЙН МЭДЭЭЛЭЛ
      </h2>

      <div className="mb-6 bg-white border rounded-lg ">
        <div className="relative bg-[#ffffff] p-[2px] rounded-2xl">
          <div className="bg-white p-6 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="relative w-full">
                  <label
                    htmlFor="victimName"
                    className="block text-sm font-bold text-[#142a68] mb-2"
                  >
                    Хохирогчийн овог <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                    <input
                      type="text"
                      name="victimName"
                      placeholder="Хохирогчийн овог"
                      className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                      value={formValues.victimName}
                      onChange={handleChange}
                      pattern="[А-Яа-яЁёӨөҮү\s]+"
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        const originalValue = input.value;
                        const newValue = originalValue.replace(
                          /[^А-Яа-яЁёӨөҮү\s]/g,
                          ""
                        );
                        if (originalValue !== newValue) {
                          toast.error("Зөвхөн монгол үсгээр бичнэ үү!", {
                            duration: 2000,
                            position: "top-center",
                          });
                        }
                        input.value = newValue;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="relative w-full">
                  <label
                    htmlFor="victimLastname"
                    className="block text-sm font-bold text-[#142a68] mb-2"
                  >
                    Хохирогчийн нэр <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                    <input
                      type="text"
                      name="victimLastname"
                      placeholder="Хохирогчийн нэр"
                      className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                      value={formValues.victimLastname}
                      onChange={handleChange}
                      pattern="[А-Яа-яЁёӨөҮү\s]+"
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        const originalValue = input.value;
                        const newValue = originalValue.replace(
                          /[^А-Яа-яЁёӨөҮү\s]/g,
                          ""
                        );
                        if (originalValue !== newValue) {
                          toast.error("Зөвхөн монгол үсгээр бичнэ үү!", {
                            duration: 2000,
                            position: "top-center",
                          });
                        }
                        input.value = newValue;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="relative w-full">
                  <label
                    htmlFor="xplateNumber"
                    className="block text-sm font-bold text-[#142a68] mb-2"
                  >
                    Хохирогчийн улсын дугаар{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                    <input
                      type="text"
                      name="xplateNumber"
                      placeholder="Хохирогчийн улсын дугаар"
                      className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                      value={formValues.xplateNumber}
                      onChange={handleChange}
                      pattern="[0-9]{4}[А-Яа-яЁёӨөҮү]{3}"
                      maxLength={7}
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        const value = input.value;

                        // Remove any non-alphanumeric characters
                        let newValue = value.replace(/[^0-9А-Яа-яЁёӨөҮү]/g, "");

                        // Ensure first 4 characters are numbers
                        const numbers = newValue
                          .slice(0, 4)
                          .replace(/[^0-9]/g, "");

                        // Ensure last 3 characters are letters
                        const letters = newValue
                          .slice(4, 7)
                          .replace(/[^А-Яа-яЁёӨөҮү]/g, "");

                        newValue = numbers + letters;

                        if (value !== newValue) {
                          toast.error(
                            "Улсын дугаар: 4 орон тоо, 3 үсэг байх ёстой!",
                            {
                              duration: 2000,
                              position: "top-center",
                            }
                          );
                        }

                        input.value = newValue;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="relative w-full">
                  <label
                    htmlFor="victimRegNum"
                    className="block text-sm font-bold text-[#142a68] mb-2"
                  >
                    Хохирогчийн регистрийн дугаар{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                    <input
                      type="text"
                      name="victimRegNum"
                      placeholder="Хохирогчийн регистрийн дугаар"
                      className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                      value={formValues.victimRegNum}
                      onChange={handleChange}
                      pattern="[А-Яа-яЁёӨөҮү]{2}[0-9]{8}"
                      maxLength={10}
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        const value = input.value;

                        // Remove any non-alphanumeric characters
                        let newValue = value.replace(/[^0-9А-Яа-яЁёӨөҮү]/g, "");

                        // Ensure first 2 characters are letters
                        const letters = newValue
                          .slice(0, 2)
                          .replace(/[^А-Яа-яЁёӨөҮү]/g, "");

                        // Ensure last 8 characters are numbers
                        const numbers = newValue
                          .slice(2, 10)
                          .replace(/[^0-9]/g, "");

                        newValue = letters + numbers;

                        if (value !== newValue) {
                          toast.error(
                            "Регистрийн дугаар: 2 үсэг, 8 орон тоо байх ёстой!",
                            {
                              duration: 2000,
                              position: "top-center",
                            }
                          );
                        }

                        input.value = newValue;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="relative w-full">
                  <label
                    htmlFor="victimPhone"
                    className="block text-sm font-bold text-[#142a68] mb-2"
                  >
                    Хохирогчийн утасны дугаар{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute -left-0.5 top-2 bottom-2 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
                    <input
                      type="text"
                      name="victimPhone"
                      placeholder="Хохирогчийн утасны дугаар"
                      className="w-full pl-6 pr-4 py-3.5 text-[16px] text-gray-800 bg-white border border-gray-200 rounded-lg  focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300"
                      value={formValues.victimPhone}
                      onChange={handleChange}
                      pattern="[0-9]{8}"
                      maxLength={8}
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        const value = input.value;

                        // Remove any non-numeric characters
                        const newValue = value.replace(/[^0-9]/g, "");

                        if (value !== newValue) {
                          toast.error(
                            "Утасны дугаар: 8 оронтой тоо байх ёстой!",
                            {
                              duration: 2000,
                              position: "top-center",
                            }
                          );
                        }

                        input.value = newValue;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
