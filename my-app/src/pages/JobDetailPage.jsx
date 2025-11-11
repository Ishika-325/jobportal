import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"
import api from "../utils/api"
import { toast } from "../utils/toast"
import { useAuth } from "../contexts/AuthContext"

const JobDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [resumeUrl, setResumeUrl] = useState("")

  useEffect(() => {
    fetchJobDetails()
  }, [id])

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`)
      setJob(response.data.job) // ✅ correct key
    } catch (error) {
      toast.error("Failed to load job details")
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!resumeUrl.trim()) {
      toast.error("Please enter your resume URL")
      return
    }

    setApplying(true)
    try {
      await api.post("/jobs/apply", { jobId: id, resumeUrl }) // ✅ correct route
      toast.success("Application submitted successfully!")
      setShowModal(false)
      navigate("/dashboard")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application")
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!job) return <div className="text-center py-12">Job not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-12">
        <button onClick={() => navigate("/")} className="mb-8 text-blue-600 hover:text-blue-700 font-semibold">
          ← Back to Jobs
        </button>

        <div className="max-w-3xl">
          <div className="card mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{job.title}</h1>
                <p className="text-xl text-gray-600">{job.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-gray-600 text-sm">Location</p>
                <p className="font-semibold text-slate-900">{job.location}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Salary</p>
                <p className="font-semibold text-slate-900">${job.salary}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Type</p>
                <p className="font-semibold text-slate-900">{job.type}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Posted</p>
                <p className="font-semibold text-slate-900">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Role</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Requirements</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
            </div>

            {user?.role === "student" && (
              <button onClick={() => setShowModal(true)} className="btn btn-primary w-full md:w-auto">
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Submit Application</h2>

            <div className="form-group mb-6">
              <label className="form-label">Resume URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/resume.pdf"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button onClick={handleApply} disabled={applying} className="btn btn-primary flex-1">
                {applying ? "Submitting..." : "Submit Application"}
              </button>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobDetailPage
