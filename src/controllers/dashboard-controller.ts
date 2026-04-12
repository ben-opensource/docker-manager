import { Request as Req, Response as Res, NextFunction as Next } from "express";

const dashboard = (req: Req, res: Res) => {
  res.render("dashboard/dashboard", {
    title: "Login",
    layout: "dashboard/layout"
  });
}

export {
  dashboard
}