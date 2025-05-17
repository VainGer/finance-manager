import { validateUser, registerUser } from "./auth.model.js";

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const loggedIn = await validateUser(username, password);
        if (loggedIn) {
            res.status(200).json({
                message: 'Login successful',
                status: 200
            });
        } else {
            res.status(401).json({
                message: 'Invalid username or password',
                status: 401
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error during login',
            status: 500
        });
    }
}

export async function register(req, res) {
    try {
        const { username, password } = req.body;
        const registered = await registerUser(username, password);
        if (registered) {
            res.status(201).json({
                message: 'User registered successfully',
                status: 201
            });
        } else {
            res.status(400).json({
                message: 'Failed to register user (e.g., username already exists)',
                status: 400
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error during registration',
            status: 500
        });
    }
}