import { Job } from "../models/job.models.js";
import { Application}  from "../models/application.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ======================================================
   🧩 Create Job (Employer Only)
   ====================================================== */
export const createJob = asyncHandler(async (req, res) => {
  const { title, description, location, type, salary, companyName } = req.body;

  if (!title || !description || !location || !type || !salary) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Only employer can post jobs
  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can create job posts");
  }

  const job = await Job.create({
    title,
    description,
    location,
    type,
    salary,
    companyName,
    postedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Job created successfully",
    job,
  });
});

/* ======================================================
   🧾 Get All Jobs (For Students)
   ====================================================== */
export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate("postedBy", "fullname email company");
  res.status(200).json({
    success: true,
    count: jobs.length,
    jobs,
  });
});

/* ======================================================
   🔍 Get Job By ID
   ====================================================== */
export const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id).populate("postedBy", "fullname email company");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  res.status(200).json({
    success: true,
    job,
  });
});

/* ======================================================
   ✏️ Update Job (Employer Only)
   ====================================================== */
export const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) throw new ApiError(404, "Job not found");
  if (req.user.role !== "employer" || job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this job");
  }

  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    job: updatedJob,
  });
});

/* ======================================================
   🗑️ Delete Job (Employer Only)
   ====================================================== */
export const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) throw new ApiError(404, "Job not found");
  if (req.user.role !== "employer" || job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this job");
  }

  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});

/* ======================================================
   📥 Apply to Job (Student Only)
   ====================================================== */
export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  if (req.user.role !== "student") {
    throw new ApiError(403, "Only students can apply to jobs");
  }

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: req.user._id,
  });

  if (existingApplication) {
    throw new ApiError(400, "You already applied to this job");
  }

  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Applied successfully",
    application,
  });
});

/* ======================================================
   👥 View Applicants (Employer Only)
   ====================================================== */
export const viewApplicants = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  if (req.user.role !== "employer" || job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to view applicants for this job");
  }

  const applicants = await Application.find({ job: jobId }).populate(
    "applicant",
    "fullname email profile.resumeUrl"
  );

  res.status(200).json({
    success: true,
    count: applicants.length,
    applicants,
  });
});
