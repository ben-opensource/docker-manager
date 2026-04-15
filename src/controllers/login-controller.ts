import { config } from "@/config/config.js";
import { Access, database, getOauthUser, validateUser } from "@/database/database.js";
import { logLOGIN } from "@/database/logger.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const login = (req: Req, res: Res) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login", {
    title: "Login",
    errorMessage: "",
    username: "",
    password: ""
  });
}
const loginPost = (req: Req, res: Res) => {
  const { username, password } = req.body;
  const [access, userId, loginsAllowed] = validateUser(username, password) ?? [Access.NONE, null];
  if (userId != null && access != Access.NONE) {
    req.session.username = username;
    req.session.loggedIn = true;
    req.session.access = access;
    req.session.userId = userId;
    logLOGIN(userId);
    res.redirect("/dashboard")
    return;
  }
  res.render("login", {
    title: "Login",
    errorMessage: "Invalid Login!",
    username,
    password
  });
}

const oauth = (req: Req, res: Res) => {
  res.oidc.login({
    returnTo: '/oauth/oauth-success',
    authorizationParams: { screen_hint: 'signin', scope: "openid profile email" },
  });
}
const oauthLogin = (req: Req, res: Res) => {
  const user = getOauthUser(req?.oidc?.user?.sub ?? "");
  if (!user) {
    res.redirect("/oauth-logout");
    return;
  }
  req.session.access = user.access;
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.loggedIn = true;
  res.oidc.logout({//dont actually stay logged in to auth0
    returnTo: "/dashboard"
  });
}

const confirmAddOauth = (req: Req, res: Res) => {
  if (database.oauthConnections.filter(c => c.oauthClientId == req?.oidc.user!.sub).length == 0)
    database.oauthConnections.push({ oauthClientId: req?.oidc.user!.sub, userId: req.session.userId! });
  res.oidc.logout({
    returnTo: "/login"
  });
}
const oauthSuccess = (req: Req, res: Res) => {
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
}

const logout = (req: Req, res: Res) => {
  res.oidc.logout({
    returnTo: "/login"
  });
}

export {
  login,
  loginPost,
  confirmAddOauth,
  oauthLogin,
  logout,
  oauth,
  oauthSuccess
}