/**
 * Зураг resize хийх функц
 * @param file - Resize хийх файл
 * @param maxWidth - Хамгийн их өргөн (default: 1024)
 * @param maxHeight - Хамгийн их өндөр (default: 1024)
 * @param quality - Чанар (0-1, default: 0.8)
 * @returns Promise<File> - Resize хийгдсэн файл
 */
export const resizeImage = (
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img") as HTMLImageElement;

    img.onload = () => {
      // Зургийн хэмжээг тооцоолох
      let { width, height } = img;

      // Хэмжээг хязгаарлах
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Canvas хэмжээг тохируулах
      canvas.width = width;
      canvas.height = height;

      // Зургийг canvas дээр зурах
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Canvas-аас blob үүсгэх
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Шинэ файл үүсгэх
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            resolve(file); // Алдаа гарвал анхны файлыг буцаана
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      resolve(file); // Алдаа гарвал анхны файлыг буцаана
    };

    img.src = URL.createObjectURL(file);
  });
};
