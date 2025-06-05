import ProfileModel from "./profile.model";
import { Router } from "express";

const profileRouter = Router();

profileRouter.post<{}, {}, { username: string, profileName: string, parent: boolean, pin: string }>
    ("/create-profile", ProfileModel.createProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/validate-profile", ProfileModel.validateProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, oldPin: string, mewPin: string }>
    ("/change-pin", ProfileModel.changeProfilePin);
profileRouter.post<{}, {}, { username: string, oldProfileName: string, newProfileName: string }>
    ("/rename-profile", ProfileModel.renameProfile);
profileRouter.post<{}, {}, { username: string, profileName: string, pin: string }>
    ("/delete-profile", ProfileModel.deleteProfile);
profileRouter.get<{}, {}, { username: string }>
    ("/get-profiles", ProfileModel.getAllProfiles);

export default profileRouter;