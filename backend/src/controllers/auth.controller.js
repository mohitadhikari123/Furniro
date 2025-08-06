import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role = "user" } = req.body;

        // ✅ Check for missing fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields (name, email, password) are required" });
        }

        // ✅ Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // ✅ Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create and save the new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // ✅ Exclude password from response
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        
        res.status(201).json({  message: "User registered successfully!", user: userWithoutPassword, token });
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // ✅ Check if user exists
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // ✅ Exclude password from response
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Google OAuth Success Handler
export const googleAuthSuccess = async (req, res) => {
    try {
        if (!req.user) {
            return res.send(`
                <script>
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_ERROR',
                        message: 'Authentication failed'
                    }, '${process.env.FRONTEND_URL || 'http://localhost:3001'}');
                    window.close();
                </script>
            `);
        }

        // Generate JWT token for the authenticated user
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        
        // Exclude password from response
        const { password: _, ...userWithoutPassword } = req.user.toObject();
        
        // Get redirect parameter from query string
        const redirectParam = req.query.redirect;
        
        // Send HTML with script to communicate with parent window
        res.send(`
            <script>
                window.opener.postMessage({
                    type: 'GOOGLE_AUTH_SUCCESS',
                    token: '${token}',
                    user: ${JSON.stringify(userWithoutPassword)},
                    redirect: '${redirectParam || ''}'
                }, '${process.env.FRONTEND_URL || 'http://localhost:3001'}');
                window.close();
            </script>
        `);
    } catch (error) {
        console.error("Google auth success error:", error);
        res.send(`
            <script>
                window.opener.postMessage({
                    type: 'GOOGLE_AUTH_ERROR',
                    message: 'Server error during authentication'
                }, '${process.env.FRONTEND_URL || 'http://localhost:3001'}');
                window.close();
            </script>
        `);
    }
};

// Google OAuth Failure Handler
export const googleAuthFailure = (req, res) => {
    res.send(`
        <script>
            window.opener.postMessage({
                type: 'GOOGLE_AUTH_ERROR',
                message: 'Google authentication failed'
            }, '${process.env.FRONTEND_URL || 'http://localhost:3001'}');
            window.close();
        </script>
    `);
};
