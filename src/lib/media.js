// src/lib/media.js
import api from "@/lib/api";

/** Upload multiple files to /api/media/many (returns array of docs with .url) */
export async function uploadMediaMany(files) {
  const fd = new FormData();
  [...files].forEach((f) => fd.append("files", f));
  const { data } = await api.post("/media/many", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return Array.isArray(data) ? data : [];
}

/** Upload single file to /api/media (returns one doc with .url) */
export async function uploadMediaOne(file) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/media", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
