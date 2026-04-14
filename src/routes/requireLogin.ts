import express, { Request as Req, Response as Res, NextFunction as Next } from "express";

import { containers } from "@/controllers/containers-controller.js";
import { dashboard } from "@/controllers/dashboard-controller.js";
import { deleteSession, requireAdmin, requireLogin } from "@/middleware/auth.js";
import { editProfile, editProfilePost, profile } from "@/controllers/profile-controller.js";
import { passSessionToLayout } from "@/middleware/util.js";
import { logLOGOUT } from "@/database/logger.js";

const router = express.Router();
router.use(requireLogin);
router.use(passSessionToLayout);

router.get("/logout", 
  (req: Req, res: Res, next: Next) => {
    logLOGOUT(req.session.userId!);
    next();
  }, 
  deleteSession, 
  (req: Req, res: Res) => res.redirect("/login")
);
router.get("/dashboard", dashboard);
router.get("/dashboard/profile", profile);
router.get("/dashboard/edit-profile", editProfile);
router.post("/dashboard/edit-profile", editProfilePost);
router.get("/dashboard/containers", containers)



export { router as requireLoginRouter }