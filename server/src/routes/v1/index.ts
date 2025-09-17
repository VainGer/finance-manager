import { Router } from "express";
import accountRouter from "./account.router";
import profileRouter from "./profile.router";
import expensesRouter from "./expenses/expenses.router";
import budgetRouter from "./budgets.router";

const routerV1 = Router();

routerV1.use("/accounts", accountRouter);
routerV1.use("/profiles", profileRouter);
routerV1.use("/expenses", expensesRouter);
routerV1.use("/budgets", budgetRouter);

export default routerV1;