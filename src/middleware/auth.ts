import { Request as Req, Response as Res, NextFunction as Next } from "express";
import { getUser, getUserCount } from "@/database/database.js";

const deleteSession = (req: Req, res: Res, next: Next) => {
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
  } else if (getUser(req.session.userId ?? -1)?.requireSignIn) {
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
    next();
  }
}

const requireAdmin = (req: Req, res: Res, next: Next) => {
  if (["ADMIN", "ADMIN_READ_ONLY"].includes(req.session.access ?? "")) {
    next();
    return;
  }
  res.redirect("/dashboard");
}
const requireWriteAccess = (req: Req, res: Res, next: Next) => {
  if (["USER", "ADMIN"].includes(req.session.access ?? "")) {
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