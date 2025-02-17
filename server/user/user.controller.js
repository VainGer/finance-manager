import { changePin, createProfile, deleteProfile, renameProfile } from "./user.model.js";

export async function addProfile(req, res) {
    let { username, profileName, pin, parent } = req.body;
    let added = await createProfile(username, profileName, pin, parent);
    if (added) {
        res.status(200).json({
            message: `Profile ${profileName} added`
        });
    } else {
        res.status(401).json({
            message: `Profile ${profileName} wasnt added`
        });
    }
}

export async function rename(req, res) {
    let { username, profileName, newProfileName } = req.body;
    let renamed = await renameProfile(username, profileName, newProfileName);
    if (renamed) {
        res.status(200).json({
            message: `Profile name: ${profileName} was changed to ${newProfileName}`
        });
    } else {
        res.status(401).json({
            message: `Profile name wasn't changed`
        });
    }
}

export async function changePinCode(req, res) {
    let { username, profileName, pin, newPin } = req.body;
    let deleted = await changePin(username, profileName, pin, newPin);
    if (deleted) {
        res.status(200).json({
            message: `Pin code was changed`
        });
    } else {
        res.status(401).json({
            message: `Pin code wasn't changed`
        });
    }
}

export async function deleteP(req, res) {
    let { username, profileName, pin } = req.body;
    let deleted = await deleteProfile(username, profileName, pin);
    if (deleted) {
        res.status(200).json({
            message: `Profile ${profileName} was deleted`
        });
    } else {
        res.status(401).json({
            message: `Profile ${profileName} wasn't deleted`
        });
    }
}