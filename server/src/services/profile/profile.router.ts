import ProfileModel from "./profile.model";
import { Router } from "express";
import { ProfileBudget, Profile, BudgetCreationData } from "./profile.types";
const profileRouter = Router();

profileRouter.post<{}, {}, { reqProfile: Profile }>
    ("/create-profile", ProfileModel.createProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/validate-profile", ProfileModel.validateProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, oldPin: string, newPin: string }>
    ("/change-pin", ProfileModel.changeProfilePin);
profileRouter.post<{}, {}, { username: string, oldProfileName: string, newProfileName: string }>
    ("/rename-profile", ProfileModel.renameProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/delete-profile", ProfileModel.deleteProfile);
profileRouter.get<{}, {}, { username: string }>
    ("/get-profiles", ProfileModel.getAllProfiles);
profileRouter.post<{}, {}, { username: string, profileName: string, avatar: string }>
    ("/set-avatar", ProfileModel.setAvatar);
profileRouter.post<{}, {}, { username: string, profileName: string, color: string }>
    ("/set-color", ProfileModel.setColor);
profileRouter.get<{}, {}, { username: string, profileName: string }>
    ("/get-budgets", ProfileModel.getProfileBudgets);
profileRouter.post<{}, {}, { budgetData: BudgetCreationData }>
    ("/add-budget", ProfileModel.createProfileBudget);
export default profileRouter;