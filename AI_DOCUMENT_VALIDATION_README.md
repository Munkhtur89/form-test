# AI Системт Баримт Бичгийн Нийцэл Шалгах Систем

Энэ систем нь даатгалын хэрэглэгчийн илгээсэн баримт бичгийн зургуудыг AI ашиглан автоматаар шалгаж, зөв эсэхийг тодорхойлж, асуудлыг илрүүлж, санал болгож буй засваруудыг харуулдаг.

## Онцлогууд

### 🔍 Автомат Баримт Бичгийн Төрөл Тодорхойлолт

- Жолоочийн үнэмлэх
- Тээврийн хэрэгслийн бүртгэл
- Ослын зураг
- Цагдаагийн тайлан
- Эмнэлгийн тайлан

### 🤖 AI Шалгалт

- Зургийн чанарын шалгалт
- Баримт бичгийн бүрэн бүтэн байдлын шалгалт
- Олдсон мэдээллийн нарийвчлал
- Асуудлын илрүүлэлт
- Засварын санал

### 📊 Дэлгэрэнгүй Тайлан

- Найдвартай байдлын хувь
- Асуудлын жагсаалт
- Санал болгож буй засварууд
- Олдсон мэдээллийн дэлгэрэнгүй

## Суулгах заавар

### 1. Хадгалагдах файлууд

```bash
# AI API endpoint
src/app/api/ai/document-validation/route.ts

# Үндсэн форм
src/app/victim-insure/page.tsx
```

### 2. Environment Variables

`.env.local` файлд дараах мэдээллийг нэмнэ үү:

```env
# OpenAI API Key (GPT-4 Vision ашиглахын тулд)
OPENAI_API_KEY=your_openai_api_key_here

# Эсвэл өөр AI сервис
AZURE_COMPUTER_VISION_KEY=your_azure_key_here
GOOGLE_CLOUD_VISION_KEY=your_google_key_here
```

### 3. Dependencies

```bash
npm install
# Эсвэл
yarn install
```

## Ашиглах заавар

### 1. Баримт бичиг хавсаргах

- Формын `FileUpload` хэсэгт баримт бичгийн зургуудыг хавсаргана
- Файлын нэрэнд баримт бичгийн төрлийг тодорхой болгоно уу

### 2. AI шалгалт эхлүүлэх

- "AI ашиглан баримт бичгийн нийцэл шалгах" товчийг дарна
- Систем автоматаар бүх баримт бичгийг шалгана

### 3. Үр дүнг харах

- Шалгалтын үр дүнг дэлгэрэнгүй харна
- Асуудлыг засварлана
- Шаардлагатай бол дахин шалгалт хийнэ

## AI API Тохиргоо

### OpenAI GPT-4 Vision (Хамгийн сайн)

```typescript
// src/app/api/ai/document-validation/route.ts
if (process.env.OPENAI_API_KEY) {
  return await validateWithOpenAI(imageBase64, documentType, fileName);
}
```

### Azure Computer Vision

```typescript
// Azure Computer Vision ашиглах
async function validateWithAzure(
  imageBase64: string,
  documentType: DocumentType
) {
  const response = await fetch(
    `https://your-resource.cognitiveservices.azure.com/vision/v3.2/analyze`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_COMPUTER_VISION_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: Buffer.from(imageBase64, "base64"),
    }
  );
  // Хариуг парслах
}
```

### Google Cloud Vision

```typescript
// Google Cloud Vision ашиглах
async function validateWithGoogle(
  imageBase64: string,
  documentType: DocumentType
) {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_VISION_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageBase64 },
            features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
          },
        ],
      }),
    }
  );
  // Хариуг парслах
}
```

## Баримт бичгийн төрлүүд

### 🚗 Жолоочийн үнэмлэх

- Нэр, овог
- Төрсөн огноо
- Хүчинтэй хугацаа
- Ангилал

### 🚙 Тээврийн хэрэгслийн бүртгэл

- Улсын дугаар
- Регистрийн дугаар
- Эзэмшигчийн мэдээлэл
- Техникийн үзүүлэлт

### 📸 Ослын зураг

- Ослын төрөл
- Хэмжээ
- Тээврийн хэрэгслүүд
- Газрын байршил

### 👮 Цагдаагийн тайлан

- Тайлангийн дугаар
- Огноо
- Газр
- Тайлбар

### 🏥 Эмнэлгийн тайлан

- Эмнэлгийн нэр
- Огноо
- Онош
- Эмчилгээ

## Алдааны мэдээл

### Түгээмэл алдаанууд

1. **API Key олдсонгүй**: Environment variables шалгана уу
2. **Зураг хэт том**: Зургийг шахаж, хэмжээг багасгана уу
3. **Формат буруу**: JPEG, PNG форматыг ашиглана уу
4. **Сүлжээний алдаа**: Интернэт холболтыг шалгана уу

### Засварын арга

1. Environment variables файлыг шалгах
2. API key-ийн хүчинтэй байдлыг шалгах
3. Зургийн хэмжээг багасгах
4. Дахин оролдох

## Хөгжүүлэлтийн санал

### Ирээдүйн онцлогууд

- [ ] Олон хэл дэмжлэг
- [ ] Real-time шалгалт
- [ ] Machine learning model training
- [ ] Mobile app дэмжлэг
- [ ] Cloud storage integration

### Гүйцэтгэлийн сайжруулалт

- [ ] Image caching
- [ ] Batch processing
- [ ] Async validation
- [ ] Progress indicators

## Холбоо ба дэмжлэг

Хэрэв асуулт эсвэл санал байвал:

- GitHub Issues ашиглана уу
- Email: support@example.com
- Documentation: /docs

## Лиценз

MIT License - эрх чөлөөтэй ашиглах боломжтой
