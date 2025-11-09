// Simple toast notification utility
class Toast {
  constructor() {
    this.listeners = []
  }

  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback)
    }
  }

  show(message, type = "info", duration = 3000) {
    const id = Date.now()
    this.listeners.forEach((callback) => {
      callback({ id, message, type, duration })
    })

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id)
      }, duration)
    }
  }

  dismiss(id) {
    this.listeners.forEach((callback) => {
      callback({ id, dismiss: true })
    })
  }

  success(message, duration) {
    this.show(message, "success", duration)
  }

  error(message, duration) {
    this.show(message, "error", duration)
  }

  info(message, duration) {
    this.show(message, "info", duration)
  }
}

export const toast = new Toast()
