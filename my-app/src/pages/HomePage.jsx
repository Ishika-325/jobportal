"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../utils/api";
import { toast } from "../utils/toast";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  useEffect(() => {
    fetchJobs();
    if (user?.role === "student") {
      fetchAppliedJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs", { withCredentials: true });
      const jobsData = Array.isArray(response.data.jobs)
        ? response.data.jobs
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await api.get("/applications/my", { withCredentials: true });
      const applied = res.data.data.map((app) => app.job._id);
      setAppliedJobs(applied);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  const filteredJobs = (jobs || []).filter(
    (job) =>
      job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (jobId) => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    navigate(`/job/${jobId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900  mb-8">
            Find Your Dream Job
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Browse opportunities from top employers
          </p>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApply={handleApply}
                isEmployer={user?.role === "employer"}
                appliedJobs={appliedJobs}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">
              No jobs found. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
