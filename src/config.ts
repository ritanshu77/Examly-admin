const getApiBaseUrl = () => {
  let url = import.meta.env.API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');
  if (!url) {
    console.error('[ADMIN] API_BASE_URL is not set in environment variables');
    return '';
  }
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

console.log('[ADMIN] API_BASE_URL =', API_BASE_URL);
