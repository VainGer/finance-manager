import UserModel from "./user.model";
import { Router } from "express";
import { User } from "./user.types";

const userRouter = Router();

userRouter.post<{}, {}, User>("/register", UserModel.createUser);
userRouter.post<{}, {}, { id: string }>("/get-user-by-id", UserModel.getUserByID);
userRouter.post<{}, {}, { username: string, password: string }>("/validate", UserModel.ValidateUser);
export default userRouter;