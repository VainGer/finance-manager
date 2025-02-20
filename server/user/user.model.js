import { readFile, writeFile } from "fs/promises";

export async function createProfile(username, profileName, pin, parent) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profiles = data.profiles;
        if (profiles.length === 0) {
            parent = true;
        }
        if (profiles.find(p => p.pName === profileName)) {
            console.log("profile name exist");
            return false;
        }
        let profile = {
            "pName": profileName,
            "parent": parent,
            "pin": pin,
            "expenses": {
                "categories": [
                    {
                        "categoryName": "uncategorized",
                        "private": false,
                        "items": []
                    }
                ]
            }
        };
        data.profiles.push(profile);
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        console.log(profileName + " was added");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function renameProfile(username, profileName, newProfileName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        profile.pName = newProfileName;
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function changePin(username, profileName, pin, newPin) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        if (profile.pin === pin) {
            console.log("hehe")
            profile.pin = newPin;
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function deleteProfile(username, profileName, pin) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        if (profile.pin === pin) {
            data.profiles = data.profiles.filter(p => p.pName !== profileName);
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            console.log("Profile deleted");
            return true;
        }
        console.log("Pofile wasn't deleted");
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function openProfile(username, profileName, pin) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName && p.pin === pin);
        if (profile) {
            return profile;
        }
        console.log("Incorrect pin");
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function getProfiles(username) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profiles = [];
        data.profiles.forEach(p => {
            profiles.push(p.pName);
        });
        return profiles;
    } catch (error) {
        console.log(error);
        return false;
    }
}