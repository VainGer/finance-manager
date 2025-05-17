import { insertProfile, findProfileByName, renameProfileName, changePinCode, deleteOneProfile, getProfileList } from "./user.db.js";

export async function createProfile(username, profileName, pin, parent) {
    const foundProfile = await findProfileByName(username, profileName);
    if (foundProfile) {
        console.log("Profile already exists");
        return false;
    }
    const newProfile = {
        profileName: profileName,
        pin: Number(pin),
        parent: parent,
        expenses: {
            budgets: [],
            categories: []
        }
    };
    const result = await insertProfile(username, newProfile);
    console.log("Profile created");
    return result;
}

export async function renameProfile(username, profileName, pin, newProfileName) {
    const foundProfile = await findProfileByName(username, profileName);
    if (!foundProfile) {
        console.log("Profile not found");
        return false;
    }
    if (foundProfile.pin !== Number(pin)) {
        console.log("Wrong pin code");
        return false;
    }
    const result = await renameProfileName(username, profileName, newProfileName);
    if (result) {
        console.log("Profile renamed successfully");
    } else {
        console.log("Failed to rename profile");
    }
    return result;
}

export async function changePin(username, profileName, pin, newPin) {
    const foundProfile = await findProfileByName(username, profileName);
    if (!foundProfile) {
        console.log("Profile not found");
        return false;
    }
    if (foundProfile.pin !== Number(pin)) {
        console.log("Wrong pin code");
        return false;
    }
    const result = await changePinCode(username, profileName, Number(newPin));
    if (result) {
        console.log("Pin code changed successfully");
    } else {
        console.log("Failed to change pin code");
    }
    return result;
}

export async function deleteProfile(username, profileName, pin) {
    const foundProfile = await findProfileByName(username, profileName);
    if (!foundProfile) {
        console.log("Profile not found");
        return false;
    }
    if (foundProfile.pin !== Number(pin)) {
        console.log("Wrong pin code");
        return false;
    }
    const result = await deleteOneProfile(username, profileName);
    if (result) {
        console.log("Profile deleted successfully");
    } else {
        console.log("Failed to delete profile");
    }
    return result;
}

export async function openProfile(username, profileName, pin) {
    const foundProfile = await findProfileByName(username, profileName);
    if (!foundProfile) {
        console.log("Profile not found");
        return false;
    }
    if (foundProfile.pin !== Number(pin)) {
        console.log("Wrong pin code");
        return false;
    }
    console.log("Profile opened");
    return true;
}

export async function getProfiles(username) {
    const allProfiles = await getProfileList(username);
    const profiles = allProfiles.map(profile => {
        return {
            name: profile.profileName,
            parent: profile.parent
        }
    });
    return profiles;
}