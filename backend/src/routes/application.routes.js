import express from "express";
import {
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected Routes
router.get("/my", verifyJWT, getMyApplications);
router.get("/employer", verifyJWT, getEmployerApplications);

router.delete("/:id", verifyJWT, withdrawApplication);


router.put("/:id/status", verifyJWT, updateApplicationStatus)

export default router
