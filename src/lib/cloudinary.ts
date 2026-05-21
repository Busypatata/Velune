import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  base64: string,
  folder: string = 'velune',
  options: Record<string, unknown> = {}
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(base64, {
    folder,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    ...options,
  })
  return { url: result.secure_url, publicId: result.public_id }
}

export async function uploadAvatar(base64: string, userId: string) {
  return uploadImage(base64, 'velune/avatars', {
    public_id: `avatar_${userId}`,
    overwrite: true,
    transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
  })
}

export async function uploadRecipeImage(base64: string, recipeId: string) {
  return uploadImage(base64, 'velune/recipes', {
    public_id: `recipe_${recipeId}`,
    overwrite: true,
    transformation: [{ width: 800, height: 600, crop: 'fill' }],
  })
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}

export { cloudinary }
