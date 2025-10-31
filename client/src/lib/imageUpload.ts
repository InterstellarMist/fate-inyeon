const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "";

export async function uploadImageToImgBB(file: File): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key not configured");
  }

  // Convert file to base64
  const base64 = await fileToBase64(file);

  // Upload to ImgBB
  const formData = new FormData();
  formData.append("key", IMGBB_API_KEY);
  formData.append("image", base64);

  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image to ImgBB");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Failed to upload image");
  }

  // Return the image URL
  return data.data.url;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix if present
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
