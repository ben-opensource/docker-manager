import { getBackup } from "@/config/backups.js";
import { Access, addUser, LoginsAllowed, loginTypes, userExists, userRoles } from "@/database/users.js";
import { positiveIntOrNull, stringOrNull } from "@/database/validation.js";
import { Request as Req, Response as Res, NextFunction as Next } from "express";

const loadDbFromBackup = (data: any) => {
  //const data = JSON.parse(jsonString);
  if (data?.users && data.users.length && data.users.length > 0) {
    const users = data.users as { id?: number, username?: string, password?: string, access?: Access, loginsAllowed?: LoginsAllowed}[];
    for (let user of users) {
      const id = positiveIntOrNull(user.id) 
      const username = stringOrNull(user.username, u => !userExists(u));
      const password = stringOrNull(user.password);
      const access = positiveIntOrNull(user.access, a => userRoles.includes(a));
      const loginsAllowed = positiveIntOrNull(user.loginsAllowed, l => loginTypes.includes(l));
      if ([id, username, password, access, loginsAllowed].includes(null))
        continue;
      addUser({username: username as string, password: password as string, access: access as Access, loginsAllowed: loginsAllowed as LoginsAllowed});
    }
  }
}

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