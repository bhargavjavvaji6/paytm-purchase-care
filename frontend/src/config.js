// Dynamic API base URL:
// 1. In Production (Cloud Run / HTTPS or same-origin port): uses '' (relative path)
// 2. In Local Development (Vite on port 5173 over Wi-Fi / ADB): connects to backend on port 8000
export const API_BASE =
  typeof window !== 'undefined'
    ? window.location.protocol === 'https:' || !window.location.port || window.location.port === '8000' || window.location.port === '8080'
      ? ''
      : window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
      ? `http://${window.location.hostname}:8000`
      : 'http://127.0.0.1:8000'
    : 'http://127.0.0.1:8000';
