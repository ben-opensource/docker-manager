import { getBackup } from "@/config/backups.js";
import { loadDbFromBackup } from "@/database/database.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const downloadBackup = (req: Req, res: Res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="backup.json"');

  res.send(getBackup());
}

const loadBackup = (req: Req, res: Res) => {
  const jsonData = req.body;
  try {
    loadDbFromBackup(jsonData);   
  } catch (error) {
    console.error(error);
  }
  res.redirect("/login");
}

export {
  downloadBackup,
  loadBackup
}