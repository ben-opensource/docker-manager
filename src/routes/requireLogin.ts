import express, { Request as Req, Response as Res } from "express";

import { containers } from "@/controllers/containers-controller.js";
import { dashboard } from "@/controllers/dashboard-controller.js";
import { requireAdmin, requireLogin } from "@/middleware/auth.js";

const router = express.Router();
router.use(requireLogin);

router.get("/dashboard", dashboard);
router.get("/dashboard/containers", containers)
router.get("/update-config", requireAdmin, (req: Req, res: Res) => {

})

export { router as requireLoginRouter }