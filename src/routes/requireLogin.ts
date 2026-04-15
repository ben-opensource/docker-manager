import express from "express";

import { containers } from "@/controllers/containers-controller.js";
import { dashboard } from "@/controllers/dashboard-controller.js";
import { requireLogin } from "@/middleware/auth.js";
import { editProfile, editProfilePost, profile } from "@/controllers/profile-controller.js";
import { passSessionToLayout } from "@/middleware/util.js";

const router = express.Router();

//********** middleware **********
router.use(requireLogin);
router.use(passSessionToLayout);

//********** routes **********
router.get("/", dashboard);
router.get("/profile", profile);
router.get("/edit-profile", editProfile);
router.post("/edit-profile", editProfilePost);
router.get("/containers", containers)



export { router as requireLoginRouter }