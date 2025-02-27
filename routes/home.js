import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { Session } from '../model/sessionModel.js';

const homeRoutes = Router();

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    const session = await Session.findOne({ token });
    if (session && new Date() > session.expiresAt) {
        return res.status(401).json({ message: "Session has expired" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }
        req.userId = decoded.userId;
        next();
    });
};

homeRoutes.get('/', authenticateToken, (req, res) => {
    return res.status(200).json({ message: "Welcome to the home page", userId: req.userId });
});

export default homeRoutes;