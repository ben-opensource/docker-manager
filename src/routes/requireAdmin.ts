import { newUser, newUserPost, users as usersController } from "@/controllers/users-controller.js";
import { requireAdmin, requireLogin, requireWriteAccess } from "@/middleware/auth.js";
import { passSessionToLayout } from "@/middleware/util.js";
import express, { Request as Req, Response as Res } from "express";

const router = express.Router();
router.use(requireLogin);
router.use(requireAdmin);
router.use(passSessionToLayout);

router.get("/dashboard/update-config", requireWriteAccess, (req: Req, res: Res) => {

});
router.get("/dashboard/users", usersController);
router.get("/dashboard/new-user", requireWriteAccess, newUser);
router.post("/dashboard/new-user", requireWriteAccess, newUserPost);

export { router as requireAdminRouter }