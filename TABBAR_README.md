# Framer Motion Tabbar Menu Components

Энэ бол framer motion ашигласан хөдөлгөөнтэй tabbar menu компонентуудын багц юм.

## Компонентууд

### 1. AnimatedTabBar

Энгийн хөдөлгөөнтэй tabbar menu компонент.

### 2. AdvancedAnimatedTabBar

Илүү дэлгэрэнгүй болон тохиргоогүй хөдөлгөөнтэй tabbar menu компонент.

## Суулгах

```bash
npm install framer-motion
```

## Хэрэглээ

### AnimatedTabBar

```tsx
import { AnimatedTabBar } from "@/components/ui";

const tabs = [
  {
    id: "home",
    label: "Нүүр",
    icon: <Home size={20} />,
    content: <div>Нүүр хуудасны агуулга</div>,
  },
  {
    id: "profile",
    label: "Профайл",
    icon: <User size={20} />,
    content: <div>Профайлын агуулга</div>,
  },
];

<AnimatedTabBar tabs={tabs} defaultTab="home" className="max-w-2xl mx-auto" />;
```

### AdvancedAnimatedTabBar

```tsx
import { AdvancedAnimatedTabBar } from "@/components/ui";

const tabs = [
  {
    id: "home",
    label: "Нүүр",
    icon: <Home size={20} />,
    content: <div>Нүүр хуудасны агуулга</div>,
  },
  {
    id: "profile",
    label: "Профайл",
    icon: <User size={20} />,
    badge: 3, // Нэмэлт тоо харуулах
    content: <div>Профайлын агуулга</div>,
  },
];

<AdvancedAnimatedTabBar
  tabs={tabs}
  defaultTab="home"
  variant="cards" // "default" | "pills" | "underline" | "cards"
  size="lg" // "sm" | "md" | "lg"
  className="mb-4"
  onTabChange={(tabId) => console.log("Active tab:", tabId)}
/>;
```

## Props

### AnimatedTabBar

| Prop                 | Type     | Default      | Description               |
| -------------------- | -------- | ------------ | ------------------------- |
| `tabs`               | `Tab[]`  | -            | Tab-уудын массив          |
| `defaultTab`         | `string` | `tabs[0].id` | Анхны идэвхтэй tab        |
| `className`          | `string` | `""`         | Нэмэлт CSS класс          |
| `tabClassName`       | `string` | `""`         | Tab-уудын CSS класс       |
| `activeTabClassName` | `string` | `""`         | Идэвхтэй tab-ын CSS класс |
| `indicatorClassName` | `string` | `""`         | Индикаторын CSS класс     |

### AdvancedAnimatedTabBar

| Prop          | Type                                             | Default      | Description                      |
| ------------- | ------------------------------------------------ | ------------ | -------------------------------- |
| `tabs`        | `Tab[]`                                          | -            | Tab-уудын массив                 |
| `defaultTab`  | `string`                                         | `tabs[0].id` | Анхны идэвхтэй tab               |
| `variant`     | `"default" \| "pills" \| "underline" \| "cards"` | `"default"`  | Tab-ын загвар                    |
| `size`        | `"sm" \| "md" \| "lg"`                           | `"md"`       | Tab-ын хэмжээ                    |
| `className`   | `string`                                         | `""`         | Нэмэлт CSS класс                 |
| `onTabChange` | `(tabId: string) => void`                        | -            | Tab солигдох үед дуудагдах функц |

## Tab Object Structure

```tsx
interface Tab {
  id: string; // Tab-ын өвөрмөц ID
  label: string; // Tab-ын текст
  icon?: React.ReactNode; // Tab-ын icon (optional)
  content: React.ReactNode; // Tab-ын агуулга
  badge?: number | string; // Нэмэлт тоо (optional, зөвхөн AdvancedAnimatedTabBar)
}
```

## Variants

### 1. Default

Стандарт загвар - дугуй булантай, саарал дэвсгэртэй.

