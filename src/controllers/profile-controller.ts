import { updateUser, userAlreadyExists, validateUser } from "@/database/database.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const profile = (req: Req, res: Res) => {
  res.render("dashboard/user-profile", {
    title: "Profile",
    layout: "dashboard/layout"
  });
}
const editProfile = (req: Req, res: Res) => {
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
const editProfilePost = (req: Req, res: Res) => {
  const { username, currentPassword, newPassword, confirmNewPassword } = req.body;
  let errorMessage = "";
  if (userAlreadyExists(username)) {
    errorMessage = "Username is already used!";
  } else if ([currentPassword, newPassword, confirmNewPassword].includes("") && [currentPassword, newPassword, confirmNewPassword].filter(p => p != "").length > 0) {
    switch ("") {
      case currentPassword:
        errorMessage = "Current password is empty!";
        break;
      case newPassword:
        errorMessage = "New password is empty!";
        break;
      case confirmNewPassword:
        errorMessage = "New password must be confirmed!";
    }
  } else if (newPassword != confirmNewPassword) {
    errorMessage = "New passwords must match!";
  } else {
    const [ access, userId ] = validateUser(req.session.username ?? "", currentPassword);
    if (access == "NONE" || userId != req.session.userId) {
      errorMessage = "Incorrect Login"
    } else {
      updateUser(userId, username, newPassword, req.session.access ?? "USER_READ_ONLY");
      req.session.username = username;
      res.redirect("/dashboard/profile");
      return;
    }
  }
  res.render("dashboard/edit-user-profile", {
    title: "Edit Profile",
    layout: "dashboard/layout",
    username,
    errorMessage,
    lastEnteredPassword: currentPassword,
    lastEnteredNewPassword: newPassword,
    lastEnteredConfirmPassword: confirmNewPassword
  });
}

export {
  profile, 
  editProfile,
  editProfilePost
}