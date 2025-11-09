import  Application  from "../models/application.models.js";
import  Job  from "../models/job.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ======================================================
   🧾 Get All Applications for Logged-in Student
   ====================================================== */
export const getMyApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    throw new ApiError(403, "Only students can view their applications");
  }

  const applications = await Application.find({ applicant: req.user._id })
    .populate("job", "title companyName location type salary")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

/* ======================================================
   👥 Get All Applications for Employer's Posted Jobs
   ====================================================== */
export const getEmployerApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can view job applications");
  }

  // Find all jobs posted by this employer
  const employerJobs = await Job.find({ postedBy: req.user._id }).select("_id");

  const applications = await Application.find({
    job: { $in: employerJobs.map((job) => job._id) },
  })
    .populate("job", "title location")
    .populate("applicant", "fullname email profile.resumeUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications,
  });
});

/* ======================================================
   ✏️ Update Application Status (Employer Only)
   ====================================================== */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can update application status");
  }

  const validStatuses = ["Pending", "Accepted", "Rejected"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const application = await Application.findById(applicationId).populate("job");
  if (!application) throw new ApiError(404, "Application not found");

  // Ensure employer owns the job
  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this application");
  }

  application.status = status;
  await application.save();

  res.status(200).json({
    success: true,
    message: `Application status updated to ${status}`,
    application,
  });
});

/* ======================================================
   🗑️ Delete an Application (Student Withdraw)
   ====================================================== */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "student") {
    throw new ApiError(403, "Only students can withdraw applications");
  }

  const application = await Application.findById(id);
  if (!application) throw new ApiError(404, "Application not found");

  if (application.applicant.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this application");
  }

  await application.deleteOne();

  res.status(200).json({
    success: true,
    message: "Application withdrawn successfully",
  });
});
