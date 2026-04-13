import { Request as Req, Response as Res, NextFunction as Next } from "express";

import { createNewUser, userAlreadyExists } from "@/database/database.js";

const newAdmin = ( req: Req, res: Res) => {
  res.render("new-admin", {
    title: "New Admin",
    errorMessage: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
}
const newAdminPost = ( req: Req, res: Res) => {
  const { username, password, confirmPassword } = req.body;
  const renderData = {
    title: "New Admin",
    errorMessage: "",
    username,
    password,
    confirmPassword
  };
  if (password != confirmPassword) {
    res.render("new-admin", {
      ...renderData,
      errorMessage: "Passwords don't match!"
    });
    return;
  }
  if (userAlreadyExists(username)) {
    res.render("new-admin", {
      ...renderData,
      errorMessage: "Username is already used!"
    });
    return;
  }
  createNewUser(username, password, "ADMIN")
  res.redirect("/login");
}

export {
  newAdmin,
  newAdminPost
}