import { downloadBackup } from "@/controllers/backups-controller.js";
import { logs } from "@/controllers/logs-controller.js";
import { newUser, newUserPost, users as usersController } from "@/controllers/users-controller.js";
import { requireAdmin, requireLogin, requireWriteAccess } from "@/middleware/auth.js";
import { passSessionToLayout } from "@/middleware/util.js";
import express, { Request as Req, Response as Res } from "express";

const router = express.Router();
router.use(requireLogin);
router.use(requireAdmin);
router.use(passSessionToLayout);

router.get("/update-config", requireWriteAccess, (req: Req, res: Res) => {

});
router.get("/users", usersController);
router.get("/new-user", requireWriteAccess, newUser);
router.post("/new-user", requireWriteAccess, newUserPost);

router.get("/logs", logs);


router.get("/download-backup", requireWriteAccess, downloadBackup);

export { router as requireAdminRouter }