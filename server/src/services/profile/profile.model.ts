import { Profile, ProfileBudget } from "./profile.types";
import { Response, Request } from "express";
import db from "../../server";

export default class ProfileModel {
    private static profileCollection: string = 'profiles';
    private static expensesCollection: string = 'expenses';

    static async createProfile(req: Request, res: Response) {
        try {
            const { username, profileName, parent, pin } = req.body as { username: string, profileName: string, parent: boolean, pin: string };

            const errorMsg = ProfileModel.validateProfileInput(username, profileName, pin);
            if (errorMsg) {
                res.status(400).json({ message: errorMsg, status: 400 });
                return;
            }

            if (await ProfileModel.profileExists(username, profileName)) {
                res.status(409).json({
                    message: "Profile already exists",
                    status: 409
                });
                return;
            }

            const expensesId = await ProfileModel.createExpensesAndGetId(username, profileName);
            if (!expensesId) {
                res.status(500).json({
                    message: "Failed to create expenses document",
                    status: 500
                });
                return;
            }

            const newProfile: Profile = {
                username,
                profileName,
                pin,
                parentProfile: parent,
                createdAt: new Date(),
                updatedAt: new Date(),
                budgets: [],
                expenses: expensesId
            };

            const result = await db.AddDocument(ProfileModel.profileCollection, newProfile);

            if (result?.insertedId) {
                res.status(201).json({
                    message: "Profile created successfully",
                    status: 201,
                    profileId: result.insertedId
                });
                return;
            } else {
                res.status(500).json({
                    message: "Failed to create profile",
                    status: 500
                });
                return;
            }
        } catch (error) {
            console.log("Error creating profile: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }


    public static async validateProfile(req: Request, res: Response) {
        try {
            const { username, profileName, pin } = req.body as { username: string, profileName: string, pin: string };
            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            if (profile.pin !== pin) {
                res.status(401).json({
                    message: "Invalid pin",
                    status: 401
                });
                return;
            }
            else {
                const validatedProfile = {
                    username: profile.username,
                    profileName: profile.profileName,
                    parentProfile: profile.parentProfile
                }
                res.status(200).json({
                    message: "Profile validated successfully",
                    status: 200,
                    profile: validatedProfile
                });
                return;
            }
        } catch (error) {
            console.error("Error validating profile: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    public static async getAllProfiles(req: Request, res: Response) {
        try {
            const username = req.query.username as string;
            if (!username) {
                res.status(400).json({
                    message: "Username is required",
                    status: 400
                });
                return;
            }

            const profilesDB = await db.GetDocuments(ProfileModel.profileCollection, { username });

            if (!profilesDB || profilesDB.length === 0) {
                res.status(404).json({
                    message: "No profiles found for ProfileModel user",
                    status: 404
                });
                return;
            }
            const profiles = profilesDB.map(profile => ({
                profileName: profile.profileName,
                parentProfile: profile.parentProfile
            }));
            res.status(200).json({
                message: "Profiles retrieved successfully",
                status: 200,
                profiles
            });
        } catch (error) {
            console.error("Error retrieving profiles: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    public static async renameProfile(req: Request, res: Response) {
        try {
            const { username, oldProfileName, newProfileName } = req.body as { username: string, oldProfileName: string, newProfileName: string };

            if (!username || !oldProfileName || !newProfileName) {
                res.status(400).json({
                    message: "missing required fields",
                    status: 400
                });
                return;
            }

            const existingProfile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName: oldProfileName });
            if (!existingProfile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }

            const updatedProfile = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName: oldProfileName }, { $set: { profileName: newProfileName } });
            if (!updatedProfile || updatedProfile.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to rename profile",
                    status: 500
                });
                return;
            }
            if (updatedProfile.modifiedCount > 0) {
                res.status(200).json({
                    message: "Profile renamed successfully",
                    status: 200
                });
            }
        } catch (error) {
            console.error("Error renaming profile: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    public static async changeProfilePin(req: Request, res: Response) {
        try {
            const { username, profileName, oldPin, newPin } = req.body as
                { username: string, profileName: string, oldPin: string, newPin: string };
            if (!username || !profileName || !oldPin || !newPin) {
                res.status(400).json({
                    message: "Missing required fields",
                    status: 400
                });
                return;
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }

            if (profile.pin !== oldPin) {
                res.status(401).json({
                    message: "Old pin not matching",
                    status: 401
                });
                return;
            }

            const updatedProfile = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName }, { $set: { pin: newPin, updatedAt: new Date() } });
            if (!updatedProfile || updatedProfile.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to change profile pin",
                    status: 500
                });
                return;
            } else {
                res.status(200).json({
                    message: "Profile pin changed successfully",
                    status: 200
                });
                return;
            }
        } catch (error) {
            console.error("Error changing profile pin: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    public static async deleteProfile(req: Request, res: Response) {
        try {
            const { username, profileName, pin } = req.body as { username: string, profileName: string, pin: string };
            const errorMsg = ProfileModel.validateProfileInput(username, profileName, pin);
            if (errorMsg) {
                res.status(400).json({ message: errorMsg, status: 400 });
                return;
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }

            if (profile.pin !== pin) {
                res.status(401).json({
                    message: "Invalid pin",
                    status: 401
                });
                return;
            }

            const deleteResult = await db.DeleteDocument(ProfileModel.profileCollection, { username, profileName });
            if (!deleteResult || deleteResult.deletedCount === 0) {
                res.status(500).json({
                    message: "Failed to delete profile",
                    status: 500
                });
                return;
            } else {
                res.status(200).json({
                    message: "Profile deleted successfully",
                    status: 200
                });
            }
        } catch (error) {
            console.error("Error deleting profile: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    public static async setAvatar(req: Request, res: Response) {
        try {
            const { username, profileName, avatar } = req.body as { username: string, profileName: string, avatar: string };
            if (!username || !profileName || !avatar) {
                res.status(400).json({
                    message: "Username, profile name, and avatar are required",
                    status: 400
                });
                return;
            }
            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            const result = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName }, { $set: { avatar } });
            if (!result || result.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to set avatar",
                    status: 500
                });
                return;
            }
            res.status(200).json({
                message: "Avatar set successfully",
                status: 200
            });
        } catch (error) {
            console.error("Error setting avatar: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    public static async setColor(req: Request, res: Response) {
        try {
            const { username, profileName, color } = req.body as { username: string, profileName: string, color: string };
            if (!username || !profileName || !color) {
                res.status(400).json({
                    message: "Username, profile name, and color are required",
                    status: 400
                });
                return;
            }
            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            const result = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName }, { $set: { color } });
            if (!result || result.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to set profile color",
                    status: 500
                });
                return;
            }
            res.status(200).json({
                message: "Profile color set successfully",
                status: 200
            });
        } catch (error) {
            console.error("Error setting profile color: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    public static async createProfileBudget(req: Request, res: Response) {
        try {
            const { username, profileName, budget } = req.body as { username: string, profileName: string, budget: ProfileBudget };
            if (!username || !profileName || budget === undefined) {
                res.status(400).json({
                    message: "Username, profile name, and budget are required",
                    status: 400
                });
                return;
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }

            const result = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName }, { $push: { budgets: budget } });

            if (!result || result.modifiedCount === 0) {
                res.status(500).json({
                    message: "Failed to create profile budget",
                    status: 500
                });
                return;
            }

            res.status(201).json({
                message: "Profile budget created successfully",
                status: 201
            });
        } catch (error) {
            console.error("Error creating profile budget: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    public static async getProfileBudgets(req: Request, res: Response) {
        try {
            const { username, profileName } = req.query as { username: string, profileName: string };
            if (!username || !profileName) {
                res.status(400).json({
                    message: "Username and profile name are required",
                    status: 400
                });
                return;
            }
            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName }, { projection: { budgets: 1 } });
            if (!profile || !profile.budgets) {
                res.status(404).json({
                    message: "Profile not found",
                    status: 404
                });
                return;
            }
            res.status(200).json({
                message: "Profile budgets retrieved successfully",
                status: 200,
                budgets: profile.budgets
            });
        } catch (error) {
            console.error("Error retrieving profile budgets: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
        }
    }

    // Helper methods

    private static validateProfileInput(username?: string, profileName?: string, pin?: string) {
        if (!username) return "Username is required";
        if (!profileName) return "Profile name is required";
        if (!pin) return "Pin is required";
        return null;
    }

    private static async profileExists(username: string, profileName: string) {
        const existingProfile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
        return !!existingProfile;
    }

    private static async createExpensesAndGetId(username: string, profileName: string) {
        try {

            const res = await db.AddDocument(ProfileModel.expensesCollection, {
                username,
                profileName,
                categories: []
            });
            return res?.insertedId ?? null;
        } catch (error) {
            console.error("Error creating expenses document: ", error);
            return null;
        }
    }
}