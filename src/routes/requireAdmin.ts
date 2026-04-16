import { downloadBackup } from "@/controllers/backups-controller.js";
import { logs } from "@/controllers/logs-controller.js";
import * as authMiddleware from "@/middleware/auth.js";
import { passSessionToLayout } from "@/middleware/util.js";
import * as usersController from "@/controllers/users-controller.js";
import express from "express";

const requireAdminRouter = express.Router();

requireAdminRouter.use(authMiddleware.requireLogin);
requireAdminRouter.use(authMiddleware.requireAdmin);
requireAdminRouter.use(passSessionToLayout);

//********** routes **********
// requireAdminRouter.get("/update-config", requireWriteAccess, (req: Req, res: Res) => {
//   //todo? do i even teed a config.yaml
//   res.status(404);
// });
requireAdminRouter.get("/users", usersController.users);
requireAdminRouter.get("/new-user", authMiddleware.requireWriteAccess, usersController.newUser);
requireAdminRouter.post("/new-user", authMiddleware.requireWriteAccess, usersController.newUserPost);

requireAdminRouter.get("/logs", logs);

requireAdminRouter.get("/download-backup", authMiddleware.requireWriteAccess, downloadBackup);

export default requireAdminRouter;