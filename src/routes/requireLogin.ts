import * as authMiddleware from "@/middleware/auth.js";
import express from "express";
import { passSessionToLayout } from "@/middleware/util.js";
import * as dashboardController from "@/controllers/dashboardController.js";
import * as profileController from "@/controllers/profileController.js";
import * as containerController from "@/controllers/containersController.js"

const requireLoginRouter = express.Router();

//********** middleware **********
requireLoginRouter.use(authMiddleware.requireLogin);
requireLoginRouter.use(passSessionToLayout);

//********** routes **********
//dashboard
requireLoginRouter.get("/", dashboardController.dashboard);
//profile
requireLoginRouter.get("/profile", profileController.profile);
requireLoginRouter.get("/edit-profile", profileController.editProfile);
requireLoginRouter.post("/edit-profile", profileController.editProfilePost);
//docker
requireLoginRouter.get("/containers", containerController.containers);

export default requireLoginRouter;