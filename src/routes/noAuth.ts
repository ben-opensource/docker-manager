import express from "express";

import * as loginController from "@/controllers/login-controller.js";
import * as newAdminController from "@/controllers/new-admin-controller.js";
import { deleteSession, newAdminIfNoUsers, requireLogin, requireNotLoggedIn, requireNoUsers } from "@/middleware/auth.js";
import * as backupsController from "@/controllers/backups-controller.js";

const router = express.Router();

//********** routes **********
//login - new admin if no users exist
router.get("/login", requireNotLoggedIn, newAdminIfNoUsers, loginController.login);
router.post("/login", requireNotLoggedIn, newAdminIfNoUsers, loginController.loginPost);
router.get("/oauth/login", requireNotLoggedIn, loginController.oauthLogin);
router.get("/oauth", requireNotLoggedIn, newAdminIfNoUsers, loginController.oauth);
router.get("/oauth/oauth-success", loginController.oauthSuccess);

//logout - logs out of oauth after deleteSession clears the local login
router.get("/logout", deleteSession, loginController.logout);

//add oauth
router.get("/oauth/add-oauth", requireLogin, loginController.oauth);
router.get("/oauth/confirm-add-oauth", requireLogin, loginController.confirmAddOauth);

//new admin - only if no users exist
router.get("/new-admin", requireNotLoggedIn, requireNoUsers, newAdminController.newAdmin);
router.post("/new-admin", requireNotLoggedIn, requireNoUsers, newAdminController.newAdminPost);

router.post("/load-backup", requireNotLoggedIn, requireNoUsers, backupsController.loadBackup);

export { router as noAuthRouter }