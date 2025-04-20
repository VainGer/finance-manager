import { getDB } from "../db.js";

const db = await getDB();

export async function insertProfile(username, profile) {
    try {
        const currentProfileCollection = db.collection(`${username}_profiles`);
        currentProfileCollection.insertOne({ profile });
        return true;
    } catch (error) {
        console.error("Error inserting profile:", error);
        throw error;
    }
}

export async function findProfileByName(username, profileName) {
    try {
        const currentProfileCollection = db.collection(`${username}_profiles`);
        const profileDoc = await currentProfileCollection.findOne({ "profile.profileName": profileName });
        return profileDoc ? profileDoc.profile : null;
    } catch (error) {
        console.error("Error finding profile:", error);
        throw error;
    }
}

export async function renameProfileName(username, profileName, newProfileName) {
    try {
        const currentProfileCollection = db.collection(`${username}_profiles`);
        const result = await currentProfileCollection.updateOne(
            { "profile.profileName": profileName },
            { $set: { "profile.profileName": newProfileName } }
        );
        return result.acknowledged;
    } catch (error) {
        console.error("Error renaming profile:", error);
        throw error;
    }
}

export async function changePinCode(username, profileName, newPin) {
    try {
        const currentProfileCollection = db.collection(`${username}_profiles`);
        const result = await currentProfileCollection.updateOne(
            { "profile.profileName": profileName },
            { $set: { "profile.pin": newPin } }
        );
        return result.acknowledged;
    } catch (error) {
        console.error("Error changing pin:", error);
        throw error;
    }
}

export async function deleteOneProfile(username, profileName) {
    try {
        const currentProfileCollection = db.collection(`${username}_profiles`);
        const result = await currentProfileCollection.deleteOne({ "profile.profileName": profileName });
        return result.acknowledged;
    } catch (error) {
        console.error("Error deleting profile:", error);
        throw error;
    }
}

export async function getProfileList(username) {
    try {
        const currentProfileCollection = db.collection(`${username}_profiles`);
        const profilesDoc = await currentProfileCollection.find({}).toArray();
        let profiles = profilesDoc.map((doc) => {
            return doc.profile;
        });
        return profiles;
    } catch (error) {
        console.error("Error getting profile list:", error);
        throw error;
    }
}