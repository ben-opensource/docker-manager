import { Access, getUserCount } from "@/database/users.js";
import { logLOGOUT } from "@/database/logger.js";
import { getUserById } from "@/database/users.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const logoutIfForced = ( req: Req, res: Res, next: Next) => {
  if (req.session.requireSignIn) {
    res.redirect("/logout");
    return;
  }
  next();
}
const newAdminIfNoUsers = (req: Req, res: Res, next: Next) => {
  if (getUserCount() == 0) {
    res.redirect("/new-admin");
    return;
  }
  next();
}
const deleteSession = (req: Req, res: Res, next: Next) => {
  logLOGOUT(req.session.userId!)
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).json("Failed to delete session!");
      return;
    }
    next();
  });
}

const requireLogin = (req: Req, res: Res, next: Next) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
    return;
  } 
  const user = getUserById(req.session.userId ?? -1);
  if (!user) {
    res.redirect("/logout");
    return;
  } 
  res.locals.middlewareData!.isAdmin = [Access.ADMIN, Access.ADMIN_READ_ONLY].includes(user!.access ?? Access.NONE);
  res.locals.middlewareData!.hasWriteAccess = [Access.ADMIN, Access.USER].includes(user!.id);
  next();
}
const requireAdmin = (req: Req, res: Res, next: Next) => {
  if ([Access.ADMIN, Access.ADMIN_READ_ONLY].includes(req.session.access ?? Access.NONE)) {
    next();
    return;
  }
  res.redirect("/dashboard");
}
const requireWriteAccess = (req: Req, res: Res, next: Next) => {
  if ([Access.USER, Access.ADMIN].includes(req.session.access ?? Access.NONE)) {
    next();
    return;
  }
  res.redirect("/dashboard");
}
const requireNotLoggedIn = (req: Req, res: Res, next: Next) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }
  next();
}
const requireNoUsers = (req: Req, res: Res, next: Next) => {
  if (getUserCount() == 0) {
    next();
    return;
  }
  res.redirect("/login");
}


export {
  requireNotLoggedIn,
  logoutIfForced,
  requireLogin,
  newAdminIfNoUsers,
  deleteSession,
  requireNoUsers,
  requireAdmin,
  requireWriteAccess
}