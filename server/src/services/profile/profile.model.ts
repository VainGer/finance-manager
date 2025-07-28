import { Profile, ProfileBudget } from "./profile.types";
import { Response, Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import db from "../../server";

export default class ProfileModel {
    private static profileCollection: string = 'profiles';
    private static expensesCollection: string = 'expenses';



    static async createProfile(req: Request, res: Response) {
        try {
            const { username, profileName, pin, parentProfile, color, avatar } = req.body as Profile;

            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, pin, parentProfile });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }

            if (await ProfileModel.profileExists(username, profileName)) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile already exists"
                }, undefined, 409);
            }

            const expensesId = await ProfileModel.createExpensesAndGetId(username, profileName);
            if (!expensesId) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to create expenses document"
                }, undefined, 500);
            }

            let avatarUrl: string | undefined;
            if (avatar) {
                try {
                    const uploadResult = await cloudinary.uploader.upload(avatar, {
                        folder: 'profile_avatars',
                    });
                    avatarUrl = uploadResult.secure_url;
                } catch (cloudinaryError) {
                    console.error("Cloudinary upload error: ", cloudinaryError);
                    return ProfileModel.formatResponse(res, {
                        message: "Failed to upload avatar image"
                    }, undefined, 500);
                }
            }


            const newProfile: Profile = {
                username,
                profileName,
                pin,
                parentProfile,
                color,
                avatar: avatarUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
                budgets: [],
                expenses: expensesId
            };

            const result = await db.AddDocument(ProfileModel.profileCollection, newProfile);

            if (result?.insertedId) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile created successfully",
                    profileId: result.insertedId
                }, "profileId", 201);
            } else {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to create profile"
                }, undefined, 500);
            }
        } catch (error) {
            console.log("Error creating profile: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }


    public static async validateProfile(req: Request, res: Response) {
        try {
            const { username, profileName, pin } = req.body as { username: string, profileName: string, pin: string };

            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, pin });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }

            if (profile.pin !== pin) {
                return ProfileModel.formatResponse(res, {
                    message: "Invalid pin"
                }, undefined, 401);
            }

            const validatedProfile = {
                profileName: profile.profileName,
                parentProfile: profile.parentProfile,
                avatar: profile.avatar,
                expenses: profile.expenses,
            };

            return ProfileModel.formatResponse(res, {
                message: "Profile validated successfully",
                profile: validatedProfile
            }, "profile", 200);
        } catch (error) {
            console.error("Error validating profile: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    public static async getAllProfiles(req: Request, res: Response) {
        try {
            const username = req.query.username as string;

            if (!username) {
                return ProfileModel.formatResponse(res, {
                    message: "Username is required"
                }, undefined, 400);
            }

            const profilesDB = await db.GetDocuments(ProfileModel.profileCollection, { username });
            if (!profilesDB || profilesDB.length === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "No profiles found for this user",
                    profiles: []
                }, "profiles", 200);
            }

            const profiles = profilesDB.map(profile => ({
                profileName: profile.profileName,
                parentProfile: profile.parentProfile,
                avatar: profile.avatar,
                color: profile.color
            }));

            return ProfileModel.formatResponse(res, {
                message: "Profiles retrieved successfully",
                profiles
            }, "profiles", 200);
        } catch (error) {
            console.error("Error retrieving profiles: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    public static async renameProfile(req: Request, res: Response) {
        try {
            const { username, oldProfileName, newProfileName } = req.body as { username: string, oldProfileName: string, newProfileName: string };

            const errorMsg = ProfileModel.validateRequiredFields({ username, oldProfileName, newProfileName });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }

            const existingProfile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName: oldProfileName });
            if (!existingProfile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }

            const updatedProfile = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName: oldProfileName }, { $set: { profileName: newProfileName } });

            if (!updatedProfile || updatedProfile.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to rename profile"
                }, undefined, 500);
            }

            return ProfileModel.formatResponse(res, {
                message: "Profile renamed successfully"
            }, undefined, 200);
        } catch (error) {
            console.error("Error renaming profile: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    public static async changeProfilePin(req: Request, res: Response) {
        try {
            const { username, profileName, oldPin, newPin } = req.body as
                { username: string, profileName: string, oldPin: string, newPin: string };

            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, oldPin, newPin });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }

            if (profile.pin !== oldPin) {
                return ProfileModel.formatResponse(res, {
                    message: "Old pin not matching"
                }, undefined, 401);
            }

            const updatedProfile = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName }, { $set: { pin: newPin, updatedAt: new Date() } });

            if (!updatedProfile || updatedProfile.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to change profile pin"
                }, undefined, 500);
            }

            return ProfileModel.formatResponse(res, {
                message: "Profile pin changed successfully"
            }, undefined, 200);
        } catch (error) {
            console.error("Error changing profile pin: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    public static async deleteProfile(req: Request, res: Response) {
        try {
            const { username, profileName, pin } = req.body as { username: string, profileName: string, pin: string };

            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, pin });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }

            if (profile.pin !== pin) {
                return ProfileModel.formatResponse(res, {
                    message: "Invalid pin"
                }, undefined, 401);
            }

            const deleteResult = await db.DeleteDocument(ProfileModel.profileCollection, { username, profileName });
            if (!deleteResult || deleteResult.deletedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to delete profile"
                }, undefined, 500);
            }

            return ProfileModel.formatResponse(res, {
                message: "Profile deleted successfully"
            }, undefined, 200);
        } catch (error) {
            console.error("Error deleting profile: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    public static async setAvatar(req: Request, res: Response) {
        try {
            const { username, profileName, avatar } = req.body as { username: string, profileName: string, avatar: string };

            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, avatar });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }

            const result = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName }, { $set: { avatar } });

            if (!result || result.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to set avatar"
                }, undefined, 500);
            }

            return ProfileModel.formatResponse(res, {
                message: "Avatar set successfully"
            }, undefined, 200);
        } catch (error) {
            console.error("Error setting avatar: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    public static async setColor(req: Request, res: Response) {
        try {
            const { username, profileName, color } = req.body as { username: string, profileName: string, color: string };

            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, color });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }

            const result = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName }, { $set: { color } });

            if (!result || result.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to set profile color"
                }, undefined, 500);
            }

            return ProfileModel.formatResponse(res, {
                message: "Profile color set successfully"
            }, undefined, 200);
        } catch (error) {
            console.error("Error setting profile color: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    public static async createProfileBudget(req: Request, res: Response) {
        try {
            const { username, profileName, budget } = req.body as { username: string, profileName: string, budget: ProfileBudget };

            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName, budget });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName });
            if (!profile) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }

            const result = await db.UpdateDocument(ProfileModel.profileCollection,
                { username, profileName }, { $push: { budgets: budget } });

            if (!result || result.modifiedCount === 0) {
                return ProfileModel.formatResponse(res, {
                    message: "Failed to create profile budget"
                }, undefined, 500);
            }

            return ProfileModel.formatResponse(res, {
                message: "Profile budget created successfully"
            }, undefined, 201);
        } catch (error) {
            console.error("Error creating profile budget: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    public static async getProfileBudgets(req: Request, res: Response) {
        try {
            const { username, profileName } = req.query as { username: string, profileName: string };

            const errorMsg = ProfileModel.validateRequiredFields({ username, profileName });
            if (errorMsg) {
                return ProfileModel.formatResponse(res, { message: errorMsg }, undefined, 400);
            }

            const profile = await db.GetDocument(ProfileModel.profileCollection, { username, profileName }, { projection: { budgets: 1 } });
            if (!profile || !profile.budgets) {
                return ProfileModel.formatResponse(res, {
                    message: "Profile not found"
                }, undefined, 404);
            }

            return ProfileModel.formatResponse(res, {
                message: "Profile budgets retrieved successfully",
                budgets: profile.budgets
            }, "budgets", 200);
        } catch (error) {
            console.error("Error retrieving profile budgets: ", error);
            return ProfileModel.formatResponse(res, {
                message: "Internal server error"
            }, undefined, 500);
        }
    }

    // Helper methods

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

    private static validateRequiredFields(fields: Record<string, any>): string | null {
        for (const [key, value] of Object.entries(fields)) {
            if (value === undefined || value === null || value === '') {
                return `${key} is required`;
            }
        }
        return null;
    }

    private static formatResponse(res: Response, result: any, dataField?: string, statusCode: number = 200) {
        const response: any = {
            message: result.message || result.error
        };

        if (dataField && result[dataField] !== undefined) {
            response[dataField] = result[dataField];
        }

        res.status(statusCode).json(response);
    }
}