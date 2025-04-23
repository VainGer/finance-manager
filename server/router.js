import Router from "express";
import authRouter from "./auth/auth.router.js";
import userRouter from "./user/user.router.js";
import categoryRouter from "./category/category.router.js";
import businessRouter from "./business/business.router.js";
import transactionRouter from "./transactions/transactions.router.js";
const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/business", businessRouter);
router.use("/transactions", transactionRouter);

export default router;