import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Toast from "./components/Toast"
import ProtectedRoute from "./components/ProtectedRoute"

// Pages (will be created next)
import HomePage from "./pages/HomePage"
import JobDetailPage from "./pages/JobDetailPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import CreateJobPage from "./pages/CreateJobPage"
import EditJobPage from "./pages/EditJobPage"
import ProfilePage from "./pages/ProfilePage"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toast />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/job/:id" element={<JobDetailPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-job"
            element={
              <ProtectedRoute requiredRole="employer">
                <CreateJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute requiredRole="employer">
                <EditJobPage />
              </ProtectedRoute>
            }
          />
          

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
