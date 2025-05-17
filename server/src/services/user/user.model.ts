import { User, UserWithoutPassword } from './user.types';
import { Response, Request } from 'express';
import db from '../../server';
import { ObjectId } from 'mongodb';
import { stat } from 'fs';

export default class UserModel {
    private static userCollection: string = 'users';

    static async createUser(req: Request, res: Response) {
        try {
            const user = req.body as User;
            if (!user || !user.username || !user.password) {
                let errorMsg = !user ? "User data is required" :
                    !user.username ? "Username is required" : "Password is required";
                res.status(400).json({
                    message: errorMsg,
                    status: 400
                }
                );
                return;
            }
            let registeredUser = await db.GetDocument("users", { "username": user.username });
            if (registeredUser) {
                res.status(400).json({
                    message: "User already exists",
                    status: 400
                });
            }
            else {
                await db.AddDocument(UserModel.userCollection, user as User);
                res.status(201).json({
                    message: "User registered successfully: " + registeredUser,
                    user: {
                        username: user.username,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        isActive: user.isActive
                    },
                    status: 201
                });
            }
        } catch (error) {
            console.log("Error creating user: ", error);
            res.status(500).json({
                message: "Internal server error",
                status: 500
            });
            throw error;
        }
    }

    static async getUserByID(req: Request, res: Response) {
        try {
            let userId = req.body.id as string;
            if (userId.length !== 24) {
                res.status(400).json({
                    message: "Invalid user ID",
                    status: 400
                });
                return;
            }
            let userFound = await db.GetDocument(UserModel.userCollection, { "_id": ObjectId.createFromHexString(userId) });
            if (!userFound) {
                res.status(404).json({
                    message: "User not found",
                    status: 404
                });
            } else {
                res.status(200).json({
                    message: "User retrieved successfully",
                    user: {
                        username: userFound.username,
                        createdAt: userFound.createdAt,
                        updatedAt: userFound.updatedAt,
                        isActive: userFound.isActive
                    },
                    status: 200
                });
            }

        } catch (error) {
            console.log("Error getting user: ", error);
            res.status(500).json({
                error: "Internal server error",
                status: 500
            });
            throw error;
        }
    }
    static async ValidateUser(req: Request, res: Response) {
        try {
            const User = req.body as User;
            if (!User || !User.username || !User.password) {
                let errorMsg = !User ? "User data is required" :
                    !User.username ? "Username is required" : "Password is required";
                res.status(400).json({
                    message: errorMsg,
                    status: 400
                }
                );
                return;
            }
            let userFound = await db.GetDocument(UserModel.userCollection, { "username": User.username });
            if (userFound) {
                if (userFound.password === User.password) {
                    res.status(200).json({
                        message: "User validated successfully",
                        user: {
                            username: userFound.username,
                            createdAt: userFound.createdAt,
                            updatedAt: userFound.updatedAt,
                            isActive: userFound.isActive
                        },
                        status: 200
                    });
                }
            } else {
                res.status(404).json(
                    {
                        message: "User not found",
                        status: 404
                    });
            }
        } catch (error) {
            console.log("Error validating user: ", error);
            res.status(500).json({
                error: "Internal server error",
                status: 500
            });
            throw error;
        }
    }
}