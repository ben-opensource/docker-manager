import express, { Request as Req, Response as Res } from "express";
import bodyParser from "body-parser";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";

import { loadConfig, config } from "@/config/config.js"
import { newAdminIfNoUsers, requireAdmin, requireLogin, requireNotLoggedIn, requireNoUsers } from "@/middleware/auth.js";
import { newAdmin, newAdminPost } from "@/controllers/new-admin-controller.js";
import { login, loginPost } from "@/controllers/login-controller.js";
import { dashboard } from "@/controllers/dashboard-controller.js";

//********** init **********
const app = express();
const PORT = 3000;

loadConfig();

//********** middleware **********
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(session({
    secret: process.env.SESSION_SECRET ?? "",
    resave: false,
    saveUninitialized: false,
}));


//********** routes **********
//login - new admin if no users exist
app.get("/login", requireNotLoggedIn, newAdminIfNoUsers, login);
app.post("/login", requireNotLoggedIn, newAdminIfNoUsers, loginPost);

//new admin - only if no users exist
app.get("/new-admin", requireNotLoggedIn, requireNoUsers, newAdmin);
app.post("/new-admin", requireNotLoggedIn, requireNoUsers, newAdminPost);

//dashboard
app.get("/dashboard", requireLogin, dashboard);
app.get("/update-config", requireLogin, requireAdmin, (req: Req, res: Res) => {

})


//********** start **********
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});