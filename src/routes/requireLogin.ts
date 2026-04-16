import * as authMiddleware from "@/middleware/auth.js";
import express from "express";
import { passSessionToLayout } from "@/middleware/util.js";
import * as dashboardController from "@/controllers/dashboard-controller.js";
import * as profileController from "@/controllers/profile-controller.js";
import * as containerController from "@/controllers/containers-controller.js"

const requireLoginRouter = express.Router();
requireLoginRouter.use(authMiddleware.requireLogin);
requireLoginRouter.use(passSessionToLayout);



requireLoginRouter.get("/", dashboardController.dashboard);
requireLoginRouter.get("/profile", profileController.profile);
requireLoginRouter.get("/edit-profile", profileController.editProfile);
requireLoginRouter.post("/edit-profile", profileController.editProfilePost);
requireLoginRouter.get("/containers", containerController.containers);

export default requireLoginRouter;