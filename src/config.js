// Auto-detect the correct backend URL based on how the site is accessed
const getApiBaseUrl = () => {
  const { hostname, port, pathname } = window.location;

  // If accessing via Vite dev server, use the proxy defined in vite.config.js
  // We assume any port other than 80/443 on localhost is a dev server
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (port && port !== '80' && port !== '443') {
      return '/api';
    }
  }

  // If accessing via production build on Laragon
  const pathParts = pathname.split('/');
  const projectFolder = pathParts[1];

  // If we are in a subfolder (like /isogoods_web/)
  if (projectFolder && projectFolder !== 'backend' && !projectFolder.includes('.')) {
    return `/${projectFolder}/backend`;
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
