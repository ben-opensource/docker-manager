import { Access, getUserFromLogin, LoginsAllowed, updateUser, userExists} from "@/database/users.js";
import { Validator } from "@/middleware/validator.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

export const profile = (req: Req, res: Res) => {
  res.render("dashboard/user-profile", {
    title: "Profile",
    layout: "dashboard/layout"
  });
}
export const editProfile = (req: Req, res: Res) => {
  res.render("dashboard/edit-user-profile", {
    title: "Edit Profile",
    layout: "dashboard/layout",
    username: req.session.username,
    errorMessage: "",
    lastEnteredPassword: "",
    lastEnteredNewPassword: "",
    lastEnteredConfirmPassword: ""
  });
}

export const editProfilePost = [
  new Validator((req,res) => {
    res.render("dashboard/edit-user-profile", {
      title: "Edit Profile",
      layout: "dashboard/layout",
      username: req.body.username,
      errorMessage: res.locals.validatorError,
      lastEnteredPassword: req.body.currentPassword,
      lastEnteredNewPassword: req.body.newPassword,
      lastEnteredConfirmPassword: req.body.confirmNewPassword
    });
  }).body("username").notEmptyString("Invalid username").custom("Username is already used", (u,req,res) => u === req.session.username || !userExists(u))
  .setProp("currentPassword").notEmptyString("Invalid password").custom("Invalid login", (p,req,res) => getUserFromLogin(req.session.username ?? '_',p) !== null)
  .setProp("newPassword").notEmptyString("Invalid new password")
  .setProp("confirmNewPassword").custom("New passwords must match", (c,req) => c === req.body.newPassword)
  .getMiddleware(),
  (req:Req,res:Res) => {
    const { username, newPassword } = req.body;
    updateUser({id: req.session.userId!, username, password: newPassword, access: req.session.access ?? Access.USER_READ_ONLY, loginsAllowed: LoginsAllowed.ALL /** todo change */});
    req.session.username = username;
    return res.redirect("/dashboard/profile");
  }
]