import { ObjectId } from "mongodb";

export interface AdminAccount {
    username: string;
    password: string;
    isAdmin: true;
}


export interface AdminAccountsDoc {
    _id?: ObjectId | string;
    type: "accounts";
    accounts: AdminAccount[];
}


export type ActionType = "create" | "update" | "delete" | "login" | "export";


export interface Action {
    date: string;
    type: ActionType;
    executeAccount: string;
    executeProfile?: string;
    action: string;
    target?: string;
}


export interface HistoryDoc {
    _id?: ObjectId | string;
    type: "logs";
    operations: Action[];
}

export type GroupedProfiles = {
    account: string,
    profiles: ProfileInfo[]
}

export type ProfileInfo = {
    profileName: string,
    expenses: ObjectId | string
}
