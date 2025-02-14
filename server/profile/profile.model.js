import { readFile, writeFile } from "fs/promises";

export async function addProfile(username, profileName, pin, parent) {
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