import express from "express";

const router = express.Router();
import { uploadSingleFileBuffer, parseFormData } from "../../utility/Multer.js";
import { list, add, edit, deleteData, details } from "../../controllers/user.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";
router.route("/list").get(authenticate, list);
router.route("/details/:id").get(authenticate, details);
router.route("/add").post(authenticate, uploadSingleFileBuffer("image"), add);
router.route("/edit/:id").put(authenticate, uploadSingleFileBuffer("image"), edit);
router.route("/delete-data").patch(authenticate, parseFormData, deleteData);

export default router;
