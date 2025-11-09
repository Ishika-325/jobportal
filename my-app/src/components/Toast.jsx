"use client"

// Toast notification component
import { useState, useEffect } from "react"
import { toast } from "../utils/toast"

const Toast = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const unsubscribe = toast.subscribe((notification) => {
      if (notification.dismiss) {
        setToasts((prev) => prev.filter((t) => t.id !== notification.id))
      } else {
        setToasts((prev) => [...prev, notification])
      }
    })

    return unsubscribe
  }, [])

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className={`border px-4 py-3 rounded-lg shadow-lg ${getStyles(t.type)}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}

export default Toast
