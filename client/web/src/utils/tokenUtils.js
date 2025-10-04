
export function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    
    return `${platform} - ${userAgent.split(' ').slice(-2).join(' ')} - ${language}`;
}

// Note: httpOnly cookies can't be read by JavaScript, but that's fine
// The server will read them automatically when we send credentials: 'include'
function getCookie(name) {
    // This function is no longer needed for httpOnly cookies
    // But keeping it for compatibility
    return null;
}

// Function to decode and get token expiration (same as app)
export function getExpiration(token) {
    if (!token || typeof token !== "string") return null;

    try {
        const [, payload] = token.split(".");
        if (!payload) return null;

        const decodedJson = atob(payload);
        const decoded = JSON.parse(decodedJson);

        return decoded.exp ? new Date(decoded.exp * 1000) : null;
    } catch (err) {
        console.error("Failed to decode token:", err);
        return null;
    }
}

// Note: These functions now only READ cookies set by the server
// The server manages setting and clearing cookies with proper httpOnly flags

export async function getAccessToken() {
    // httpOnly cookies can't be read by JavaScript - server handles this automatically
    return null;
}

export async function setAccessToken(token) {
    // No longer needed - server sets cookies
    console.warn('setAccessToken called but tokens are now managed by server');
}

export async function removeAccessToken() {
    // No longer needed - server clears cookies
    console.warn('removeAccessToken called but tokens are now managed by server');
}

export async function getRefreshToken() {
    return getCookie('refreshToken');
}

export async function setRefreshToken(token) {
    // No longer needed - server sets cookies
    console.warn('setRefreshToken called but tokens are now managed by server');
}

export async function removeRefreshToken() {
    // No longer needed - server clears cookies
    console.warn('removeRefreshToken called but tokens are now managed by server');
}

export async function clearAllTokens() {
    // No longer needed - server clears cookies via logout endpoint
    console.warn('clearAllTokens called but tokens are now managed by server');
}
