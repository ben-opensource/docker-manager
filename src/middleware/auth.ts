import { Request as Req, Response as Res, NextFunction as Next } from "express";
import { Access, getUser, getUserCount } from "@/database/database.js";
import { logLOGOUT } from "@/database/logger.js";

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
const forceExpireSession = (req: Req, res: Res, next: Next) => {
  if (!getUser(req.session.userId ?? -1)?.requireSignIn) {
    next();
  }
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).json("Failed to delete session!");
      return;
    }
    res.redirect("/login");
  });
}
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
  const user = getUser(req.session.userId ?? -1);
  if (user?.requireSignIn) { //todo test later
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.status(500).json("Failed to delete session!");
        return;
      }
      res.redirect("/login");
      return;
    });
  } else {
    res.locals.middlewareData!.isAdmin = [Access.ADMIN, Access.ADMIN_READ_ONLY].includes(user!.access ?? 0);
    res.locals.middlewareData!.hasWriteAccess = [Access.ADMIN, Access.USER].includes(user!.id);
    next();
  }
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

const requireStackAccess = (req: Req, res: Res, next: Next) => {
  //if admin -> always access
  //if not admin -> check if access to the stack
  next();
}
const requireContainerAccess = (req: Req, res: Res, next: Next) => {
  //if admin -> always access
  //if not admin -> check if access to the stack
  next();
}
const requireNotLoggedIn = (req: Req, res: Res, next: Next) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
    return;
  }
  next();
}



export {
  newAdminIfNoUsers,
  requireNoUsers,
  requireAdmin,
  requireLogin,
  requireNotLoggedIn,
  requireStackAccess,
  requireContainerAccess,
  requireWriteAccess,
  deleteSession,
  forceExpireSession
}