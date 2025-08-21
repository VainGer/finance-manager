import { Platform } from 'react-native';

function isEmulator() {
    if (Platform.OS === 'android') {
        return (
            Platform.constants.Brand === 'google' ||
            Platform.constants.Manufacturer === 'Google' ||
            Platform.constants.Fingerprint.includes('generic') ||
            Platform.constants.Model.includes('sdk') ||
            Platform.constants.Model.includes('Emulator') ||
            Platform.constants.Model.includes('Android SDK')
        );
    }
    if (Platform.OS === 'ios') {
        return Platform.constants.model.includes('Simulator');
    }
    return false;
}

function getBaseUrl() {
    if (Platform.OS === 'android' && isEmulator()) {
        return "http://10.0.2.2:5500/api";
    }
    if (Platform.OS === 'ios' && isEmulator()) {
        return "http://localhost:5500/api";
    }
    return "http://192.168.0.151:5500/api";
}

const baseUrl = getBaseUrl();
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