import { Router } from 'express';
import AdminController from '../../controllers/admin.controller';
import { adminTokenVerification } from '../../middleware/auth.middleware';

const adminRouter = Router();

// Auth
adminRouter.post('/register', AdminController.register);
adminRouter.post('/login', AdminController.login);

// Logs
adminRouter.post('/actions/recent', adminTokenVerification, AdminController.getRecentActions);
adminRouter.post('/actions/by-date', adminTokenVerification, AdminController.getActionsByDateRange);

// Profiles
adminRouter.post('/profiles', adminTokenVerification, AdminController.getAllProfilesGrouped);
adminRouter.post('/profiles/update', adminTokenVerification, AdminController.updateProfile);
adminRouter.post('/profiles/delete', adminTokenVerification, AdminController.deleteProfile);

// Budgets
adminRouter.post('/budgets/profile', adminTokenVerification, AdminController.getProfileBudgets);
adminRouter.post('/budgets/delete', adminTokenVerification, AdminController.deleteBudget);

// Expenses
adminRouter.post('/expenses', adminTokenVerification, AdminController.getProfileExpenses);

export default adminRouter;
