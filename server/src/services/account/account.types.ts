export type Account = {
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive?: boolean;
}