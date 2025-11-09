import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  viewApplicants,
} from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Protected Routes
router.post("/", verifyJWT, createJob);
router.put("/:id", verifyJWT, updateJob);
router.delete("/:id", verifyJWT, deleteJob);
router.post("/apply", verifyJWT, applyToJob);
router.get("/:jobId/applicants", verifyJWT, viewApplicants);

export default router;
