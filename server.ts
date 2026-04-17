import express, { Request as Req, Response as Res, NextFunction as Next } from "express";
import bodyParser from "body-parser";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";

//import { loadConfig } from "@/config/config.js"
import { auth } from "express-openid-connect";
import noAuthRouter from "@/routes/noAuth.js";
import requireLoginRouter from "@/routes/requireLogin.js";
import requireAdminRouter from "@/routes/requireAdmin.js";
import { initializeDatabase } from "@/database/db.js";
import { addUser, getUserById, getUserCount, LoginsAllowed } from "@/database/users.js";
import { Access } from "@/database/users.js";

//********** init **********
const app = express();
const PORT = 3000;

//loadConfig();
initializeDatabase();
// console.log(getUserById(1))
//addUser({ username: "test123", password: "123", access: Access.ADMIN, loginsAllowed: LoginsAllowed.ALL })
// console.log(getUserById(1))

//********** middleware **********
// app.use((req, res, next) => {
//   console.log("url: " +req.url);
//   next();
// });
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(auth({
    authRequired: false, 
    auth0Logout: true,
    secret: process.env.SESSION_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    routes: {
      callback: "/oauth/callback",
      login: "/oauth/login",
      logout: "/oauth/logout"
    },
    idpLogout: true
  }));
app.use((req: Req, res: Res, next: Next) => {
  res.locals.middlewareData = {};
  next();
});


app.use(session({
    secret: process.env.SESSION_SECRET ?? "",
    resave: false,
    saveUninitialized: false,
}));

//********** routers **********
app.use("/", noAuthRouter);
app.use("/dashboard", requireLoginRouter);
app.use("/dashboard", requireAdminRouter);


//********** start **********
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});