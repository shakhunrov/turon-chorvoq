import axios from 'axios';

// admin.tisedu.uz (new-turon) — yangiliklar va kategoriyalar shu backend'ga
// ko'chirildi (eski school.gennis.uz o'rniga). Token'lari axiosInstance.js
// dagi asosiy login'dan mustaqil: bu yerda alohida saqlanadi, chunki ikki
// tizim boshqa-boshqa foydalanuvchi bazasiga ega (SMM akkaunti bo'lmagan
// filial admini asosiy tizimga kira olishi kerak, faqat yangiliklarni
// tahrirlay olmaydi).
const BASE_URL = 'https://admin.tisedu.uz/api/v1';
const ACCESS_KEY = 'tis_admin_access_token';
const REFRESH_KEY = 'tis_admin_refresh_token';

export const getAdminTisAccess = () => localStorage.getItem(ACCESS_KEY);
export const isAdminTisAuthed = () => !!getAdminTisAccess();
export const clearAdminTisTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

// Admin (login qilgan) foydalanuvchi uchun admin.tisedu.uz 401 qaytarsa — sessiya
// yaroqsiz: ikkala tizimning tokenlarini o'chirib, login sahifasiga qaytaramiz.
// Oddiy tashrifchilar (asosiy login yo'q) — jamoat yangiliklari endpointi ochiq,
// ularga tegmaymiz.
const isAdminSession = () => !!getAdminTisAccess() || !!localStorage.getItem('access_token');
const forceRelogin = (wasAdmin) => {
  if (!wasAdmin) return;
  clearAdminTisTokens();
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  if (window.location.pathname !== '/admin') window.location.href = '/admin';
};

// FastAPI OAuth2PasswordRequestForm — form-urlencoded, {access_token, refresh_token}
export async function loginAdminTis(username, password) {
  const body = new URLSearchParams({ username, password });
  const { data } = await axios.post(`${BASE_URL}/auth/login`, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  localStorage.setItem(ACCESS_KEY, data.access_token);
  if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
  return data;
}

const adminTisApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

adminTisApi.interceptors.request.use((config) => {
  const access = getAdminTisAccess();
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  failedQueue = [];
};

adminTisApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const wasAdmin = isAdminSession();
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) {
      clearAdminTisTokens();
      forceRelogin(wasAdmin);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return adminTisApi(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
      localStorage.setItem(ACCESS_KEY, data.access_token);
      if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
      processQueue(null, data.access_token);
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return adminTisApi(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAdminTisTokens();
      forceRelogin(wasAdmin);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default adminTisApi;
