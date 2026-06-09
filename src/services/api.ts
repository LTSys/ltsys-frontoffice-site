import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// A URL base do .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// interceptor para log de requisições 
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {

  // Busca o usuário salvo no localStorage após o login
  const user = localStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    config.headers.Authorization = `Bearer ${parsedUser.token}`;
  }

  // virá no cookie httpOnly automaticamente
  if (import.meta.env.DEV) {
    console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

// (401, 403, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // pega a rota da requisição
    const requestUrl = error.config?.url || "";

    // Se for erro de login, NÃO redireciona
    if (
      error.response?.status === 401 &&
      requestUrl !== "/auth/login"
    ) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);