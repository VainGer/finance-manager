import { ObjectId } from "mongodb";

export type Account = {
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive?: boolean;
    tokens: Token[];
};

export type Token = {
    value: string;
    profileId: ObjectId;
    createdAt: Date;
    expiredAt: Date;
    maxValidUntil: Date;
    lastUsedAt: Date;
    device: string;
};

