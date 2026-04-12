import express, { Request as Req, Response as Res } from "express";
import bodyParser from "body-parser";
import expressLayouts from "express-ejs-layouts";

import { loadConfig, config } from "@/config/config.js"
import { newAdminIfNoUsers, requireAdmin, requireLogin, requireNoUsers } from "@/middleware/auth.js";
import { newAdmin, newAdminPost } from "@/controllers/new-admin-controller.js";

const app = express();
const PORT = 3000;

loadConfig();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set("view engine", "ejs");

app.get("/login", newAdminIfNoUsers, (req: Req, res: Res) => {
  res.render("login", {
    title: "Login",
    //layout: "layout"
  });
});

app.get("/new-admin", requireNoUsers, newAdmin);
app.post("/new-admin", requireNoUsers, newAdminPost);


app.get("/update-config", requireLogin, requireAdmin, (req: Req, res: Res) => {

})

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});