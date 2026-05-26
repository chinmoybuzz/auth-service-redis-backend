import express from "express";
const router = express.Router();
import { parseFormData } from "../../utility/Multer.js";
import { list, add, edit, deleteData } from "../../controllers/role.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";

router.route("/list").get(authenticate, list);
router.route("/details").get(authenticate, list);
router.route("/add").post(authenticate, parseFormData, add);
router.route("/edit").put(authenticate, edit);
router.route("/delete-data").patch(authenticate, deleteData);

export default router;
