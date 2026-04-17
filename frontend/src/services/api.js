import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 20000
});

export async function fetchConfig() {
  const response = await api.get('/config');
  return response.data;
}

export async function quickScan(payload = {}) {
  const response = await api.post('/quick-scan', payload);
  return response.data;
}

export async function fetchNews(params = {}) {
  const response = await api.get('/news', { params });
  return response.data;
}

export async function fetchGeoInsights(params = {}) {
  const response = await api.get('/geo-insights', { params });
  return response.data;
}

export async function fetchDebug() {
  const response = await api.get('/debug');
  return response.data;
}

export default api;
