import * as authMiddleware from "@/middleware/auth.js";
import express from "express";
import * as authController from "@/controllers/authController.js";
import * as backupsController from "@/controllers/backups-controller.js";

const noAuthRouter = express.Router();

//********** routes **********
const loginRequirementMiddleware = [ authMiddleware.requireNotLoggedIn, authMiddleware.newAdminIfNoUsers];
noAuthRouter.get("/login", loginRequirementMiddleware, authController.login);
noAuthRouter.post("/login", loginRequirementMiddleware, authController.loginMiddlewarePost, authController.finalizeLogin);
noAuthRouter.get("/oauth/login", loginRequirementMiddleware, authController.oauthLoginMiddleware, authController.finalizeLogin);
noAuthRouter.get("/oauth", loginRequirementMiddleware, authController.oauthLogin);
noAuthRouter.get("/oauth/oauth-success", authController.oauthSuccess);

noAuthRouter.get("/oauth/add-oauth", authMiddleware.requireLogin, authController.oauthLogin);
noAuthRouter.get("/oauth/confirm-add-oauth", authMiddleware.requireLogin, authController.oauthSuccess);

noAuthRouter.get("/logout", authMiddleware.deleteSession, authController.oauthLogout);

const newAdminMiddleware = [ authMiddleware.requireNotLoggedIn, authMiddleware.requireNoUsers ];
noAuthRouter.get("/new-admin", newAdminMiddleware, authController.newAdmin);
noAuthRouter.post("/new-admin", newAdminMiddleware, authController.newAdminPost);

noAuthRouter.post("/load-backup", authMiddleware.requireNotLoggedIn, authMiddleware.requireNoUsers, backupsController.loadBackup);

export default noAuthRouter;