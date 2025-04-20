import { insertNewUser, findUserByUsername } from "./auth.db.js";

export async function validateUser(username, password) {
    const user = await findUserByUsername(username);
    if (!user) {
        return false;
    }
    if (user.password !== password) {
        console.log('Password does not match');
        return false;
    }
    console.log('Validation successful');
    return true;
}

export async function registerUser(username, password) {
    const newUser = {
        username: username,
        password: password,
        createdAt: new Date(),
        lastLogin: new Date(),
    };

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        console.log('Username already exists');
        return false;
    }

    const result = await insertNewUser(newUser);
    if (!result) {
        console.log('Error registering user');
        return false;
    }
    console.log('User registered successfully');
    return true;
}
