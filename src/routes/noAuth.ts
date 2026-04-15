import express, { Request as Req, Response as Res, NextFunction as Next } from "express";

import { login, loginPost, oauthController, oauthLogin } from "@/controllers/login-controller.js";
import { newAdmin, newAdminPost } from "@/controllers/new-admin-controller.js";
import { deleteSession, newAdminIfNoUsers, requireLogin, requireNotLoggedIn, requireNoUsers } from "@/middleware/auth.js";
import { loadBackup } from "@/controllers/backups-controller.js";
import { auth } from "express-openid-connect";
import { database } from "@/database/database.js";

const router = express.Router();

//login - new admin if no users exist
router.get("/login", requireNotLoggedIn, newAdminIfNoUsers, login);
router.post("/login", requireNotLoggedIn, newAdminIfNoUsers, loginPost);

const oauthRouter = express.Router();
oauthRouter.use(auth({
    authRequired: false, // set to true to require authentication for all routes
    auth0Logout: true,
    secret: process.env.SESSION_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    routes: {
      callback: "/oauth/callback",
      login: "/login",
      logout: "/oauth/logout"
    },
    idpLogout: true
  }));
oauthRouter.get("/oauth-logout", (req: Req, res: Res) => {
  res.oidc.logout({
    returnTo: "/dashboard/logout"
  });
});
oauthRouter.get("/oauth", requireNotLoggedIn, newAdminIfNoUsers, oauthController);
oauthRouter.get("/oauth/login", requireNotLoggedIn, oauthLogin);
oauthRouter.get("/oauth/add-oauth", requireLogin, (req: Req, res: Res) => {
  res.oidc.login({
    returnTo: "/oauth/confirm-add-oauth",
    authorizationParams: { screen_hint: 'signin' },
  });
});
oauthRouter.get("/oauth/confirm-add-oauth", requireLogin, (req: Req, res: Res) => {
  database.oauthConnections.push({ oauthClientId: req?.oidc.user!.sub, userId: req.session.userId! });
  res.oidc.logout({
    returnTo: "/dashboard"
  });
});
router.use("/", oauthRouter);

//new admin - only if no users exist
router.get("/new-admin", requireNotLoggedIn, requireNoUsers, newAdmin);
router.post("/new-admin", requireNotLoggedIn, requireNoUsers, newAdminPost);

router.post("/load-backup", requireNotLoggedIn, requireNoUsers, loadBackup);

export { router as noAuthRouter }