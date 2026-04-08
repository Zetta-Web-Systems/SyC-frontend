export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function readFileAsUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CroppedAreaPixels,
  outputSize: number = 256,
  quality: number = 0.8,
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = outputSize;
  canvas.height = outputSize;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], "avatar.jpg", {
          type: "image/jpeg",
        });
        resolve(file);
      },
      "image/jpeg",
      quality,
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export function validateImageFile(
  file: File,
  maxSizeMB: number = 5,
): string | null {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    return "Por favor selecciona una imagen válida (JPEG, PNG, WebP o GIF)";
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `La imagen no puede exceder ${maxSizeMB}MB`;
  }

  return null;
}
