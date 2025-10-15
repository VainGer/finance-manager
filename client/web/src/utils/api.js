// BACKUP - WORKING VERSION WITH LOCALSTORAGE  
// Date: 2025-10-01
// Status: WORKING - All API calls functional, profile data loading works

//render url
const baseUrl = "https://finance-manager-m3au.onrender.com/api";
//local url
// const baseUrl = "http://localhost:5500/api";

const getHeaders = async (secure = true) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    // No need to add Authorization header anymore - cookies handle this
    return headers;
};

export async function get(endpoint, secure = true) {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: 'GET',
            headers: await getHeaders(secure),
            credentials: 'include' // Include cookies in requests
        });
        const result = await response.json();
        return {
            status: response.status,
            ok: response.ok,
            ...result
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function post(endpoint, data, secure = true) {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: await getHeaders(secure),
            body: JSON.stringify(data),
            credentials: 'include' // Include cookies in requests
        });
        const result = await response.json();

        return {
            status: response.status,
            ok: response.ok,
            ...result
        };
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

export async function put(endpoint, data, secure = true) {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: 'PUT',
            headers: await getHeaders(secure),
            body: JSON.stringify(data),
            credentials: 'include' // Include cookies in requests
        });
        const result = await response.json();
        return {
            status: response.status,
            ok: response.ok,
            ...result
        };
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

export async function del(endpoint, data = null, secure = true) {
    try {
        const options = {
            headers: await getHeaders(secure),
            method: 'DELETE',
            credentials: 'include' // Include cookies in requests
        };

        if (data) {
            options.headers = await getHeaders(secure);
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${baseUrl}/${endpoint}`, options);
        const result = await response.json();
        return {
            status: response.status,
            ok: response.ok,
            ...result
        };
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}
