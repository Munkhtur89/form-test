# Prompt Components System

Энэ систем нь том prompt-уудыг жижиг, дахин ашиглах боломжтой хэсгүүдэд хувааж, AI-д илүү хурдан, үр дүнтэй хариулт авах боломжийг олгодог.

## Давуу талууд

### 1. **Хурд**

- Том prompt-уудыг жижиг хэсгүүдэд хувааснаар AI-г боловсруулах хугацаа багасна
- Зөвхөн шаардлагатай компонентуудыг ашиглах боломжтой

### 2. **Дахин ашиглах боломж**

- Prompt components-ийг өөр өөр хослолуудаар ашиглах боломжтой
- Шинэ компонентуудыг хялбархан нэмэх боломжтой

### 3. **Удирдах хялбар**

- Компонентуудыг категориор нь бүлэглэх
- ID-гаар нь хялбархан олох, засах боломжтой

## Файлын бүтэц

```
src/lib/
├── promptComponents.ts    # Prompt components систем
└── ai.ts                 # AI функцүүд (шинэчлэгдсэн)

src/components/
└── PromptComponentDemo.tsx  # Demo компонент
```

## Ашиглалт

### 1. Үндсэн функцүүд

```typescript
import {
  analyzeDocumentWithComponents,
  combinePromptComponents,
} from "../lib/ai";

// Сонгосон компонентуудаар шинжилгээ хийх
const result = await analyzeDocumentWithComponents(imageUrl, [
  "document-type",
  "penalty-document",
  "court-document",
]);

// Prompt components-ийг нэгтгэх
const combinedPrompt = combinePromptComponents([
  "document-type",
  "penalty-document",
]);
```

### 2. Тусгай функцүүд

```typescript
import {
  analyzePenaltyDocument,
  analyzeCourtDocument,
  analyzeDriverInfo,
  analyzeAccidentAct,
  analyzePoliceReport,
  analyzeDocumentComprehensive,
} from "../lib/ai";

// Шийтгэлийн хуудасны шинжилгээ
const penaltyResult = await analyzePenaltyDocument(imageUrl);

// Шүүхийн баримтын шинжилгээ
const courtResult = await analyzeCourtDocument(imageUrl);

// Бүрэн шинжилгээ (бүх компонентууд)
const comprehensiveResult = await analyzeDocumentComprehensive(imageUrl);
```

### 3. Prompt Components удирдлага

```typescript
import {
  promptComponents,
  getPromptComponentsByCategory,
  getPromptComponentById,
  addPromptComponent,
  removePromptComponent,
} from "../lib/promptComponents";

// Бүх компонентуудыг авах
const allComponents = promptComponents;

// Категориор нь бүлэглэх
const documentAnalysis = getPromptComponentsByCategory("document-analysis");

// ID-гаар нь олох
const component = getPromptComponentById("penalty-document");

// Шинэ компонент нэмэх
addPromptComponent({
  id: "new-component",
  name: "Шинэ компонент",
  category: "document-analysis",
  description: "Шинэ компонентийн тайлбар",
  content: "Компонентийн агуулга",
});

// Компонент устгах
removePromptComponent("component-id");
```

## Prompt Components жагсаалт

### Document Analysis Category

1. **document-type** - Баримтын төрлийн таних
2. **penalty-document** - Шийтгэлийн хуудасны таних
3. **court-document** - Шүүхийн баримтын таних
4. **driver-info** - Жолоочийн мэдээллийн таних
5. **measurement-drawing** - Хэмжилтийн зургийн таних
6. **accident-act** - Ослын актын таних
7. **accident-conclusion** - Ослын дүгнэлтийн таних
8. **police-report** - Цагдааны тодорхойлолтын таних
9. **witness-statement** - Хөндлөнгийн гэрчээрийн таних
10. **official-note** - Эрх бүхий албан тушаалтны тэмдэглэлийн таних
11. **accident-case-description** - Зам тээврийн ослын хэргийн тайлбарын таних
12. **contract** - Гэрээний таних
13. **photo-evidence** - Гэрэл зургийн үзүүлэлтийн таних
14. **police-accident-photo** - Цагдааны ослын зургийн таних

## Жишээ ашиглалт

### 1. Зөвхөн шийтгэлийн хуудасны шинжилгээ

```typescript
const result = await analyzePenaltyDocument(imageUrl);
```

### 2. Олон компонентыг нэгтгэж шинжилгээ

```typescript
const result = await analyzeDocumentWithComponents(imageUrl, [
  "document-type",
  "penalty-document",
  "driver-info",
]);
```

### 3. Бүрэн шинжилгээ

```typescript
const result = await analyzeDocumentComprehensive(imageUrl);
```

## Шинэ компонент нэмэх

```typescript
import { addPromptComponent } from "../lib/promptComponents";

// Шинэ компонент үүсгэх
const newComponent = {
  id: "custom-document",
  name: "Хувийн баримт",
  category: "document-analysis",
  description: "Хувийн баримтын таних",
  content: `
**Хувийн баримтын онцлог:**
- Тусгай шинж тэмдгүүд
- Таних аргачлал
- Жишээ мэдээлэл
  `,
};

// Компонент нэмэх
addPromptComponent(newComponent);
```

## Гүйцэтгэлийн харьцуулалт

### Өмнө (том prompt)

- Prompt урт: ~50KB
- Боловсруулах хугацаа: 5-10 секунд
- Санах ойн ашиглалт: Өндөр

### Одоо (components)

- Prompt урт: 1-5KB (сонгосон компонентоос хамаарч)
- Боловсруулах хугацаа: 1-3 секунд
- Санах ойн ашиглалт: Бага

## Демо ашиглалт

`PromptComponentDemo` компонентийг ашиглаж, prompt components системийн бүх боломжуудыг туршиж үзэх боломжтой:

```typescript
import PromptComponentDemo from "../components/PromptComponentDemo";

// Demo компонентийг ашиглах
<PromptComponentDemo imageUrl="path/to/image.jpg" />;
```

## Дүгнэлт

Prompt Components систем нь:

- ✅ AI хариулах хурдыг сайжруулна
- ✅ Prompt-уудыг удирдах хялбар болгоно
- ✅ Дахин ашиглах боломжийг нэмэгдүүлнэ
- ✅ Системийн гүйцэтгэлийг сайжруулна
- ✅ Шинэ функционал нэмэх хялбар болгоно
