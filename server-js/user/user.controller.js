import { createProfile, getProfiles, deleteProfile, changePin, renameProfile, openProfile } from './user.model.js';

export async function createProfileC(req, res) {
    const { username, profileName, pin, parent = false } = req.body;
    try {
        const success = await createProfile(username, profileName, pin, parent);
        if (success) {
            res.status(201).json({
                message: 'Profile created successfully',
                status: 201
            });
        } else {
            res.status(400).json({
                message: 'Failed to create profile, profile may already exist',
                status: 400
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            status: 500
        });
    }
}

export async function renameProfileC(req, res) {
    const { username, profileName, pin, newProfileName } = req.body;
    try {
        const renamed = await renameProfile(username, profileName, pin, newProfileName);
        if (renamed) {
            res.status(200).json({
                message: `Profile name: ${profileName} was changed to ${newProfileName}`,
                status: 200
            });
        } else {
            res.status(400).json({
                message: `Failed to rename profile. Profile may not exist or PIN may be incorrect.`,
                status: 400
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            status: 500
        });
    }
}

export async function changePinC(req, res) {
    const { username, profileName, pin, newPin } = req.body;
    try {
        const changed = await changePin(username, profileName, pin, newPin);
        if (changed) {
            res.status(200).json({
                message: `PIN code was changed successfully`,
                status: 200
            });
        } else {
            res.status(400).json({
                message: `Failed to change PIN code. Profile may not exist or current PIN may be incorrect.`,
                status: 400
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            status: 500
        });
    }
}

export async function deleteProfileC(req, res) {
    const { username, profileName, pin } = req.body;
    try {
        const success = await deleteProfile(username, profileName, pin);
        if (success) {
            res.status(200).json({
                message: 'Profile deleted successfully',
                status: 200
            });
        } else {
            res.status(400).json({
                message: 'Failed to delete profile. Profile may not exist or PIN may be incorrect.',
                status: 400
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            status: 500
        });
    }
}

export async function openProfileC(req, res) {
    const { username, profileName, pin } = req.body;
    try {
        const result = await openProfile(username, profileName, pin);
        if (result) {
            res.status(200).json({
                message: "Profile opened successfully",
                status: 200,
                success: true
            });
        } else {
            res.status(401).json({
                message: "Failed to open profile. Profile may not exist or PIN may be incorrect.",
                status: 401,
                success: false
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            status: 500
        });
    }
}

export async function getProfilesC(req, res) {
    const { username } = req.body;
    try {
        const profiles = await getProfiles(username);
        if (profiles && profiles.length > 0) {
            res.status(200).json({
                message: 'Profiles retrieved successfully',
                profiles: profiles,
                status: 200
            });
        } else {
            res.status(404).json({
                message: 'No profiles found',
                profiles: [],
                status: 404
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            status: 500
        });
    }
}