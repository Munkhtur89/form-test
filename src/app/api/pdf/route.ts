import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Бүх датааг console.log-д харуулах
    console.log("=== PDF API-д ирж байгаа бүх дата ===");
    console.log("Form data:", JSON.stringify(data, null, 2));

    // Attachments дотор байгаа зургуудыг дэлгэрэнгүй харуулах
    if (data.attachments && data.attachments.length > 0) {
      console.log("=== Attachments дотор байгаа зургууд ===");
      data.attachments.forEach(
        (attachment: Record<string, unknown>, index: number) => {
          console.log(`Attachment ${index + 1}:`, {
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
            url: attachment.url,
            fullData: attachment,
          });
        }
      );
    } else {
      console.log("Attachments байхгүй байна");
    }

    // HTML агуулга үүсгэх
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>МАНДАЛ ДААТГАЛ</title>
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
          <div class="title">МАНДАЛ ДААТГАЛ</div>


          ${
            data.contractInfo ||
            data.vehicleInfo ||
            data.driverInfo ||
            data.bankInfo ||
            data.victimInfo
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
                  <td><strong>Арлын дугаар</strong></td>
                  <td>${data.contractInfo.serialNumber || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Бүтээгдэхүүн</strong></td>
                  <td>${data.contractInfo.contractProductName || "Байхгүй"}</td>
                </tr>`
                    : ""
                }
                ${
                  data.vehicleInfo
                    ? `
                <tr>
                  <td><strong>Марк</strong></td>
                  <td>${data.vehicleInfo.brand || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Модель</strong></td>
                  <td>${data.vehicleInfo.model || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Улсын дугаар</strong></td>
                  <td>${data.vehicleInfo.plateNumber || "Байхгүй"}</td>
                </tr>`
                    : ""
                }
                ${
                  data.driverInfo
                    ? `
                <tr>
                  <td><strong>Жолоочийн нэр</strong></td>
                  <td>${data.driverInfo.name || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Жолоочийн регистр</strong></td>
                  <td>${data.driverInfo.registrationNumber || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Жолоочийн утас</strong></td>
                  <td>${data.driverInfo.phone || "Байхгүй"}</td>
                </tr>`
                    : ""
                }
                ${
                  data.bankInfo
                    ? `
                <tr>
                  <td><strong>Банк</strong></td>
                  <td>${data.bankInfo.bankName || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Дансны дугаар</strong></td>
                  <td>${data.bankInfo.accountNumber || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Банкны регистр</strong></td>
                  <td>${data.bankInfo.bankRegNum || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Банкны нэр</strong></td>
                  <td>${data.bankInfo.bankLastname || "Байхгүй"}</td>
                </tr>`
                    : ""
                }
                ${
                  data.victimInfo
                    ? `
                <tr>
                  <td><strong>Хохирогчийн нэр</strong></td>
                  <td>${data.victimInfo.name || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Хохирогчийн регистр</strong></td>
                  <td>${data.victimInfo.registrationNumber || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Хохирогчийн улсын дугаар</strong></td>
                  <td>${data.victimInfo.xplateNumber || "Байхгүй"}</td>
                </tr>
                <tr>
                  <td><strong>Хохирогчийн утас</strong></td>
                  <td>${data.victimInfo.phone || "Байхгүй"}</td>
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
                      attachment.name || "Байхгүй"
                    }</div>
          
                   
                    <div class="text">Ангилал: ${
                      attachment.category || "Байхгүй"
                    }</div>
                    ${
                      attachment.url &&
                      typeof attachment.url === "string" &&
                      attachment.url.startsWith("data:image")
                        ? `<div class="image-preview">
                        <img src="${attachment.url}" alt="${
                            attachment.name || "Зураг"
                          }" style="width: 100%; height: auto; max-width: 100%; border: 1px solid #ddd; margin-top: 15px;" />
                      </div>`
                        : attachment.url &&
                          typeof attachment.url === "string" &&
                          attachment.url.length > 100
                        ? `<div class="image-preview">
                        <img src="data:image/png;base64,${
                          attachment.url
                        }" alt="${
                            attachment.name || "Зураг"
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
        "Content-Disposition": 'attachment; filename="mandal-daatgal.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF үүсгэхэд алдаа гарлаа:", error);
    return NextResponse.json(
      {
        error: "PDF үүсгэхэд алдаа гарлаа",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
