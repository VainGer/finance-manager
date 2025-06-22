import AccountModel from "./account.model";
import { Router } from "express";
import { Account } from "./account.types";

const accountRouter = Router();

accountRouter.post<{}, {}, Account>("/register", AccountModel.createAccount);
accountRouter.post<{}, {}, { id: string }>("/get-user-by-id", AccountModel.getAccountById);
accountRouter.post<{}, {}, { username: string, password: string }>("/validate", AccountModel.ValidateAccount);

export default accountRouter;