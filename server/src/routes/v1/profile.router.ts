import { Router } from "express";
import ProfileController from "../../controllers/profile.controller";
import { ProfileBudget, Profile, BudgetCreationData, ProfileCreationData, CategorizedFile } from "../../types/profile.types";
const profileRouter = Router();

profileRouter.post<{}, {}, { reqProfile: ProfileCreationData }>
    ("/create-profile", ProfileController.createProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, childProfile: Profile }>
    ("/create-child-profile", ProfileController.createChildProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/validate-profile", ProfileController.validateProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, oldPin: string, newPin: string }>
    ("/change-pin", ProfileController.changeProfilePin);
profileRouter.post<{}, {}, { username: string, oldProfileName: string, newProfileName: string }>
    ("/rename-profile", ProfileController.renameProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/delete-profile", ProfileController.deleteProfile);
profileRouter.post<{}, {}, { username: string, profileName: string }>
    ("/update-profile", ProfileController.updateProfile);
profileRouter.get<{}, {}, { username: string }>
    ("/get-profiles", ProfileController.getAllProfiles);
profileRouter.post<{}, {}, { username: string, profileName: string, avatar: string }>
    ("/set-avatar", ProfileController.setAvatar);
profileRouter.post<{}, {}, { username: string, profileName: string, color: string }>
    ("/set-color", ProfileController.setColor);

profileRouter.post<{}, {}, { refId: string, transactionsData: string }>
    ("/categorize-transactions", ProfileController.categorizeTransactions);

profileRouter.post<{}, {}, { username: string, profileName: string, refId: string, transactionsToUpload: CategorizedFile[] }>
    ("/upload-transactions", ProfileController.uploadTransactions);

export default profileRouter;