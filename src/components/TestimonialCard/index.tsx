import { ClientsSection, Stat, Testimonial } from "./testimonial";

// Define the data for the section
const statsData: Stat[] = [
  { value: "100+", label: "Сэтгэл хангалуун үйлчлүүлэгчид" },
  { value: "250M₮", label: "нөхөн төлбөр" },
  { value: "4.8", label: "Дундаж үнэлгээ" },
];

const testimonialsData: Testimonial[] = [
  {
    name: "Бат-Эрдэнэ",
    title: "Авто даатгалын үйлчлүүлэгч",
    quote:
      "Маш хурдан, үр дүнтэй ажилласан. Авто ослын дараа нөхөн төлбөрөө 3 хоногийн дотор хүлээн авлаа. Бүх үйл явц тодорхой, ил тод байсан.",
    avatarSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9uZ29saWFufGVufDB8MnwwfHww",
    rating: 5.0,
  },
  {
    name: "Сүхбат",
    title: "Эрүүл мэндийн даатгалын үйлчлүүлэгч",
    quote:
      "Хүнд өвчний эмчилгээний зардлаа бүрэн нөхөн төлөлт хүлээн авлаа. Даатгалын компани маш сайн ажилласан, бүх бичиг баримтыг хурдан боловсруулсан.",
    avatarSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9uZ29saWFufGVufDB8MnwwfHww",
    rating: 4.9,
  },
  {
    name: "Оюунчимэг",
    title: "Гэр ахуйн даатгалын үйлчлүүлэгч",
    quote:
      "Гэрийн галт тэргийн дараа бүх зардлаа нөхөн төлөлт хүлээн авлаа. Даатгалын компани маш хурдан хариуцсан, бүх үйл явц тодорхой байсан.",
    avatarSrc:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9uZ29saWFufGVufDB8MnwwfHww",
    rating: 4.8,
  },
];

// The demo component that renders the entire section
export default function ClientsSectionDemo() {
  return (
    <ClientsSection
      tagLabel="Сэтгэл хангалуун үйлчлүүлэгчид"
      title="Нөхөн төлбөр авсан хүмүүс"
      description="100+ сэтгэл хангалуун үйлчлүүлэгчидтэй, 250M₮+ нөхөн төлбөр төлсөн."
      stats={statsData}
      testimonials={testimonialsData}
      primaryActionLabel="Холбоо барих"
      secondaryActionLabel="Бүх төслүүд"
    />
  );
}
