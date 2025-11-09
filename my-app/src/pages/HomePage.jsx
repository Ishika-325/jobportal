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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ Safe user parsing
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    user = null;
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Safe fetchJobs
  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs", { withCredentials: true });
      console.log("Backend response:", response.data);

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

  // ✅ Safe filtering
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

      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Browse opportunities from top employers
          </p>

          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id || job.id || Math.random()}
                job={job}
                onApply={handleApply}
                isEmployer={user?.role === "employer"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No jobs found. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
