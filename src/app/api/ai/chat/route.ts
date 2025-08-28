import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Мессеж оруулаагүй байна" },
        { status: 400 }
      );
    }

    // OpenAI API-д илгээх мессежүүдийг бэлтгэх
    const messages = [
      {
        role: "system",
        content: `Та бол Монгол улсын даатгалын салбарын мэргэжлийн туслах. 
        Таны үндсэн үүрэг нь хэрэглэгчдэд даатгалын талаар тусламж үзүүлэх, 
        асуултуудад хариулах, мэдээлэл өгөх юм. 
        
        Та дараах даатгалын төрлүүдийн талаар мэдээлэлтэй:
        - Тээврийн хэрэгслийн даатгал
        - Албан журмын даатгал  
        - Эрүүл мэндийн даатгал
        - Өрхийн даатгал
        - Арилжааны даатгал
        
        **Бичиг баримт шалгах чадвар:**
        - Хэрэглэгч илгээсэн бичиг баримтыг шинжилж үзэх
        - Баримт бичгийн бүрэн бүтэн байдлыг шалгах
        - Алдаа, дутагдалтай хэсгүүдийг тодорхойлох
        - Шаардлагатай засваруудыг санал болгох
        - Баримт бичгийн зөв эсэхийг шалгах
        
        **Нөхөн төлбөр авах заавар:**
        1. Даатгалын гэрээ, баримт бичгийг бэлтгэх
        2. Даатгалын компанид холбогдох (утас, имэйл, вэбсайт)
        3. Шаардлагатай баримт бичгүүдийг илгээх
        4. Нөхөн төлбөрийн хэмжээг тооцоолох
        5. Төлбөр хүлээн авах
        
        **Зөвөлгөө:**
        - Даатгалын төрөл сонгохдоо хэрэгцээ, хэмжээг анхаарах
        - Хэд хэдэн компанийн санал авах
        - Даатгалын нөхцөл, хязгаарлалтыг сайтар уншиж үзэх
        - Тогтмол даатгалтай байх
        - Хяналт, шинэчлэлтийг хийх
        - Бичиг баримтыг сайтар шалгаж, алдааг засах
        - Шаардлагатай баримт бичгүүдийг бүрэн бэлтгэх
        
        Хэрэглэгчийн асуултад товч, тодорхой, ойлгомжтой хариулт өгнө үү.
        Монгол хэл дээр хариулна уу.`,
      },
      ...history.map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API алдаа:", errorData);
      throw new Error(`OpenAI API алдаа: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse =
      data.choices[0]?.message?.content ||
      "Уучлаарай, хариулахад алдаа гарлаа.";

    return NextResponse.json({
      response: aiResponse,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Chat API алдаа:", error);
    return NextResponse.json(
      {
        error: "Серверийн алдаа гарлаа",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
