import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Бүх датааг console.log-д харуулах
    console.log("=== Health PDF API-д ирж байгаа бүх дата ===");
    console.log("Form data:", JSON.stringify(data, null, 2));

    // HTML агуулга үүсгэх
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>ЖАРГАЛАН ЭРҮҮЛ МЭНДИЙН ДААТГАЛ</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 12px; 
              line-height: 1.6;
              color: #333;
            }
            .title { 
              font-size: 24px; 
              text-align: center; 
              font-weight: bold; 
              margin-bottom: 30px; 
              color: #142a68;
            }
            .section { 
              margin-bottom: 20px; 
              border-bottom: 1px solid #eee;
              padding-bottom: 15px;
            }
            .section-title { 
              font-size: 16px; 
              font-weight: bold; 
              margin-bottom: 15px; 
              color: #142a68;
            }
            .text { 
              font-size: 12px; 
              margin-bottom: 8px; 
            }
            .signature { 
              margin-top: 40px; 
              text-align: right; 
              border-top: 1px solid #ccc;
              padding-top: 20px;
            }
            .date {
              margin-bottom: 20px;
              font-weight: bold;
            }
            .attachments {
              margin-top: 20px;
              border: 1px solid #ddd;
              padding: 15px;
              background-color: #f9f9f9;
            }
            .attachment-item {
              margin-bottom: 10px;
              padding: 8px;
              border-left: 3px solid #142a68;
              background-color: white;
            }
            .image-preview {
              text-align: center;
            }
            .image-preview img {
              display: block;
              margin: 0;
              width: 100%;
              height: auto;
              box-shadow: none;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .data-table th {
              background-color: #362e52;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
              border: 1px solid #ddd;
              font-size: 12px;
            }
            .data-table td {
              padding: 6px 12px;
              border: 1px solid #ddd;
              background-color: #f9f9f9;
              font-size: 11px;
            }
            .data-table tr:nth-child(even) td {
              background-color: #f0f0f0;
            }
            .data-table { page-break-before: auto; page-break-after: auto; }
            
            /* Гурван үндсэн хэсгийг нэг хуудсанд хамт багцлах */
            .main-info-sections {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .main-info-sections .section {
              margin-bottom: 15px;
            }
            .main-info-sections .section:last-child {
              margin-bottom: 0;
            }
            
            /* Хавсралтууд хэсгийг шинэ хуудснаас эхлүүлэх */
            .attachments-section {
              page-break-before: always;
              break-before: page;
            }

          </style>
        </head>
        <body>
          <div class="title">ЖАРГАЛАН ЭРҮҮЛ МЭНДИЙН ДААТГАЛ</div>

          ${
            data.contractInfo || data.materialInfo || data.bankInfo
              ? `
            <div class="section main-info-sections">
              <div class="section-title">Үндсэн мэдээлэл</div>
              <table class="data-table">
                <tr>
                  <th>Талбар</th>
                  <th>Утга</th>
                </tr>
                ${
                  data.contractInfo
                    ? `
                <tr>
                  <td><strong>Гэрээний дугаар</strong></td>
                  <td>${data.contractInfo.contractNumber || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Эхлэх огноо</strong></td>
                  <td>${data.contractInfo.startDate || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Дуусах огноо</strong></td>
                  <td>${data.contractInfo.endDate || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Өмчлөгчийн регистр</strong></td>
                  <td>${data.contractInfo.ownerRegister || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Саб дугаар</strong></td>
                  <td>${data.contractInfo.branchNumber || "Байхгүй"}</td>
                </tr>`
                    : ""
                }
                ${
                  data.materialInfo
                    ? `
                <tr>
                  <td><strong>Утасны дугаар</strong></td>
                  <td>${data.materialInfo.phoneNumber || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Мэйл хаяг</strong></td>
                  <td>${data.materialInfo.mail || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Эмнэлгийн нэр</strong></td>
                  <td>${data.materialInfo.hospitalName || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Эмнэлэгт үзүүлсэн огноо</strong></td>
                  <td>${data.materialInfo.hospitalVisitDate || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Нэхэмжлэх дүн</strong></td>
                  <td>${
                    data.materialInfo.invoicedAmount
                      ? data.materialInfo.invoicedAmount.toLocaleString("mn-MN")
                      : "Байхгүй"
                  }</td>
                </tr>`
                    : ""
                }
                ${
                  data.bankInfo
                    ? `
                <tr>
                  <td><strong>Банк</strong></td>
                  <td>${
                    data.bankInfo.driverBankId
                      ? `Банк ID: ${data.bankInfo.driverBankId}`
                      : "Байхгүй"
                  }</td>
                </tr>
                <tr>
                  <td><strong>Дансны дугаар</strong></td>
                  <td>${data.bankInfo.driverBankAccount || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Дансны эзэний нэр</strong></td>
                  <td>${data.bankInfo.driverBankAccountName || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Дансны эзэний овог</strong></td>
                  <td>${data.bankInfo.bankAccountLastname || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Дансны эзэний регистр</strong></td>
                  <td>${data.bankInfo.bankAccountRegnum || "Байхгүй"}</td>
                </tr>`
                    : ""
                }
              </table>
            </div>
          `
              : ""
          }

          ${
            data.attachments && data.attachments.length > 0
              ? `
            <div class="section attachments-section">
              <div class="section-title">Хавсралтууд</div>
              <div class="attachments">
                ${data.attachments
                  .map(
                    (attachment: Record<string, unknown>) => `
                  <div class="attachment-item">
                    <div class="text text-bold">Нэр: ${
                      attachment.fileName || attachment.name || "Байхгүй"
                    }</div>
                    <div class="text">Ангилал: ${
                      attachment.category || "Хавсралт"
                    }</div>
                    ${
                      attachment.url &&
                      typeof attachment.url === "string" &&
                      attachment.url.startsWith("data:image")
                        ? `<div class="image-preview">
                        <img src="${attachment.url}" alt="${
                            attachment.fileName || attachment.name || "Зураг"
                          }" style="width: 100%; height: auto; max-width: 100%; border: 1px solid #ddd; margin-top: 15px;" />
                      </div>`
                        : attachment.image_base64
                        ? `<div class="image-preview">
                        <img src="data:image/png;base64,${
                          attachment.image_base64
                        }" alt="${
                            attachment.fileName || attachment.name || "Зураг"
                          }" style="width: 100%; height: auto; max-width: 100%; border: 1px solid #ddd; margin-top: 15px;" />
                      </div>`
                        : ""
                    }
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }

          <div class="signature">
      <div class="date">Хугацаа: ${new Date().toLocaleDateString("mn-MN")}</div>
          </div>
        </body>
      </html>
    `;

    // Puppeteer ашиглан PDF үүсгэх
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // HTML агуулгыг хуудас руу оруулах
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // PDF үүсгэх
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "5mm",
        right: "5mm",
        bottom: "5mm",
        left: "5mm",
      },
      printBackground: true,
    });

    await browser.close();

    // PDF Response буцаах
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="jargalan-eruul-mendiin-daatgal.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Health PDF үүсгэхэд алдаа гарлаа:", error);
    return NextResponse.json(
      {
        error: "Health PDF үүсгэхэд алдаа гарлаа",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
