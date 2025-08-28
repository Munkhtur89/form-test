import Image from "next/image";
import logo from "../../../public/logo/2.png";
import Link from "next/link";

const Header: React.FC = () => {
  const navItems = [
    {
      name: "Нүүр",
      href: "/",
    },
    {
      name: "Машин даатгал",
      href: "/vehicle-insurance-form",
    },
    {
      name: "Тээврийн хэрэгслийн даатгал",
      href: "/victim-insure",
    },
    {
      name: "Эрүүл мэндийн даатгал",
      href: "/health",
    },
  ];

  return (
    <div className="w-full bg-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo болон нэр */}
          <div className="flex items-center">
            <Image
              src={logo}
              alt="logo"
              width={100}
              height={100}
              objectFit="cover"
              className="w-36 h-36 rounded-full"
            />
          </div>

          {/* Navigation товчнууд */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-[16px] tracking-wider hover:scale-105 font-sans"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
