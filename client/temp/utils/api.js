//render url
//const baseUrl = "https://finance-manager-m3au.onrender.com/api";
//local url
const baseUrl = "http://192.168.0.152:5500/api";
export async function get(endpoint) {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`);
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

export async function post(endpoint, data) {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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

export async function put(endpoint, data) {
    try {
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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

export async function del(endpoint, data = null) {
    try {
        const options = {
            method: 'DELETE',
        };

        if (data) {
            options.headers = {
                'Content-Type': 'application/json',
            };
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