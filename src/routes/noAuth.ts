import express, { Request as Req, Response as Res, NextFunction as Next } from "express";

import { login, loginPost, oauthController, oauthLogin } from "@/controllers/login-controller.js";
import { newAdmin, newAdminPost } from "@/controllers/new-admin-controller.js";
import { deleteSession, newAdminIfNoUsers, requireLogin, requireNotLoggedIn, requireNoUsers } from "@/middleware/auth.js";
import { loadBackup } from "@/controllers/backups-controller.js";
import { auth } from "express-openid-connect";
import { database, getOauthUser } from "@/database/database.js";

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
oauthRouter.get("/oauth-logout", deleteSession, (req: Req, res: Res) => {
  res.oidc.logout({
    returnTo: "/login"
  });
});
oauthRouter.get("/oauth", requireNotLoggedIn, newAdminIfNoUsers, oauthController);
oauthRouter.get("/oauth/login", requireNotLoggedIn, oauthLogin);
oauthRouter.get("/oauth/add-oauth", requireLogin, (req: Req, res: Res) => {
  res.oidc.login({
    returnTo: "/oauth/oauth-success",
    authorizationParams: { screen_hint: 'signin' },
  });
});
oauthRouter.get("/oauth/confirm-add-oauth", requireLogin, (req: Req, res: Res) => {
  database.oauthConnections.push({ oauthClientId: req?.oidc.user!.sub, userId: req.session.userId! });
  res.oidc.logout({
    returnTo: "/login"
  });
});

//done-cleanup: set all logout returnTo routes to /login -> if its still logged in, redirect to dashboard, else stay on login
//done-cleanup: set all login routes to /oauth-success -> if still logged in, add oauth, if not logged in -> log in -> log out of auth2
oauthRouter.get("/oauth/oauth-success", (req: Req, res: Res) => {
  if (req.session.loggedIn) {
    database.oauthConnections.push({ oauthClientId: req?.oidc.user!.sub, userId: req.session.userId! });
  } else {
    const user = getOauthUser(req?.oidc?.user?.sub ?? "");
    if (user) {
      req.session.access = user.access;
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;
    }
  }
  res.oidc.logout({
    returnTo: "/login"
  });
});

router.use("/", oauthRouter);


//new admin - only if no users exist
router.get("/new-admin", requireNotLoggedIn, requireNoUsers, newAdmin);
router.post("/new-admin", requireNotLoggedIn, requireNoUsers, newAdminPost);

router.post("/load-backup", requireNotLoggedIn, requireNoUsers, loadBackup);

export { router as noAuthRouter }