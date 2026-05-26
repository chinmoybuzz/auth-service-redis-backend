import express from "express";
const router = express.Router();

import authRouter from "./v1/auth.route.js";
import userRouter from "./v1/user.route.js";
import roleRouter from "./v1/role.route.js";
import postRouter from "./v1/post.route.js";

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/roles", roleRouter);
router.use("/posts", postRouter);

export default router;
