import { getUserCount, roleHasPermission } from "@database/users.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express"
export const requireNoUsers = async (req: Req, res: Res, next: Next) => {
  if (await getUserCount() !== 0)
    return res.redirect("/login");
  next();
}
export const firstUserIfNoUsers = async (req: Req, res: Res, next: Next) => {
  if (await getUserCount() === 0)
    return res.redirect("/new-first-user");
  next();
}
export const requireLogin = (req: Req, res: Res, next: Next) => {
  if (!req.session.loggedIn)
    return res.redirect("/login");
  next();
}
export const requireNotLoggedIn = (req: Req, res: Res, next: Next) => {
  if (req.session.loggedIn)
    return res.redirect("/dashboard");
  next();
}
export const requirePermission = (code: number, onFail = (req: Req, res: Res) => res.redirect("/dashboard")) => {
  return async (req: Req, res: Res, next: Next) => {
    if (await roleHasPermission(req.session.user?.role, code)) {
      return next();
    }
    onFail(req,res);
  }
}
export const requireAdmin = requirePermission(0);
