import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";

export function getDeviceInfo() {
    return `${Device.manufacturer || "Unknown"} ${Device.modelName || "Unknown"} - ${`${Device.osName} ${Device.osVersion || ""}`.trim()}`;
}

export async function getAccessToken() {
    return await SecureStore.getItemAsync("accessToken");
}

export async function setAccessToken(token) {
    await SecureStore.setItemAsync("accessToken", token);
}

export async function removeAccessToken() {
    await SecureStore.deleteItemAsync("accessToken");
}

export async function getRefreshToken() {
    return await SecureStore.getItemAsync("refreshToken");
}

export async function setRefreshToken(token) {
    await SecureStore.setItemAsync("refreshToken", token);
}

export async function removeRefreshToken() {
    await SecureStore.deleteItemAsync("refreshToken");
}



