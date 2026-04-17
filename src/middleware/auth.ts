import { Access, getUserCount } from "@/database/users.js";
import { logLOGOUT } from "@/database/logger.js";
import { getUserById } from "@/database/users.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const logoutIfForced = ( req: Req, res: Res, next: Next) => {
  if (req.session.requireSignIn) 
    return res.redirect("/logout");
  next();
}
const newAdminIfNoUsers = (req: Req, res: Res, next: Next) => {
  if (getUserCount() == 0) {
    return res.redirect("/new-admin");
  }
  next();
}
const deleteSession = (req: Req, res: Res, next: Next) => {
  logLOGOUT(req.session.userId!)
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json("Failed to delete session!");
    }
    next();
  });
}

const requireLogin = (req: Req, res: Res, next: Next) => {
  if (!req.session.loggedIn)
    return res.redirect("/login");
  const user = getUserById(req.session.userId ?? -1);
  if (!user)
    return res.redirect("/logout");
  res.locals.middlewareData!.isAdmin = [Access.ADMIN, Access.ADMIN_READ_ONLY].includes(user!.access ?? Access.NONE);
  res.locals.middlewareData!.hasWriteAccess = [Access.ADMIN, Access.USER].includes(user!.id);
  next();
}
const requireAdmin = (req: Req, res: Res, next: Next) => {
  if ([Access.ADMIN, Access.ADMIN_READ_ONLY].includes(req.session.access ?? Access.NONE))
    return next();
  res.redirect("/dashboard");
}
const requireWriteAccess = (req: Req, res: Res, next: Next) => {
  if ([Access.USER, Access.ADMIN].includes(req.session.access ?? Access.NONE))
    return next();
  res.redirect("/dashboard");
}
const requireNotLoggedIn = (req: Req, res: Res, next: Next) => {
  if (req.session.loggedIn) 
    return res.redirect("/dashboard");
  next();
}
const requireNoUsers = (req: Req, res: Res, next: Next) => {
  if (getUserCount() == 0)
    return next();
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