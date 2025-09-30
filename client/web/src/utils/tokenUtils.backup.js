// BACKUP - WORKING VERSION WITH LOCALSTORAGE
// Date: 2025-10-01
// Status: WORKING - Authentication, profile loading, expenses display all functional

export function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    
    return `${platform} - ${userAgent.split(' ').slice(-2).join(' ')} - ${language}`;
}

export async function getAccessToken() {
    return localStorage.getItem('accessToken');
}

export async function setAccessToken(token) {
    if (token) {
        localStorage.setItem('accessToken', token);
    }
}

export async function removeAccessToken() {
    console.log('REMOVING ACCESS TOKEN');
    console.trace();
    localStorage.removeItem('accessToken');
}

export async function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

export async function setRefreshToken(token) {
    if (token) {
        localStorage.setItem('refreshToken', token);
    }
}

export async function removeRefreshToken() {
    localStorage.removeItem('refreshToken');
}
