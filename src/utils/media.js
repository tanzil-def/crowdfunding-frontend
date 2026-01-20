
export const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    // Clean up path double slashes if any
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

    // Remove trailing slash from base if present to avoid double slash
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    return `${cleanBase}${cleanPath}`;
};
