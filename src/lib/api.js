// import axios from 'axios';
// import toast from 'react-hot-toast';

// const API_VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_VITE_BACKEND_URL,
//   timeout: 15000,
//   headers: { 'Content-Type':'application/json' },
// });

// // Add token if you use auth store; keep noop if not
// api.interceptors.request.use((config)=>{
//   try{
//     const raw = localStorage.getItem('tg_user_token');
//     if (raw) config.headers.Authorization = `Bearer ${raw}`;
//   }catch{}
//   return config;
// });

// api.interceptors.response.use(
//   (res)=>res,
//   (error)=>{
//     const msg = error?.response?.data?.message || 'Something went wrong';
//     const code = error?.response?.status;
//     if (code && code >= 500) toast.error('Server error. Please try again.');
//     else if (![401,403,404].includes(code)) toast.error(msg);
//     return Promise.reject(error);
//   }
// );

// export default api;
