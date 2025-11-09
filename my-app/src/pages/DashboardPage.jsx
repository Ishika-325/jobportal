"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"
import api from "../utils/api"
import { toast } from "../utils/toast"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import ProfilePage from "./ProfilePage"

const DashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (user?.role) fetchDashboardData()
  }, [user?.role])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      if (user?.role === "student") {
        const response = await api.get("/applications/my")
        setData(response.data?.data || [])
      } else {
        const response = await api.get("/applications/employer")
        setData(response.data?.data || [])
      }
    } catch (error) {
      toast.error("Failed to load dashboard data")
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      if (user?.role === "student") {
        await api.delete(`/applications/${selectedItem._id}`)
        toast.success("Application withdrawn successfully")
      } else {
        await api.delete(`/jobs/${selectedItem._id}`)
        toast.success("Job deleted successfully")
      }
      setShowDeleteModal(false)
      fetchDashboardData()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus })
      toast.success(`Application status updated to ${newStatus}`)
      fetchDashboardData()
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-12">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">
            {user?.role === "student" ? "My Applications" : "Job Postings & Applications"}
          </h1>
          {user?.role === "employer" && (
            <button onClick={() => navigate("/create-job")} className="btn btn-primary">
              + Post New Job
            </button>
          )}
        </div>

        {user?.role === "student" ? (
          <StudentDashboard
            data={data || []}
            onDelete={(item) => {
              setSelectedItem(item)
              setShowDeleteModal(true)
            }}
          />
        ) : (
          <EmployerDashboard
            data={data || []}
            onStatusChange={handleStatusChange}
            onDelete={(item) => {
              setSelectedItem(item)
              setShowDeleteModal(true)
            }}
            onEdit={(jobId) => navigate(`/edit-job/${jobId}`)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this?</p>
              <div className="flex gap-4">
                <button onClick={handleDelete} className="btn btn-danger flex-1">
                  Delete
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const StudentDashboard = ({ data = [], onDelete }) => {
  if (!Array.isArray(data)) data = [] // safeguard

  return (
    <div className="space-y-4">
      <ProfilePage />
      {data.length > 0 ? (
        data.map((application) => (
          <div key={application._id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{application.jobId?.title || "Job Posting"}</h3>
                <p className="text-gray-600 mb-3">{application.jobId?.company || "Company"}</p>
                <div className="flex gap-2 items-center">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor:
                        application.status === "accepted"
                          ? "#dcfce7"
                          : application.status === "rejected"
                            ? "#fee2e2"
                            : "#fef3c7",
                      color:
                        application.status === "accepted"
                          ? "#166534"
                          : application.status === "rejected"
                            ? "#991b1b"
                            : "#92400e",
                    }}
                  >
                    {application.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : "Pending"}
                  </span>
                  <span className="text-gray-600 text-sm">
                    Applied {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
              <button onClick={() => onDelete(application)} className="btn btn-danger">
                Withdraw
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 card">
          <p className="text-gray-600 text-lg">You haven't applied to any jobs yet.</p>
        </div>
      )}
    </div>
  )
}

const EmployerDashboard = ({ data = [], onStatusChange, onDelete, onEdit }) => {
  if (!Array.isArray(data)) data = []

  return (
    <div className="space-y-6">
      {data.length > 0 ? (
        data.map((application) => (
          <div key={application._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{application.jobId?.title || "Job"}</h3>
                <p className="text-gray-600 mb-3">Applicant: {application.userId?.name || "N/A"}</p>
              </div>
              <select
                value={application.status || "pending"}
                onChange={(e) => onStatusChange(application._id, e.target.value)}
                className="form-select w-auto"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex gap-2">
              {application.resumeUrl && (
                <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  View Resume
                </a>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 card">
          <p className="text-gray-600 text-lg">No applications received yet.</p>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
