import { validateUser, registerUser } from "./auth.model.js";

export async function login(req, res) {
    let { username, password } = req.body;
    let user = await validateUser(username, password);
    if (user) {
        res.status(200).json(
            {
                message: 'Login successful'
            });
    } else {
        res.status(401).json({
            message: 'Invalid username or password'
        });
    }
}

export async function register(req, res) {
    let { username, password } = req.body;
    let registered = await registerUser(username, password);
    if (!registered) {
        res.status(401).json({
            message: 'Username already exists'
        });
    }
    else {
        res.status(201).json({
            message: 'User registered successfully'
        });
    }
}