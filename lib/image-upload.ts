import { createClient } from "@/lib/supabase/client";

// Imagens das matérias: o navegador reduz e otimiza a foto antes de enviar,
// então quem escreve não precisa se preocupar com o peso do arquivo.

export const MAX_RAW_BYTES = 20 * 1024 * 1024;
const MAX_WIDTH = 1920;

export type PreparedImage = {
  blob: Blob;
  extension: string;
  // Medidas da foto original (0 quando não dá para ler, como em SVG).
  originalWidth: number;
  originalHeight: number;
  originalBytes: number;
  finalBytes: number;
};

function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Escolha um arquivo de imagem (JPG, PNG ou WebP).");
  }
  if (file.size > MAX_RAW_BYTES) {
    throw new Error("A imagem passou de 20 MB. Escolha uma menor.");
  }

  const original = {
    blob: file as Blob,
    extension: (file.name.split(".").pop() || "jpg").toLowerCase(),
    originalBytes: file.size,
    finalBytes: file.size,
  };

  // GIF animado e SVG seguem como estão.
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return { ...original, originalWidth: 0, originalHeight: 0 };
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Não consegui abrir essa imagem. Tente outro arquivo (JPG, PNG ou WebP).");
  }

  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return { ...original, originalWidth: bitmap.width, originalHeight: bitmap.height };
  }
  context.drawImage(bitmap, 0, 0, width, height);
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  bitmap.close();

  let blob = await encode(canvas, "image/webp", 0.86);
  let extension = "webp";
  if (!blob || blob.type !== "image/webp") {
    blob = await encode(canvas, "image/jpeg", 0.88);
    extension = "jpg";
  }

  // Só usa a versão otimizada se ela realmente ficou menor (ou foi reduzida).
  if (!blob || (scale === 1 && blob.size >= file.size)) {
    return { ...original, originalWidth, originalHeight };
  }
  return {
    blob,
    extension,
    originalWidth,
    originalHeight,
    originalBytes: file.size,
    finalBytes: blob.size,
  };
}

// Envia para o armazenamento das matérias e devolve o endereço público.
export async function uploadPostImage(
  file: File,
  folder: "covers" | "inline",
): Promise<{ url: string; image: PreparedImage }> {
  const image = await prepareImage(file);
  const supabase = createClient();
  const path = `${folder}/${crypto.randomUUID()}.${image.extension}`;
  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, image.blob, {
      upsert: false,
      contentType: image.blob.type || file.type,
      cacheControl: "31536000",
    });
  if (error) throw new Error("Não foi possível enviar a imagem. Tente de novo.");
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return { url: data.publicUrl, image };
}
