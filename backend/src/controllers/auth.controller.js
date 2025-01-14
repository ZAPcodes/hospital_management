const User = require('../models/user.models'); // Adjust path as necessary
const jwt = require('jsonwebtoken');

// Secret key for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET; // Replace with a strong secret

class AuthController {
    /**
     * Registers a new user.
     */
    static async register(req, res) {
        const { username, password, email, role } = req.body;

        try {
            // Validate input
            if (!username || !password || !email || !role) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Create new user
            const user = await User.create({ username, password, email, role });

            // Generate JWT
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
                expiresIn: '1d', // Token validity
            });

            return res.status(201).json({
                message: 'User registered successfully',
                user: { id: user.id, username: user.username, email: user.email, role: user.role },
                token,
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    /**
     * Logs in an existing user.
     */
    static async login(req, res) {
        const { email, password } = req.body;

        try {
            // Validate input
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            // Find user by email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Validate password
            const isValid = await User.validatePassword(user, password);
            console.log({email, password, user, isValid});
            if (!isValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
                expiresIn: '1d',
            });

            return res.status(200).json({
                message: 'Login successful',
                user: { id: user.id, username: user.username, email: user.email, role: user.role },
                token,
            });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    /**
     * Fetches the currently authenticated user's details.
     */
    static async getCurrentUser(req, res) {
        try {
            const userId = req.user.id; // `req.user` is set by middleware after token verification
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = AuthController;
