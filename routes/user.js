import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { genSalt, hash, compare } from 'bcrypt';
import { users } from '../model/userModel.js';
import { Session } from '../model/sessionModel.js';

const userRoutes = Router();

userRoutes.post('/register', async (req, res) => {
    try {
        const { firstName, email, password, ...userData } = req.body;
        if (!firstName || !email || !password) {
            return res.status(400).json({ message: "firstName, email, and password are required." });
        }

        const saltRounds = 10;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(password, salt);

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser = new users({
            firstName,
            email,
            password: hashedPassword,
            ...userData
        });
        await newUser.save();

        return res.status(201).json({ message: `User registered successfully with email: ${email}` });
    } catch (Error) {
        console.log(`Internal Error: ${Error}`);
        return res.status(500).json({ errorMessage: Error });
    }
});

userRoutes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required." });
        }

        const user = await users.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const session = new Session({
            userId: user._id,
            token,
            expiresAt,
        });
        await session.save();

        return res.status(200).json({
            message: "Logged in successfully",
            token
        });

    } catch (error) {
        console.log("Login Error", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

userRoutes.post("/logout", async (req, res) => {
    try {
        const { token, userId } = req.body;
        if (!token || !userId) {
            return res.status(400).json({ message: "Token and userId are required." });
        }

        const userSession = await Session.findOne({ token: token });
        if (!userSession) {
            return res.status(404).json({ message: "User with this token is not found" });
        }

        if (userId !== userSession.userId.toString()) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        await Session.deleteOne({ token });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

userRoutes.get("/all", async (req, res) => {
    try {
        const allUsers = await users.find({});

        return res.status(200).json(allUsers);
    } catch (error) {
        return res.status(500).json(error);
    }
});

export default userRoutes;