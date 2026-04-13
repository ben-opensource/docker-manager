import { getContainerCount } from "@/database/docker.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const dashboard = async (req: Req, res: Res) => {
  res.render("dashboard/dashboard", {
    title: "Login",
    layout: "dashboard/layout",
    containerCount: await getContainerCount(req.session.userId ?? -1)
  });
}

export {
  dashboard
}