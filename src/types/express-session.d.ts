import "express-session";

declare module "express-session" {
  interface SessionData {
    username?: string;
    loggedIn?: bool
  }
}
//declare module "express-session"