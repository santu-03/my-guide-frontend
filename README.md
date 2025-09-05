
# 🧭 Tour Guide Frontend

A sleek, performant SPA for discovering tours, booking trips, and managing profiles — built with **React**, **Vite**, and **Tailwind CSS**. Optimized for fast loads, modern DX, and smooth integration with the backend API.

<p align="left">
  <a href="#"><img alt="Vite" src="https://img.shields.io/badge/Vite-frontend-646CFF?logo=vite&logoColor=white"></a>
  <a href="#"><img alt="React" src="https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black"></a>
  <a href="#"><img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white"></a>
  <a href="#"><img alt="License" src="https://img.shields.io/badge/License-MIT-green"></a>
</p>

---

## ✨ Features

* **Responsive, mobile-first UI** with Tailwind
* **Blazing-fast HMR & builds** via Vite
* **Component-driven** React architecture
* **Client-side routing** with React Router
* **Typed env support** via `import.meta.env` (`VITE_*`)
* **API integration** with fetch/Axios, token handling, error boundaries
* **Production-friendly** SPA fallback configs for Vercel/Netlify

---

## 🧱 Tech Stack

* **React 18+**
* **Vite** (dev server & bundler)
* **Tailwind CSS** (utility-first)
* **React Router**
* **Axios** or **fetch** (pick one)
* **ESLint + Prettier** (optional but recommended)

---

## 📁 Project Structure

```
tour-guide-frontend/
├─ public/                     # Static assets
├─ src/
│  ├─ components/              # Reusable UI building blocks
│  ├─ lib/                     # API client, helpers, constants
│  │   ├─ api.js               # Axios/fetch wrapper
│  │   └─ storage.js           # token helpers (get/set/remove)
│  ├─ pages/                   # Route-level pages
│  ├─ routes/                  # Router config
│  │   └─ index.jsx
│  ├─ store/                   # Context/Reducer/Zustand (optional)
│  ├─ styles/                  # Tailwind layers, globals (optional)
│  ├─ index.css                # Tailwind base/components/utilities
│  └─ main.jsx                 # React entry
├─ .env                        # NOT committed (use .env.example)
├─ .gitignore
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
└─ vite.config.js
```

---

## 🔧 Getting Started

### Prerequisites

* **Node.js v18+** (recommended)
* Backend API base URL

### Install

```bash
git clone https://github.com/yourusername/tour-guide-frontend.git
cd tour-guide-frontend
npm install
```

### Environment Variables

Create a `.env` in the project root:

```env
# .env
VITE_API_URL=https://your-backend-api-url.com
# Optional:
# VITE_SENTRY_DSN=
# VITE_GA_ID=
```

> Vite only exposes variables prefixed with `VITE_`. Access them with `import.meta.env.VITE_API_URL`.

### Run (Dev)

```bash
npm run dev
# App: http://localhost:5173
```

### Build (Prod)

```bash
npm run build
npm run preview   # serves dist/ locally for testing
```

---

## 🧭 Routing

**`src/routes/index.jsx`**

```jsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetails from "../pages/TourDetails";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "tours", element: <Tours /> },
      { path: "tours/:id", element: <TourDetails /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
```

---

## 🌐 API Client (example)

**`src/lib/api.js`**

```js
import axios from "axios";
import { getToken } from "./storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // if you use cookies; otherwise remove
});

// attach JWT if present
api.interceptors.request.use((config) => {
  const token = getToken(); // e.g., localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// unwrap data / centralize errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Optionally route 401 to login, show toasts, etc.
    return Promise.reject(err?.response?.data ?? err);
  }
);

export default api;
```

**`src/lib/storage.js`**

```js
const KEY = "tg_token";
export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);
```

Usage:

```js
import api from "@/lib/api";
const tours = await api.get("/api/places?limit=12");
```

---

## 🧹 Code Quality (optional)

Add these scripts if you’re using ESLint/Prettier:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write ."
  }
}
```

---

## 🚀 Deployment

### Vercel

* Set **Environment Variables** in project settings (`VITE_API_URL`, etc.)
* SPA fallback handled automatically; ensure framework preset is **Vite**.

**Optional `vercel.json`** (only if you need explicit rewrites):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Netlify

Create `public/_redirects` with:

```
/*  /index.html  200
```

Set env vars in Netlify UI (Site settings → Build & deploy → Environment).

### GitHub Pages

Vite + GH Pages requires base path config and a deploy step. Consider Vercel/Netlify for simpler SPA routing.

---

## 🔒 Security Notes

* Never commit real `.env` files — only `.env.example`.
* Only expose non-sensitive client config via `VITE_*`.
* Treat access/refresh tokens securely (HTTP-only cookies preferred; if using `localStorage`, understand XSS implications).

---

## ♿ Accessibility & ⚡ Performance

* Use semantic HTML and ARIA where needed.
* Prefer responsive images (`<img srcSet>`/`sizes`), lazy-loading, and code-splitting.
* Run Lighthouse locally (Chrome DevTools) before deploys.

---

## 🧰 Troubleshooting

* **Blank page after deploy**: Add SPA fallback (`_redirects` on Netlify / rewrites on Vercel).
* **CORS errors**: Allow your frontend origin on the backend (`CORS_ORIGIN`).
* **Env not read**: Ensure keys begin with `VITE_` and server restarted after changes.

---

## 📄 License

MIT License

---

## 👤 Author

**Your Name** — [GitHub](https://github.com/santu-03) · [LinkedIn](https://www.linkedin.com/in/santu-pramanik-03sp/)


