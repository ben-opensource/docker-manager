import express, {Request as Req, Response as Res} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import authRouter from "@routers/authRouter.js";
import "@database/database.js";
import dashboardRouter from "@routers/dashboardRouter.js";

dotenv.config();

//********** init **********
const app = express();
const PORT = parseInt(process.env.PORT ?? "3000");

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
app.use(express.static("public"));
app.use(authRouter);
app.use(dashboardRouter);

//********** start **********
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Docker Manager server running on port ${PORT}`);
});

/**
 * permissions/roles:
 * table with roles
 * join table with roles and permission numbers
 * permission numbers in enum/object
 * permission numbers: x.0 for all x.y permissions, then x.1,x.2,etc for get,set,delete,etc and permission 0.0 is all permissions
 * 
 * stacks:
 * stacks have owners and if the user doesnt have the permission to see all stacks, they can only see the ones that they own
 * by default, users can only create stacks from templates if they have the permission to create the stack or admins can create the stack and assign ownership
 * separate permission to create a stack by uploading a docker-compose file without a template
 * 
 * 
 * force logout and force password change - both individual user and role based
 */