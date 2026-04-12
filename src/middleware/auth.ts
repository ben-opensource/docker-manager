import { Request as Req, Response as Res, NextFunction as Next } from "express";
import { getUserCount } from "@/database/database.js";

const newAdminIfNoUsers = (req: Req, res: Res, next: Next) => {
  if (getUserCount() == 0) {
    res.redirect("/new-admin");
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

const requireLogin = (req: Req, res: Res, next: Next) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
    return;
  }
  next();
}

const requireAdmin = (req: Req, res: Res, next: Next) => {
  //todo
  next();
}

const requireStackAccess = (req: Req, res: Res, next: Next) => {
  //if admin -> always access
  //if not admin -> check if access to the stack
  next();
}
const requireNotLoggedIn = (req: Req, res: Res, next: Next) => {
  //todo
  next();
}

export {
  newAdminIfNoUsers,
  requireNoUsers,
  requireAdmin,
  requireLogin,
  requireNotLoggedIn,
  requireStackAccess
}