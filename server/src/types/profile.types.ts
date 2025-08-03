import { ObjectId } from "mongodb";

export type Profile = {
  username: string;
  profileName: string;
  avatar: string | null;// cloudinary
  color: string;
  pin: string;
  parentProfile: boolean;
  createdAt: Date;
  updatedAt: Date;
  budgets: ProfileBudget[];
  expenses: ObjectId;
}

export type ProfileBudget = {
  _id: ObjectId;
  startDate: Date;
  endDate: Date;
  amount: number;
  spent: number;
};

export type BudgetCreationData = {
  username: string,
  profileName: string;
  refId: ObjectId;
  profileBudget: Omit<ProfileBudget, '_id'>;
  categoriesBudgets: {
    categoryName: string;
    amount: number;
  }[];
}

export type SafeProfile = Pick<Profile, 'profileName' | 'avatar' | 'color' | 'parentProfile'>;

export type ProfileCreationData = Omit<Profile, 'expenses'>