import { createUser, getUserFromLogin } from "@database/users.js";
import { firstUserIfNoUsers, requireNotLoggedIn, requireNoUsers } from "@middleware/authMiddleware.js";
import express, { Request as Req, Response as Res, NextFunction as Next } from "express";
const router = express.Router();

router.get("/new-first-user", requireNotLoggedIn, requireNoUsers, (req: Req, res: Res) => {
  res.render("auth/newFirstUser", {
    title: "Create First User",
    fields: {},
    errorMessages: {}
  })
});
router.post("/new-first-user", requireNotLoggedIn, requireNoUsers, async (req: Req, res: Res) => {
  const { username, password, confirmPassword } = req.body;
  const errorMessages: {[key:string]:string} = {};
  if (!username)
    errorMessages.username = "Username is required!";
  if (!password)
    errorMessages.password = "Password is required!";
  if (password !== confirmPassword)
    errorMessages.confirmPassword = "Passwords must match!"
  if (Object.entries(errorMessages).length !== 0) {
    return res.render("auth/newFirstUser", {
      title: "create First User",
      fields: {
        username
      },
      errorMessages
    })
  }
  createUser(username, password, 1);
  res.redirect("/login");
});
router.get("/login", requireNotLoggedIn, firstUserIfNoUsers, (req: Req, res: Res) => {
  res.render("auth/login", {
    title: "Login",
    fields: {},
    errorMesages: {}
  });
});
router.post("/login", requireNotLoggedIn, firstUserIfNoUsers, async (req: Req, res: Res) => {
  const { username, password } = req.body;
  const errorMessages: {[key:string]:string} = {};
  if (!username)
    errorMessages.username = "Username is required!";
  if (!password)
    errorMessages.password = "Password is required!";
  const user = await getUserFromLogin(username, password);
  if (Object.entries(errorMessages).length === 0 && user) {
    req.session.user = {
      username,
      role: user.role_id
    };
    req.session.loggedIn = true;
    return res.redirect("/dashboard");
  }
  res.render("auth/login", {
    title: "Login",
    fields: {
      username
    },
    errorMessages
  });
});

export default router;