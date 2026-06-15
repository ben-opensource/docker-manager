import { permissions } from "@database/defaultRoles.js";
import { createUser, getRoles, getUsers } from "@database/users.js";
import { requireLogin, requirePermission } from "@middleware/authMiddleware.js";
import express, { Request as Req, Response as Res, NextFunction as Next } from "express";
const router = express.Router();

router.get("/dashboard", requireLogin, (req:Req,res:Res)=> {
  res.render("dashboard/dashboard", {
    title: "Home",
    layout: "dashboard/layout",
    activePage: "dashboard-home"
  });
});
router.get("/user/add", requireLogin, requirePermission(permissions["user:create"]), async (req:Req,res:Res)=> {
  res.render("dashboard/newUser", {
    title: "New User",
    roles: await getRoles(),
    fields: {},
    errorMessages: {},
    layout: "dashboard/layout",
    activePage: "users-add"
  });
});
router.post("/user/add", requireLogin, requirePermission(permissions["user:create"]), async (req:Req,res:Res) => {
  const { username, password, confirmPassword, role } = req.body;
    const errorMessages: {[key:string]:string} = {};
    if (!username)
      errorMessages.username = "Username is required!";
    if (!password)
      errorMessages.password = "Password is required!";
    if (password !== confirmPassword)
      errorMessages.confirmPassword = "Passwords must match!"
    if (Object.entries(errorMessages).length !== 0) {
      return res.render("dashboard/newUser", {
        title: "New User",
        fields: {
          username
        },
        errorMessages,
        layout: "dashboard/layout",
        activePage: "users-add"
      });
    }
    const success = await createUser(username, password, role);
    if (success)
      return res.redirect("/user/add");
    res.render("dashboard/newUser", {
      title: "New User",
      roles: await getRoles(),
      fields: {
        username
      },
      errorMessages: {},
      layout: "dashboard/layout",
      activePage: "users-add"
    });
});
router.get("/users/get", requireLogin, requirePermission(permissions["user:get"]), async (req:Req,res:Res) => {
  res.render("dashboard/getUsers", {
    title: "Users",
    errorMessages: {},
    users: await getUsers(),
    layout: "dashboard/layout",
    activePage: "users-get"
  });
});

export default router;