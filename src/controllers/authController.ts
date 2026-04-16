import { Access, createNewUser, database, getOauthUser, getUserFromLogin, userAlreadyExists } from "@/database/database.js";
import { logLOGIN } from "@/database/logger.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const logout = (req: Req, res: Res) => {
  req.session.requireSignIn = false;
}
const login = (req: Req, res: Res) => {
  res.render("login", {
    title: "Login",
    errorMessage: "",
    username: "",
    password: ""
  });
}
const loginMiddlewarePost = (req: Req, res: Res, next: Next) => {
  const { username, password } = req.body;
  const user = getUserFromLogin(username, password);
  if (user && user.access != Access.NONE) {
    res.locals.user = user;
    next();
    return;
  }
  res.render("login", {
    title: "Login",
    errorMessage: "Invalid Login!",
    username,
    password
  });
}
const finalizeLogin = (req: Req, res: Res) => {
  const { username, access, id } = res.locals.user
  req.session.username = username;
  req.session.loggedIn = true;
  req.session.access = access;
  req.session.userId = id;
  logLOGIN(id);
  res.oidc.logout({//dont actually stay logged in to auth0
    returnTo: "/dashboard"
  });
}
const oauthLoginMiddleware = (req: Req, res: Res) => {
  const user = getOauthUser(req?.oidc?.user?.sub ?? "");
  if (!user || user.access == Access.NONE) {
    res.redirect("/oauth-logout");
    return;
  }
  res.locals.user = user;
}
const oauthLogin = (req: Req, res: Res) => {
  res.oidc.login({
    returnTo: '/oauth/oauth-success',
    authorizationParams: { screen_hint: 'signin', scope: "openid profile email" },
  });
}
const oauthSuccess = (req: Req, res: Res) => {
  if (req.session.loggedIn) {
    if (database.oauthConnections.filter(c => c.oauthClientId == req?.oidc.user!.sub).length == 0)
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
const oauthLogout = (req: Req, res: Res) => {
  res.oidc.logout({
    returnTo: "/login"
  });
}

const newAdmin = ( req: Req, res: Res) => {
  res.render("new-admin", {
    title: "New Admin",
    errorMessage: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
}
const newAdminPost = ( req: Req, res: Res) => {
  const { username, password, confirmPassword } = req.body;
  const renderData = {
    title: "New Admin",
    errorMessage: "",
    username,
    password,
    confirmPassword
  };
  if (password != confirmPassword) {
    res.render("new-admin", {
      ...renderData,
      errorMessage: "Passwords don't match!"
    });
    return;
  }
  if (userAlreadyExists(username)) {
    res.render("new-admin", {
      ...renderData,
      errorMessage: "Username is already used!"
    });
    return;
  }
  createNewUser(username, password, Access.ADMIN)
  res.redirect("/login");
}

export {
  login,
  loginMiddlewarePost,
  finalizeLogin,
  oauthLoginMiddleware,
  oauthLogin,
  oauthSuccess,
  oauthLogout,
  newAdmin,
  newAdminPost
}