import { getDB } from '../db.js';

const db = await getDB();

export async function findUserByUsername(username) {
    try {
        const authCollection = db.collection('auth');
        const user = await authCollection.findOne({ username: username });
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

export async function insertNewUser(user) {
    try {
        const authCollection = db.collection('auth');
        const result = await authCollection.insertOne(user);
        return result.acknowledged;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}
