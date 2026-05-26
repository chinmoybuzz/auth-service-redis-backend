import express from "express";
const router = express.Router();
import { login, signUp, refreshAccessToken } from "../../controllers/auth.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";
router.route("/login").post(login);
router.route("/register").post(signUp);
router.route("/refresh-token").post(authenticate, refreshAccessToken);

export default router;
