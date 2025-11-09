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
router.put("/:applicationId/status", verifyJWT, updateApplicationStatus);
router.delete("/:id", verifyJWT, withdrawApplication);

export default router;
