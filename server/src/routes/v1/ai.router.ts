import { Router } from "express";
import AiController from "../../controllers/ai.controller";
import { accessTokenVerification } from "../../middleware/auth.middleware";

const aiRouter = Router();

aiRouter.get<{ profileId: string }, {}, {}, {}>(
    "/history/:profileId", accessTokenVerification, AiController.getHistory);

aiRouter.get<{ profileId: string }, {}, {}, {}>(
    "/history/status/:profileId", accessTokenVerification, AiController.checkHistoryStatus);

export default aiRouter;