import { Access, addUser, addOauthConnection, getUserFromOauth, getUserFromLogin, LoginsAllowed, oauthConnectionExists, userExists } from "@/database/users.js";
import { logLOGIN, logNEW_USER, logOAUTH_LOGIN } from "@/database/logger.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";
import { Validator } from "@/middleware/validator.js";

// const logout = (req: Req, res: Res) => {
//   req.session.requireSignIn = false;
// }
const login = (req: Req, res: Res) => {
  res.render("login", {
    title: "Login",
    errorMessage: "",
    username: "",
    password: ""
  });
}

export const loginPost = [
  new Validator((req,res)=>{
    logLOGIN(-1, `invalid login attempt-username:${req.body.username},password:${req.body.password}`);
    res.render("login", {
      title: "Login",
      errorMessage: res.locals.validatorError,
      username: req.body.username,
      password: req.body.password
    });
  }).body("username").notEmptyString("Invalid username")
  .setProp("password").notEmptyString("Invalid password")
  .custom("Invalid login", (value,req,res) => {
    const user = getUserFromLogin(req.body.username, req.body.password);
    if (!user || user.access == Access.NONE) 
      return false;
    res.locals.user = user;
    return true;
  }).getMiddleware(),
  (req: Req, res: Res) => {
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
]

const oauthLoginMiddleware = (req: Req, res: Res, next: Next) => {
  const user = getUserFromOauth(req?.oidc?.user?.sub ?? "");
  if (!user || user.access == Access.NONE)
    return res.redirect("/oauth-logout")
  res.locals.user = user;
  next();
}
const oauthLogin = (req: Req, res: Res) => {
  res.oidc.login({
    returnTo: '/oauth/oauth-success',
    authorizationParams: { screen_hint: 'signin', scope: "openid profile email" },
  });
}
const oauthSuccess = (req: Req, res: Res) => {
  if (req.session.loggedIn) {
    if (!oauthConnectionExists(req?.oidc.user!.sub ?? 0))
      addOauthConnection({ oauthClientId: req?.oidc.user!.sub, userId: req.session.userId! });
  } else {
    const user = getUserFromOauth(req?.oidc?.user?.sub ?? "");
    if (user) {
      req.session.access = user.access;
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;
      logOAUTH_LOGIN(user.id, req?.oidc?.user?.sub);
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

export const newAdminPost = [
  new Validator((req,res)=> {
    return res.render("new-admin", {
      title: "New Admin",
      username: req.body.username,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      errorMessage: res.locals.validatorError
    });
  }).body("username").notEmptyString("Invalid username")
    .setProp("password").notEmptyString("Invalid password")
    .setProp("confirmPassword").notEmptyString("Invalid password confirmation")
    .custom("Passwords don't match", (value,req,res) => req.body.password === req.body.confirmPassword)
    .custom("Username already exists", (value,req,res) => !userExists(req.body.username))
    .getMiddleware(),
  (req: Req, res: Res) => {
    addUser({ username:req.body.username, password:req.body.password, access: Access.ADMIN, loginsAllowed: LoginsAllowed.ALL });
    logNEW_USER(req.body.username);
    res.redirect("/login");
  }
]

export {
  login,
  oauthLoginMiddleware,
  oauthLogin,
  oauthSuccess,
  oauthLogout,
  newAdmin,
}