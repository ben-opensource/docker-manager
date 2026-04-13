import { requireAdmin, requireWriteAccess } from "@/middleware/auth.js";
import { passSessionToLayout } from "@/middleware/util.js";
import express, { Request as Req, Response as Res } from "express";

const router = express.Router();
router.use(requireAdmin);
router.use(passSessionToLayout);

router.get("/update-config", requireWriteAccess, (req: Req, res: Res) => {

});

export { router as requireAdminRouter }