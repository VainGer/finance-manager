import { Request, Response } from "express";
import AiService from "../services/ai/ai.service";
import * as AppErrors from "../errors/AppError";

export default class AiController {

    public static async getHistory(req: Request, res: Response) {
        try {
            const { profileId } = req.params;
            if (!profileId) {
                throw new AppErrors.BadRequestError("Profile ID is required");
            }
            const history = await AiService.getHistory(profileId);
            res.status(200).json({
                success: true,
                message: "History retrieved successfully",
                history
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }

    public static async checkHistoryStatus(req: Request, res: Response) {
        try {
            const { profileId } = req.params;
            if (!profileId) {
                throw new AppErrors.BadRequestError("Profile ID is required");
            }
            const { analyzeStatus } = await AiService.checkHistoryStatus(profileId);
            res.status(200).json({
                success: true,
                analyzeStatus,
                message: "History status retrieved successfully"
            });
        } catch (error) {
            this.handleError(error, res);
        }
    }


    private static handleError(error: any, res: Response) {
        if (error instanceof AppErrors.AppError) {
            console.error(`[AI Controller] AppError:`, error.message);
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error(`[AI Controller] Unexpected error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }

}