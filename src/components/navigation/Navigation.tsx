"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Mandal Form
          </Link>
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md ${
                pathname === "/"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Нүүр
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
