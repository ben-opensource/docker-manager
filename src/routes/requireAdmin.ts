import { requireAdmin } from "@/middleware/auth.js";
import express, { Request as Req, Response as Res } from "express";

const router = express.Router();
router.use(requireAdmin);

router.get("/update-config", requireAdmin, (req: Req, res: Res) => {

});

export { router as requireAdminRouter }