import express from "express";

const router = express.Router();
import { uploadSingleFileBuffer } from "../../utility/Multer.js";
import { list, add, edit, deleteData } from "../../controllers/post.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";

router.route("/list").get(authenticate, list);
router.route("/add").post(authenticate, uploadSingleFileBuffer("image"), add);
router.route("/edit").put(authenticate, edit);
router.route("/delete-data").patch(authenticate, deleteData);

export default router;
