import { Router } from "express";
import { Session } from "../model/sessionModel.js";

const sesRoutes = Router();

sesRoutes.get('/myToken/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "UserId is required." });
        }
        const userSession = await Session.findOne({ userId });
        if (!userSession) {
            return res.status(404).json({ message: "Use has no session records" });
        }
        const { token, expiresAt, createdAt, ...otherData } = userSession;
        const timeLeft = (expiresAt - createdAt);
        return res.status(200).json({
            token, timeLeft
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error._message });
    }
});

sesRoutes.get('/all', async (req, res) => {
    try {
        const allSessions = await Session.find({})
            .populate("userId")
            .catch(error => console.log(error));

        return res.status(200).json(allSessions);
    } catch (error) {
        return res.status(500).json({ message: "Internal Error", error: error._message });
    }
});

export default sesRoutes;