"use client";

import React from "react";
import { AdvancedAnimatedTabBar } from "@/components/ui";
import { Home, User, Car, Shield, FileText, CreditCard } from "lucide-react";

export default function TabbarDemoPage() {
  const tabs = [
    {
      id: "home",
      label: "Нүүр",
      icon: <Home size={20} />,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Нүүр хуудас</h2>
          <p className="text-gray-600 mb-4">
            Тавтай морил! Энэ бол framer motion ашигласан хөдөлгөөнтэй tabbar
            menu-ийн жишээ юм.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Хурд</h3>
              <p className="text-blue-600">Хөдөлгөөнтэй UI</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Чанар</h3>
              <p className="text-green-600">Сайн хэрэглэгчийн туршлага</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Хялбар</h3>
              <p className="text-purple-600">Хэрэглэхэд хялбар</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "profile",
      label: "Профайл",
      icon: <User size={20} />,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Профайл</h2>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Бат Болд</h3>
              <p className="text-gray-600">Жолоочийн ангилал: B</p>
              <p className="text-gray-600">Хүчинтэй хугацаа: 2025.12.31</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Хувийн мэдээлэл</h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Регистр:</span> АА12345678
                </p>
                <p>
                  <span className="font-medium">Төрсөн огноо:</span> 1990.05.15
                </p>
                <p>
                  <span className="font-medium">Хүйс:</span> Эрэгтэй
                </p>
                <p>
                  <span className="font-medium">Хаяг:</span> Улаанбаатар хот
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">
                Жолоочийн мэдээлэл
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Ангилал:</span> B, C
                </p>
                <p>
                  <span className="font-medium">Жолооч болсон:</span> 2015.03.20
                </p>
                <p>
                  <span className="font-medium">Үнэмлэх олгосон:</span>{" "}
                  2020.06.15
                </p>
                <p>
                  <span className="font-medium">Төлөв:</span> Идэвхтэй
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "vehicle",
      label: "Тээврийн хэрэгсэл",
      icon: <Car size={20} />,
      badge: 2,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Тээврийн хэрэгсэл
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Toyota Land Cruiser
                  </h3>
                  <p className="text-sm text-gray-600">2020 он</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Улсын дугаар:</span> 1234АББ
                </p>
                <p>
                  <span className="font-medium">VIN:</span> JT2BF28K123456789
                </p>
                <p>
                  <span className="font-medium">Өнгө:</span> Цагаан
                </p>
                <p>
                  <span className="font-medium">Төрөл:</span> SUV
                </p>
              </div>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Car size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Honda Civic</h3>
                  <p className="text-sm text-gray-600">2018 он</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Улсын дугаар:</span> 5678ВГД
                </p>
                <p>
                  <span className="font-medium">VIN:</span> 1HGBH41JXMN109186
                </p>
                <p>
                  <span className="font-medium">Өнгө:</span> Хар
                </p>
                <p>
                  <span className="font-medium">Төрөл:</span> Sedan
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "insurance",
      label: "Даатгал",
      icon: <Shield size={20} />,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Даатгалын мэдээлэл
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Идэвхтэй даатгал</h3>
              <p className="opacity-90">
                Таны даатгалын хамгаалалт идэвхтэй байна
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Хариуцлагын даатгал
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Даатгалын хэмжээ:</span>{" "}
                    50,000,000₮
                  </p>
                  <p>
                    <span className="font-medium">Хүчинтэй хугацаа:</span>{" "}
                    2025.12.31
                  </p>
                  <p>
                    <span className="font-medium">Төлбөр:</span> 150,000₮/жил
                  </p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Ханиад даатгал
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Даатгалын хэмжээ:</span>{" "}
                    10,000,000₮
                  </p>
                  <p>
                    <span className="font-medium">Хүчинтэй хугацаа:</span>{" "}
                    2025.12.31
                  </p>
                  <p>
                    <span className="font-medium">Төлбөр:</span> 50,000₮/жил
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "documents",
      label: "Баримт",
      icon: <FileText size={20} />,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Баримт, гэрчилгээ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <FileText size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Жолооны үнэмлэх
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Хүчинтэй хугацаа: 2025.12.31
              </p>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Идэвхтэй
              </span>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <FileText size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Тээврийн хэрэгслийн гэрчилгээ
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Хүчинтэй хугацаа: 2026.06.15
              </p>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Идэвхтэй
              </span>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <FileText size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Даатгалын гэрчилгээ
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Хүчинтэй хугацаа: 2025.12.31
              </p>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Идэвхтэй
              </span>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <FileText size={24} className="text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Техникийн шалгалт
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Хүчинтэй хугацаа: 2025.09.30
              </p>
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                3 сар үлдлээ
              </span>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <FileText size={24} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Ханиад даатгал
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Хүчинтэй хугацаа: 2025.12.31
              </p>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Идэвхтэй
              </span>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <FileText size={24} className="text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Нэмэлт баримт
              </h3>
              <p className="text-sm text-gray-600 mb-2">Засвар, захиргаа</p>
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                Нэмэлт
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "payments",
      label: "Төлбөр",
      icon: <CreditCard size={20} />,
      content: (
        <div className="p-6 bg-white rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Төлбөрийн мэдээлэл
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Төлбөрийн төлөв</h3>
              <p className="opacity-90">Таны бүх төлбөр төлөгдсөн байна</p>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">
                    Хариуцлагын даатгал
                  </h4>
                  <span className="text-green-600 font-semibold">
                    Төлөгдсөн
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">150,000₮</span>
                  <span className="text-sm text-gray-500">2025.01.15</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">
                    Ханиад даатгал
                  </h4>
                  <span className="text-green-600 font-semibold">
                    Төлөгдсөн
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">50,000₮</span>
                  <span className="text-sm text-gray-500">2025.01.15</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">
                    Техникийн шалгалт
                  </h4>
                  <span className="text-green-600 font-semibold">
                    Төлөгдсөн
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">25,000₮</span>
                  <span className="text-sm text-gray-500">2024.09.15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Framer Motion Tabbar Menu
          </h1>
          <p className="text-xl text-gray-600">
            Хөдөлгөөнтэй, илүү сайхан харагдах tabbar menu
          </p>
        </div>

        {/* Default Variant */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Default Variant
          </h2>
          <AdvancedAnimatedTabBar
            tabs={tabs.slice(0, 4)}
            defaultTab="home"
            className="mb-8"
          />
        </div>

        {/* Pills Variant */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pills Variant
          </h2>
          <AdvancedAnimatedTabBar
            tabs={tabs.slice(0, 4)}
            variant="pills"
            size="lg"
            defaultTab="profile"
            className="mb-8"
          />
        </div>

        {/* Underline Variant */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Underline Variant
          </h2>
          <AdvancedAnimatedTabBar
            tabs={tabs.slice(0, 4)}
            variant="underline"
            size="md"
            defaultTab="vehicle"
            className="mb-8"
          />
        </div>

        {/* Cards Variant */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Cards Variant
          </h2>
          <AdvancedAnimatedTabBar
            tabs={tabs}
            variant="cards"
            size="lg"
            defaultTab="documents"
            className="mb-8"
          />
        </div>

        {/* Small Size */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Small Size</h2>
          <AdvancedAnimatedTabBar
            tabs={tabs.slice(0, 3)}
            size="sm"
            defaultTab="home"
            className="mb-8"
          />
        </div>
      </div>
    </div>
  );
}
