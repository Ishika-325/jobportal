"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">JobPortal</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Browse Jobs
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              {user?.role === "employer" && (
                <Link to="/create-job" className="text-gray-700 hover:text-blue-600 font-medium">
                  Post Job
                </Link>
              )}

              <div className="flex items-center gap-4 border-l border-gray-200 pl-8">
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                  {user?.name}
                </Link>
                <button onClick={handleLogout} className="btn btn-primary text-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex flex-col gap-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="w-6 h-0.5 bg-slate-900"></div>
          <div className="w-6 h-0.5 bg-slate-900"></div>
          <div className="w-6 h-0.5 bg-slate-900"></div>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-3">
          {isAuthenticated ? (
            <>
              <Link to="/" className="block text-gray-700 hover:text-blue-600 font-medium py-2">
                Browse Jobs
              </Link>
              <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 font-medium py-2">
                Dashboard
              </Link>
              {user?.role === "employer" && (
                <Link to="/create-job" className="block text-gray-700 hover:text-blue-600 font-medium py-2">
                  Post Job
                </Link>
              )}
              <Link to="/profile" className="block text-gray-700 hover:text-blue-600 font-medium py-2">
                Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-primary w-full">
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" className="btn btn-secondary w-full">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary w-full">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
