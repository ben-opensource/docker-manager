import { downloadBackup } from "@/controllers/backups-controller.js";
import { logs } from "@/controllers/logs-controller.js";
import * as authMiddleware from "@/middleware/auth.js";
import { passSessionToLayout } from "@/middleware/util.js";
import * as usersController from "@/controllers/users-controller.js";
import express from "express";

const requireAdminRouter = express.Router();

//********** middleware **********
requireAdminRouter.use(authMiddleware.requireLogin);
requireAdminRouter.use(authMiddleware.requireAdmin);
requireAdminRouter.use(passSessionToLayout);

//********** routes **********
//users
requireAdminRouter.get("/users", usersController.users);
requireAdminRouter.get("/new-user", authMiddleware.requireWriteAccess, usersController.newUser);
requireAdminRouter.post("/new-user", authMiddleware.requireWriteAccess, usersController.newUserPost);
//logs
requireAdminRouter.get("/logs", logs);
//backups
requireAdminRouter.get("/download-backup", authMiddleware.requireWriteAccess, downloadBackup);

export default requireAdminRouter;