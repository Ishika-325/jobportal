"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import api from "../utils/api"
import { toast } from "../utils/toast"

const CreateJobPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    type: "Full-time",
    company: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.requirements) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      await api.post("/jobs", formData)
      toast.success("Job posted successfully!")
      navigate("/dashboard")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-12">
        <button onClick={() => navigate("/dashboard")} className="mb-8 text-blue-600 hover:text-blue-700 font-semibold">
          ← Back to Dashboard
        </button>

        <div className="max-w-2xl">
          <div className="card">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Post a New Job</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  name="company"
                  className="form-input"
                  placeholder="Your Company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="e.g., Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    placeholder="e.g., New York, NY"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    className="form-input"
                    placeholder="e.g., 80000-120000"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Describe the job role and responsibilities..."
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Requirements</label>
                <textarea
                  name="requirements"
                  className="form-textarea"
                  placeholder="List the required skills and qualifications..."
                  rows="6"
                  value={formData.requirements}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                  {loading ? "Posting..." : "Post Job"}
                </button>
                <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateJobPage
