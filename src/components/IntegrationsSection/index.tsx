"use client";

import Link from "next/link";
import Image from "next/image";

const integrations = [
  "/logo/companny/1.png", // Мандал санхүүгийн нэгдэл
  "/logo/companny/2.png", // Эдэр
  "/logo/companny/3.png", // Комдан
  "/logo/companny/4.png", // Мандал санхүүгийн нэгдэл
  "/logo/companny/5.png", // Эдэр
  "/logo/companny/6.png", // Комдан
  "/logo/companny/7.png", // Мандал санхүүгийн нэгдэл
  "/logo/companny/8.png", // Эдэр
  "/logo/companny/9.png", // Комдан
  "/logo/companny/11.png", // Мандал санхүүгийн нэгдэл
];

export default function IntegrationsSection() {
  return (
    <section className="max-w-[1440px] mx-auto my-20 px-6 grid md:grid-cols-2 gap-10 items-center border border-gray-200  p-6 rounded-3xl">
      {/* Left Side */}
      <div>
        <div className="flex items-start gap-2">
          <Image
            src="/logo/companny/12.png"
            alt="mandal"
            width={100}
            height={100}
          />

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold mt-2 mb-4 text-black">
              Мандал санхүүгийн нэгдэл
            </h2>
            <p className="text-gray-600  mb-6">
              Монгол улсын тэргүүлэгч санхүүгийн компаниудтай хамтран ажиллаж,
              таны санхүүгийн хэрэгцээг хангая.
            </p>
            <div className="flex gap-4">
              <button className="bg-black text-white px-5 py-2 rounded-lg font-medium">
                <Link href="/services" target="_blank">
                  Үйлчилгээнүүд
                </Link>
              </button>
              <button className="border border-gray-300  px-5 py-2 rounded-lg font-medium text-black">
                <Link href="/about" target="_blank">
                  Бидний тухай →
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="grid grid-cols-6 gap-4">
        {integrations.map((url, idx) => (
          <div
            key={idx}
            className="relative w-26 h-26 p-2 bg-white  shadow-sm border-2 border-gray-200 "
            style={{
              clipPath:
                "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <Image
              src={url}
              width={100}
              height={100}
              alt={`integration-${idx}`}
              className="object-contain p-1.5"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
