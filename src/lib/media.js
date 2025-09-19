// src/lib/media.js - Updated for Cloudinary integration
import api from "./api";

/** Upload single image to Cloudinary */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    id: Date.now() + Math.random(), // For local state management
    url: data.secure_url,
    publicId: data.public_id,
    name: file.name,
    size: data.bytes,
    format: data.format
  };
}

/** Upload multiple files to Cloudinary */
export async function uploadMediaMany(files) {
  const uploadPromises = Array.from(files).map(file => 
    uploadImage(file).catch(error => ({
      error: error.message,
      fileName: file.name
    }))
  );
  
  const results = await Promise.all(uploadPromises);
  
  // Separate successful uploads from errors
  const successful = results.filter(result => !result.error);
  const failed = results.filter(result => result.error);
  
  if (failed.length > 0) {
    console.warn('Some uploads failed:', failed);
  }
  
  return successful;
}

/** Upload single file via backend API (if you prefer backend handling) */
export async function uploadMediaOne(file) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/media", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** Delete image from Cloudinary via backend */
export async function deleteImage(publicId) {
  const response = await api.delete(`/media/${publicId}`);
  return response.data;
}

/** Get optimized image URL */
export function getOptimizedImageUrl(publicId, options = {}) {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;
  
  return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
}