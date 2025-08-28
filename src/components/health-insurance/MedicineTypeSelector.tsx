import React from "react";
import Gurwangal from "@/../public/logo/480383283_1073347238166655_6495600086760525876_n.jpg";
import Intermed from "@/../public/logo/636d74cb-e04e-4177-98bd-485c2c87ff80.png";
import Songdo from "@/../public/logo/songdo_hospital_cover.jpeg";
import Image from "next/image";

interface MedicineTypeSelectorProps {
  selectedComponent: string;
  onSelectComponent: (component: string) => void;
}

const MedicineTypeSelector: React.FC<MedicineTypeSelectorProps> = ({
  selectedComponent,
  onSelectComponent,
}) => {
  const medicineTypes = [
    {
      id: "payment",
      title: "Гурван гал",
      description: "Тусгай эмлэгээний маягтууд",
      icon: (
        <Image
          src={Gurwangal.src}
          alt="Гурван гал"
          className="w-10 h-10 rounded-lg object-contain"
          width={100}
          height={100}
        />
      ),
    },
    {
      id: "test",
      title: "Интермед",
      description: "Шинжилгээний маягтууд",
      icon: (
        <Image
          src={Intermed.src}
          alt="Интермед"
          className="w-18 h-18 rounded-lg object-contain"
          width={100}
          height={100}
        />
      ),
    },
    {
      id: "prescription",
      title: "Сонгодо",
      description: "Жорын маягтууд",
      icon: (
        <Image
          src={Songdo.src}
          alt="Сонгодо"
          className="w-18 h-18 rounded-lg object-contain"
          width={100}
          height={100}
        />
      ),
    },
    {
      id: "compensation",
      title: "Бусад",
      description: "Ердийн эмлэгээний маягтууд",
      icon: (
        <svg
          className="w-6 h-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="md:col-span-2 mb-8">
      <label className="block text-sm font-semibold text-gray-800 mb-4">
        Эмлэгээ сонгоно уу:
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {medicineTypes.map((type) => (
          <div
            key={type.id}
            className={`relative cursor-pointer transition-all duration-300 rounded-xl p-4 border-2 ${
              selectedComponent === type.id
                ? "bg-amber-50 border-amber-200 shadow-md"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelectComponent(type.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-20 h-10 bg-white rounded-lg flex items-center justify-center">
                  {type.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {type.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineTypeSelector;
