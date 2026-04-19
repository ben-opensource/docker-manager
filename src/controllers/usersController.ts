import { logNEW_USER } from "@/database/logger.js";
import { Access, accessToCode, addUser, LoginsAllowed, loginsAllowedToCode, userExists } from "@/database/users.js";
import { getUsers } from "@/database/users.js";
import { Validator } from "@/middleware/validator.js";
import { Request as Req, Response as Res, NextFunction as next } from "express";

const users = (req: Req, res: Res) => {
  res.render("dashboard/users", {
    title: "Users",
    layout: "dashboard/layout",
    users: getUsers()
  });
}

const newUser = (req: Req, res: Res) => {
  res.render("dashboard/new-user", {
    title: "New User",
    layout: "dashboard/layout",
    errorMessage: "",
    username: "",
    access: Access.USER_READ_ONLY,
    password: "",
    confirmPassword: ""
  });
}

const newUserPost2 = (req: Req, res: Res) => {
  let errorMessage = "";
  const { username, password, confirmPassword, access, loginsAllowed } = req.body;
  if (userExists(username)) {
    errorMessage = "Username is already used!";
    logNEW_USER(username, "username exists");
  } else if (password != confirmPassword) {
    errorMessage = "Passwords must match!";
    logNEW_USER(username, "passwords don't match");
  } else if (!accessToCode[access] || accessToCode[access] == Access.NONE) {
    errorMessage = "Invalid access role!";
    logNEW_USER(username, "invalid access role");
  } else {
    addUser({ username, password, access: accessToCode[access] ?? Access.NONE, loginsAllowed: loginsAllowedToCode[loginsAllowed] ?? LoginsAllowed.ALL });
    logNEW_USER(username);
    return res.redirect("/dashboard/users");
  }
  res.render("dashboard/new-user", {
    title: "New User",
    layout: "dashboard/layout",
    errorMessage,
    username,
    access: access ?? Access.USER_READ_ONLY,
    password,
    confirmPassword
  });
}
const newUserPost = [
  new Validator((req,res) => {
    logNEW_USER(req.body.username, res.locals.validatorError);
      res.render("dashboard/new-user", {
      title: "New User",
      layout: "dashboard/layout",
      errorMessage: res.locals.validatorError,
      username: req.body.username,
      access: req.body.access ?? Access.USER_READ_ONLY,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    });
  }).body("username").notEmptyString("Invalid username").isString("Username is already used", u => !userExists(u))
  .setProp("password").notEmptyString("Invalid password")
  .setProp("confirmPassword").notEmptyString("Invalid password confirmation").custom("passwords must match", (value,req) => value === req.body.password)
  .setProp("access").isString("Invalid access", a => a in accessToCode && accessToCode[a] !== Access.NONE)
  .setProp("loginsAllowed").isString("Invalid login permission", l => l in loginsAllowedToCode)
  .getMiddleware(),
  (req: Req, res: Res) => {
    const { username, password, access, loginsAllowed } = req.body;
    addUser({ username, password, access: accessToCode[access] ?? Access.NONE, loginsAllowed: loginsAllowedToCode[loginsAllowed] ?? LoginsAllowed.ALL });
    logNEW_USER(username);
    return res.redirect("/dashboard/users");
  }
];

const editUser = (req: Req, res: Res) => {
  //todo get id from url param and check if user exists
  res.render("dashboard/edit-user", {
    title: "Edit User",
    layout: "dashboard/layout",
    //todo pass user data
  });
}

export {
  users,
  newUser,
  editUser,
  newUserPost
}