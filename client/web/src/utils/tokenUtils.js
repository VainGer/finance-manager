
export function getDeviceInfo() {
    const language = navigator.language || navigator.userLanguage;

    if (navigator.userAgentData) {
        const platform = navigator.userAgentData.platform || 'Unknown Platform';
        const brands = navigator.userAgentData.brands
            ?.filter(b => b.brand !== 'Not?A_Brand')
            .map(b => `${b.brand} ${b.version}`)
            .join(', ');
        return `${platform} - ${brands || ''} - ${language}`;
    }

    const ua = navigator.userAgent;
    const lastTwo = ua.split(' ').slice(-2).join(' ');
    return `Unknown Platform - ${lastTwo} - ${language}`;
}

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
