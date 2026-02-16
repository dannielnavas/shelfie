/**
 * URL base del API.
 * - En desarrollo con Expo Go: usa la IP de tu Mac en la red local (ej: 192.168.x.x).
 * - Para obtener tu IP: en terminal ejecuta `ipconfig getifaddr en0` (Mac) o revisa en Ajustes de tu router.
 * - Opcional: crea un archivo .env en la raíz con EXPO_PUBLIC_API_URL=http://TU_IP:3000
 */
export const API_BASE_URL =
  typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://192.168.10.96:3000";

export const api = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
  },
  user: {
    me: `${API_BASE_URL}/api/users/me`,
  },
  books: {
    getBooks: `${API_BASE_URL}/api/books`,
    searchBooks: `${API_BASE_URL}/api/books/search?q=`,
    searchByISBN: `${API_BASE_URL}/api/books/search?isbn=`,
  },
} as const;
