import express, { Request as Req, Response as Res } from "express";
import bodyParser from "body-parser";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";

import { loadConfig } from "@/config/config.js"
import { requireLoginRouter } from "@/routes/requireLogin.js";
import { noAuthRouter } from "@/routes/noAuth.js";
import { requireAdminRouter } from "@/routes/requireAdmin.js";

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

//********** routers **********
app.use("/", noAuthRouter);
app.use("/", requireLoginRouter);
app.use("/", requireAdminRouter);


//********** start **********
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});