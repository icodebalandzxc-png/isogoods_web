// Auto-detect the correct backend URL based on how the site is accessed
const getApiBaseUrl = () => {
  const { hostname, port } = window.location;

  // If accessing via Vite dev server, use the proxy defined in vite.config.js
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (port && port !== '80' && port !== '443') {
      return '/api';
    }
  }

  // PRODUCTION LOGIC
  // If we are on a known production domain (like InfinityFree), use absolute root path
  // This avoids issues with React Router paths (like /menu) being interpreted as subfolders
  if (hostname.includes('infinityfreeapp.com') || hostname.includes('github.io')) {
    return '/backend';
  }

  // Fallback for Laragon/Local subfolder development (e.g., localhost/isogoods_web/)
  const pathname = window.location.pathname;
  if (pathname.includes('/isogoods_web/')) {
    return '/isogoods_web/backend';
  }

  return '/backend';
};

export const API_BASE_URL = getApiBaseUrl();

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Remove leading slash if present to avoid //
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};
