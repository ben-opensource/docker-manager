import * as authMiddleware from "@/middleware/auth.js";
import express from "express";
import * as authController from "@/controllers/authController.js";
import * as backupsController from "@/controllers/backupsController.js";

const noAuthRouter = express.Router();

//********** middleware **********
const loginRequirementMiddleware = [ authMiddleware.requireNotLoggedIn, authMiddleware.newAdminIfNoUsers];
const newAdminMiddleware = [ authMiddleware.requireNotLoggedIn, authMiddleware.requireNoUsers ];

//********** routes **********
//normal login
noAuthRouter.get("/login", loginRequirementMiddleware, authController.login);
noAuthRouter.post("/login", loginRequirementMiddleware, authController.loginMiddlewarePost, authController.finalizeLogin);
//oauth login
//noAuthRouter.get("/oauth/login", loginRequirementMiddleware, authController.oauthLoginMiddleware, authController.finalizeLogin);
noAuthRouter.get("/oauth", loginRequirementMiddleware, authController.oauthLogin);
noAuthRouter.get("/oauth/oauth-success", authController.oauthSuccess);
//add oauth
noAuthRouter.get("/oauth/add-oauth", authMiddleware.requireLogin, authController.oauthLogin);
noAuthRouter.get("/oauth/confirm-add-oauth", authMiddleware.requireLogin, authController.oauthSuccess);
//logout
noAuthRouter.get("/logout", authMiddleware.deleteSession, authController.oauthLogout);
//new admin
noAuthRouter.get("/new-admin", newAdminMiddleware, authController.newAdmin);
noAuthRouter.post("/new-admin", newAdminMiddleware, authController.newAdminPost);
//load backup
noAuthRouter.post("/load-backup", newAdminMiddleware, backupsController.loadBackup);

export default noAuthRouter;