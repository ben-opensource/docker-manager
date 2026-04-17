import { Access, addUser, LoginsAllowed, userExists } from "@/database/users.js";
import { getUsers } from "@/database/users.js";
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

const newUserPost = (req: Req, res: Res) => {
  let errorMessage = "";
  const { username, password, confirmPassword, access, loginsAllowed } = req.body;
  if (userExists(username)) {
    errorMessage = "Username is already used!";
  } else if (password != confirmPassword) {
    errorMessage = "Passwords must match!"
  } else if (![''+Access.ADMIN, ''+Access.USER, ''+Access.ADMIN_READ_ONLY, ''+Access.USER_READ_ONLY].includes(access)) {
    errorMessage = "Invalid access role!";
  } else {
    addUser({ username, password, access, loginsAllowed: loginsAllowed ?? LoginsAllowed.ALL });
    res.redirect("/dashboard/users");
    return;
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