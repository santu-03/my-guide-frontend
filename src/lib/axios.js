// import axios from "axios";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
//   headers: { "Content-Type": "application/json" },
//   withCredentials: false,
// });

// // Attach token automatically if present
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//   if (token && !config.headers.Authorization) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
