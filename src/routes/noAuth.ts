import express, { Request as Req, Response as Res } from "express";

import { login, loginPost } from "@/controllers/login-controller.js";
import { newAdmin, newAdminPost } from "@/controllers/new-admin-controller.js";
import { newAdminIfNoUsers, requireNotLoggedIn, requireNoUsers } from "@/middleware/auth.js";
import { loadBackup } from "@/controllers/backups-controller.js";

const router = express.Router();

//login - new admin if no users exist
router.get("/login", requireNotLoggedIn, newAdminIfNoUsers, login);
router.post("/login", requireNotLoggedIn, newAdminIfNoUsers, loginPost);

//new admin - only if no users exist
router.get("/new-admin", requireNotLoggedIn, requireNoUsers, newAdmin);
router.post("/new-admin", requireNotLoggedIn, requireNoUsers, newAdminPost);

router.post("/load-backup", requireNotLoggedIn, requireNoUsers, loadBackup);

export { router as noAuthRouter }