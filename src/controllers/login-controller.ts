import { Access, validateUser } from "@/database/database.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const login = (req: Req, res: Res) => {
  res.render("login", {
    title: "Login",
    errorMessage: "",
    username: ""
  });
}
const loginPost = (req: Req, res: Res) => {
  const { username, password } = req.body;
  const [validUser, userId] = validateUser(username, password) ?? ["NONE", null];
  if (validUser != "NONE" && userId != null) {
    req.session.username = username;
    req.session.loggedIn = true;
    req.session.access = validUser;
    req.session.userId = userId;
    res.redirect("/dashboard")
    return;
  }
  res.render("login", {
    title: "Login",
    errorMessage: "Invalid Login!",
    username: username
  });
}

export {
  login,
  loginPost
}