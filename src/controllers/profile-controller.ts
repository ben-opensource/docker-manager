import { Access, getUserFromLogin, LoginsAllowed, updateUser, userExists} from "@/database/users.js";
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
  if (userExists(username)) {
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
    //const [ access, userId ] = validateUser(req.session.username ?? "", currentPassword);
    const user = getUserFromLogin(req.session.username ?? '_', currentPassword)
    if (!user || user.access == Access.NONE || user.id != req.session.userId) {
      errorMessage = "Incorrect Login"
    } else {
      updateUser({id: user.id, username, password: newPassword, access: req.session.access ?? Access.USER_READ_ONLY, loginsAllowed: LoginsAllowed.ALL /** todo change */});
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