import "express-session";

declare module "express-session" {
  interface SessionData {
    username?: string;
    userId?: number;
    loggedIn?: bool,
    access: "ADMIN" | "USER" | "NONE";
  }
}
//declare module "express-session"