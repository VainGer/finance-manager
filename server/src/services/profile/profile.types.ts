import { ObjectId } from "mongodb";

export type Profile = {
  username: string;
  profileName: string;
  avatar?: string;// cloudinary
  color: string;
  pin: string;
  parentProfile: boolean;
  createdAt: Date;
  updatedAt: Date;
  budgets: ProfileBudget[];
  expenses: ObjectId;
}

export type ProfileBudget = {
  startDate: Date;
  endDate: Date;
  amount: number;
};