import "express-session";

declare module "express-session" {
  interface SessionData {
    username?: string;
    userId?: number;
    loggedIn?: bool,
    access: Access,
    requireSignIn?: boolean
  }
}
//declare module "express-session"