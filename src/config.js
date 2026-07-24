// Auto-detect the correct backend URL based on how the site is accessed
const getApiBaseUrl = () => {
  const { hostname, port } = window.location;

  // If accessing via Vite dev server (e.g. localhost:5173 or 192.168.x.x:5173)
  if (port === '5173') {
    return `http://${hostname}/isogoods_web/backend`;
  }

  // If accessing via production build on Laragon (e.g. localhost/isogoods_web)
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
