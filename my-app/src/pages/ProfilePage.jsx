"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "../utils/toast"

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || "")
  const [isEditing, setIsEditing] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const handleSaveResume = async () => {
    // In a real app, this would make an API call to update the user profile
    toast.success("Resume updated successfully")
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
    

      <div className="container mx-auto py-12">
        

        <div className="max-w-2xl">
          <div className="card mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

            <div className="space-y-6">
              <div>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input bg-gray-100" value={user?.fullname || ""} disabled />
              </div>

              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input bg-gray-100" value={user?.email || ""} disabled />
              </div>

              <div>
                <label className="form-label">Account Type</label>
                <input
                  type="text"
                  className="form-input bg-gray-100"
                  value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || ""}
                  disabled
                />
              </div>

              {user?.role === "student" && (
                <div>
                  <label className="form-label">Resume URL</label>
                  {!isEditing ? (
                    <div className="flex gap-2">
                      <input type="text" className="form-input bg-gray-100" value={resumeUrl} disabled />
                      <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://example.com/resume.pdf"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                      />
                      <button onClick={handleSaveResume} className="btn btn-primary">
                        Save
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
