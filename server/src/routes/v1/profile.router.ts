import { Router } from "express";
import ProfileController from "../../controllers/profile.controller";
import { ProfileBudget, Profile, BudgetCreationData, ProfileCreationData, CategorizedFile } from "../../types/profile.types";
import { accessTokenVerification, refreshTokenVerification } from "../../middleware/auth.middleware";
const profileRouter = Router();

// Authentication endpoints (no middleware)
profileRouter.post<{}, {}, { reqProfile: ProfileCreationData }>
    ("/create-profile", ProfileController.createProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/validate-profile", ProfileController.validateProfile);
profileRouter.get<{}, {}, { username: string }>
    ("/get-profiles", ProfileController.getAllProfiles);

// Routes that require authentication
profileRouter.post<{}, {}, { username: string, profileName: string, childProfile: Profile }>
    ("/create-child-profile", accessTokenVerification, ProfileController.createChildProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, oldPin: string, newPin: string }>
    ("/change-pin", accessTokenVerification, ProfileController.changeProfilePin);
profileRouter.post<{}, {}, { username: string, oldProfileName: string, newProfileName: string }>
    ("/rename-profile", accessTokenVerification, ProfileController.renameProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/delete-profile", accessTokenVerification, ProfileController.deleteProfile);
profileRouter.post<{}, {}, { username: string, profileName: string }>
    ("/update-profile", accessTokenVerification, ProfileController.updateProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, avatar: string }>
    ("/set-avatar", accessTokenVerification, ProfileController.setAvatar);
profileRouter.post<{}, {}, { username: string, profileName: string, color: string }>
    ("/set-color", accessTokenVerification, ProfileController.setColor);

profileRouter.post<{}, {}, { refId: string, transactionsData: string }>
    ("/categorize-transactions", accessTokenVerification, ProfileController.categorizeTransactions);

profileRouter.post<{}, {}, { username: string, profileName: string, refId: string, transactionsToUpload: CategorizedFile[] }>
    ("/upload-transactions", accessTokenVerification, ProfileController.uploadTransactions);

export default profileRouter;