import { getLogs } from "@/database/logger.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const logs = (req: Req, res: Res) => {
  let pageNum = 0;
  let logsPerPage = 10;
  res.render("dashboard/logs", {
    title: "Logs",
    layout: "dashboard/layout",
    logs: getLogs(pageNum * logsPerPage, logsPerPage),
  });
}

export {
  logs
}