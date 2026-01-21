export interface Account {
  _id: string;
  username: string;
}

export interface ProfileForList {
  profileName: string;
  avatar?: string;
  color?: string;
  parentProfile: boolean;
}

export interface Profile {
  avatar?: string;
  color?: string;
  children?: Children[];
  createdAt: string;
  updatedAt: string;
  expenses: string;
  parentProfile: boolean;
  profileName: string;
  username: string;
  _id: string;
}

export type Children = {
  id: string;
  name: string;
};
