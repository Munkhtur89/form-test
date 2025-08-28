"use client";

import React from "react";
import car from "../../public/IrcopfqkS1.json";
import dotood from "../../public/hohir.json";
import ervvlM from "../../public/OxQlyl0N6t.json";
import InsuranceCard from "@/components/InsuranceCard";
import Robots from "../../public/formcity.json";
import dynamic from "next/dynamic";
import IntegrationsSection from "@/components/IntegrationsSection";
import ClientsSectionDemo from "@/components/TestimonialCard";
import ContactSection from "@/components/ContactSection";
import AIChatbot from "@/components/AIChatbot";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

// Testimonial component

export default function Home() {
  return (
    <div className="relative  ">
      {/* Main Hero Section */}
      <div className="mx-auto  pb-24 relative  bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 overflow-hidden">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="flex justify-between items-center  mx-auto max-w-7xl h-[60vh] relative z-10">
          <div className="text-start mb-16">
            <h1 className="text-6xl font-bold text-white mb-4">Нөхөн төлбөр</h1>
            <p className="text-xl text-white mb-8">
              Таны даатгалын найдвартай хамгаалалт
            </p>
            <p className="text-lg text-white/90 mb-6 max-w-xl">
              🚀 AI технологиор таны даатгалын хэрэгцээг шийдэх! Ухаалаг систем,
              хурдан дүн шинжилгээ, найдвартай үр дүн.
            </p>

            {/* Холбоо барих хэсэг */}
            <ContactSection />
          </div>

          <div className="flex justify-center mb-16 w-[600px] h-[500px] mt-10 ">
            <Lottie
              autoplay
              loop
              animationData={Robots}
              height={100}
              width={100}
            />
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="text-center mb-12 relative z-10">
          <p className="text-xl text-white/90">
            Таны хэрэгцээнд тохирсон нөхөн төлбөр сонголтууд
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-7xl mx-auto relative z-10">
          <InsuranceCard
            title="Тээврийн хэрэгслийн даатгал"
            description=""
            animationData={car}
            href="./vehicle-insurance-form"
          />
          <InsuranceCard
            title="Албан журмын даатгал"
            description=""
            animationData={dotood}
            href="./victim-insure"
          />
          <InsuranceCard
            title="Жаргалан эрүүл мэндийн даатгал"
            description=""
            animationData={ervvlM}
            href="./health"
          />
        </div>
      </div>
      <IntegrationsSection />
      {/* What Our Users Say Section */}
      <div className="w-[1440px] mx-auto  mt-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-2">
            Хэрэглэгчдийн сэтгэгдэл
          </h2>
          <p className="text-lg text-black/80">
            Жинхэнэ хүмүүс, жинхэнэ туршлага, жинхэнэ үр дүн
          </p>
        </div>
      </div>

      <ClientsSectionDemo />

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
