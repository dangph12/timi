import ky from "ky";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const FOLDER = "timi/character-design";

export async function uploadCharacterDesign(dataUrl) {
  const form = new FormData();
  form.append("file", dataUrl);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", FOLDER);

  const res = await ky
    .post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      body: form,
    })
    .json();
  return res.secure_url;
}
