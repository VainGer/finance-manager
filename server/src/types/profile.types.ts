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
  children?: {
    profileName: string;
    id: ObjectId;
  }[];
}

export type ChildProfile = Profile & {
  newBudgets: {
    startDate: Date;
    endDate: Date;
    amount: number;
  }[]
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
  refId: string;
  profileBudget: Omit<ProfileBudget, '_id'>;
  categoriesBudgets: {
    categoryName: string;
    amount: number;
  }[];
}

export type CategorizedFile = {
  date: Date;
  category: string;
  amount: number;
  business: string;
  bank: string;
  description: string;
}

export type SafeProfile = Pick<Profile, 'profileName' | 'avatar' | 'color' | 'parentProfile'>;

export type ProfileCreationData = Omit<Profile, 'expenses'>
export type ChildProfileCreationData = Omit<ChildProfile, 'newBudgets' | 'expenses'>