### 2. Pills

Элсэн хэлбэртэй загвар - бүх булан дугуй.

### 3. Underline

Доод талд зураас хэлбэртэй загвар.

### 4. Cards

Карт хэлбэртэй загвар - илүү том, тод харагдах.

## Sizes

### 1. Small (sm)

Жижиг хэмжээ - `px-3 py-2`, `text-xs`.

### 2. Medium (md)

Дунд хэмжээ - `px-4 py-3`, `text-sm`.

### 3. Large (lg)

Том хэмжээ - `px-6 py-4`, `text-base`.

## Хөдөлгөөнт онцлогууд

- **Spring Animation**: Tab солигдох үед spring хөдөлгөөн
- **Hover Effects**: Mouse hover үед нэмэлт хөдөлгөөн
- **Icon Animation**: Icon-уудын scale, rotate хөдөлгөөн
- **Content Transition**: Агуулгын fade, slide хөдөлгөөн
- **Indicator Movement**: Идэвхтэй tab-ын индикатор хөдөлгөөн

## Жишээ

### Энгийн Tabbar

```tsx
<AnimatedTabBar
  tabs={[
    {
      id: "info",
      label: "Мэдээлэл",
      content: <UserInfo />,
    },
    {
      id: "settings",
      label: "Тохиргоо",
      content: <Settings />,
    },
  ]}
  defaultTab="info"
/>
```

### Тохиргоогүй Tabbar

```tsx
<AdvancedAnimatedTabBar
  tabs={[
    {
      id: "dashboard",
      label: "Хяналтын самбар",
      icon: <Dashboard size={20} />,
      content: <Dashboard />,
    },
    {
      id: "analytics",
      label: "Статистик",
      icon: <BarChart size={20} />,
      badge: 5,
      content: <Analytics />,
    },
  ]}
  variant="pills"
  size="lg"
  onTabChange={(tabId) => setActiveTab(tabId)}
/>
```

## Demo

`/tabbar-demo` хуудас руу орж бүх variant болон size-уудыг харж болно.

## Тохиргоо

### Tailwind CSS

Компонентууд Tailwind CSS ашигладаг тул дараах классуудыг тохируулах хэрэгтэй:

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Custom Styling

Нэмэлт загвар хийх бол `className` prop ашиглаж болно:

```tsx
<AdvancedAnimatedTabBar
  tabs={tabs}
  className="custom-tabbar"
  tabClassName="custom-tab"
  activeTabClassName="custom-active-tab"
  indicatorClassName="custom-indicator"
/>
```

## Хөгжүүлэлт

### Шинэ Variant нэмэх

```tsx
// AdvancedAnimatedTabBar.tsx
const getVariantStyles = () => {
  switch (variant) {
    case "newVariant":
      return {
        container:
          "bg-gradient-to-r from-pink-500 to-yellow-500 rounded-2xl p-2",
        tab: "rounded-xl",
        indicator: "rounded-xl",
      };
    // ... existing variants
  }
};
```

### Шинэ Animation нэмэх

```tsx
// Icon animation
<motion.span
  animate={{
    scale: activeTab === tab.id ? 1.2 : 1,
    rotate: activeTab === tab.id ? 360 : 0,
  }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
  }}
>
  {tab.icon}
</motion.span>
```

## Асуудлыг шийдэх

### Tab солигдохгүй байна

- `tabs` массив зөв эсэхийг шалгах
- `defaultTab` ID зөв эсэхийг шалгах
- Console-д алдаа байгаа эсэхийг шалгах

### Animation ажиллахгүй байна

- `framer-motion` суулгагдсан эсэхийг шалгах
- Browser-ийн console-д алдаа байгаа эсэхийг шалгах

### Styling ажиллахгүй байна

- Tailwind CSS зөв тохируулагдсан эсэхийг шалгах
- CSS class-ууд зөв эсэхийг шалгах

## Холбоо

Асуулт эсвэл санал байвал issue үүсгэнэ үү.
