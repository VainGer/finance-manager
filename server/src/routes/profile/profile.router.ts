import { Router } from "express";
import ProfileController from "../../controllers/profile.controller";
import { ProfileBudget, Profile, BudgetCreationData, ProfileCreationData } from "../../types/profile.types";
const profileRouter = Router();

profileRouter.post<{}, {}, { reqProfile: ProfileCreationData }>
    ("/create-profile", ProfileController.createProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/validate-profile", ProfileController.validateProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, oldPin: string, newPin: string }>
    ("/change-pin", ProfileController.changeProfilePin);
profileRouter.post<{}, {}, { username: string, oldProfileName: string, newProfileName: string }>
    ("/rename-profile", ProfileController.renameProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/delete-profile", ProfileController.deleteProfile);
profileRouter.get<{}, {}, { username: string }>
    ("/get-profiles", ProfileController.getAllProfiles);
profileRouter.post<{}, {}, { username: string, profileName: string, avatar: string }>
    ("/set-avatar", ProfileController.setAvatar);
profileRouter.post<{}, {}, { username: string, profileName: string, color: string }>
    ("/set-color", ProfileController.setColor);
profileRouter.get<{}, {}, {}, { username: string, profileName: string }>
    ("/get-budgets", ProfileController.getBudgets);
profileRouter.post<{}, {}, { budgetData: BudgetCreationData }>
    ("/add-budget", ProfileController.createBudget);
profileRouter.post<{}, {}, { username: string, profileName: string, startDate: Date, endDate: Date }>
    ("/check-budget-dates", ProfileController.validateBudgetDates);

profileRouter.post<{}, {}, { refId: string, transactionsData: string }>
    ("/categorize-transactions", ProfileController.categorizeTransactions);

export default profileRouter;