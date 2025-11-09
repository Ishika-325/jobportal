"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../utils/api"
import { toast } from "../utils/toast"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ✅ Fetch current user using cookie
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      try {
        const response = await api.get("/auth/me", { withCredentials: true })
        if (response.data?.user) {
          setUser(response.data.user)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // ✅ LOGIN
  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      )

      const userData = response.data?.user
      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(userData))
        toast.success("Login successful!")
        return true
      } else {
        toast.error("Login failed: Invalid response")
        return false
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  // ✅ REGISTER
  const register = async (fullname, email, password, role) => {
    setLoading(true)
    try {
      const response = await api.post(
        "/auth/register",
        { fullname, email, password, role },
        { withCredentials: true }
      )

      const userData = response.data?.user
      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(userData))
        toast.success("Registration successful!")
        return true
      } else {
        toast.error("Registration failed: Invalid response")
        return false
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  // ✅ LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true })
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Logout request failed, clearing local session anyway")
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
