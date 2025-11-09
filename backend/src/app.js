import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config() // load environment variables

const app = express()

// ----------------- MIDDLEWARE -----------------
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true // allow cookies
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

// ----------------- ROUTES IMPORT -----------------
import authRouter from "./routes/auth.routes.js"
import jobRouter from "./routes/job.routes.js"
import applicationRouter from "./routes/application.routes.js"

// ----------------- ROUTES DECLARATION -----------------
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", jobRouter)
app.use("/api/v1/applications", applicationRouter)

// ----------------- DEFAULT ERROR HANDLER -----------------
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  })
})

export { app }
