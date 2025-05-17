export type User = {
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive?: boolean;
}

export type UserWithoutPassword = Omit<User, 'password'>;