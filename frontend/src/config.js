// Dynamic API base URL: automatically detects host whether accessed via localhost,
// LAN IP (e.g., http://172.31.98.52:5173 on mobile Wi-Fi), or USB ADB port forwarding.
export const API_BASE = (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? `http://${window.location.hostname}:8000`
  : 'http://127.0.0.1:8000';

