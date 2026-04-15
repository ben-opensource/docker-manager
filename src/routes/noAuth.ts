import express, { Request as Req, Response as Res, NextFunction as Next } from "express";

import { login, loginPost, oauthController, oauthLogin, oauthSuccess } from "@/controllers/login-controller.js";
import { newAdmin, newAdminPost } from "@/controllers/new-admin-controller.js";
import { deleteSession, newAdminIfNoUsers, requireNotLoggedIn, requireNoUsers } from "@/middleware/auth.js";
import { loadBackup } from "@/controllers/backups-controller.js";
import { auth } from "express-openid-connect";

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
oauthRouter.get("/oauth-logout", deleteSession, (req: Req, res: Res, next: Next) => {
  const logoutUrl = process.env.AUTH0_ISSUER_BASE_URL +
    `/oidc/logout?client_id=${process.env.AUTH0_CLIENT_ID}` +
    `&post_logout_redirect_uri=${encodeURIComponent(`${process.env.BASE_URL}/login`)}`;

  res.redirect(logoutUrl);
});
oauthRouter.get("/test",(res:Res,req:Req)=>res.json("test"))
oauthRouter.get("/oauth", requireNotLoggedIn, newAdminIfNoUsers, oauthController);
oauthRouter.get("/oauth/login", oauthLogin);
router.use("/", oauthRouter);

//new admin - only if no users exist
router.get("/new-admin", requireNotLoggedIn, requireNoUsers, newAdmin);
router.post("/new-admin", requireNotLoggedIn, requireNoUsers, newAdminPost);

router.post("/load-backup", requireNotLoggedIn, requireNoUsers, loadBackup);

export { router as noAuthRouter }