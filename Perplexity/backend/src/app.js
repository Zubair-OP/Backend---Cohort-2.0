import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { authRateLimit, generalRateLimit } from "./middleware/rateLimit.middleware.js";

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Static files
app.use(express.static("public"));

// CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Logging (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// General rate limiting
app.use(generalRateLimit);

// Routes
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import transcribeRoutes from "./routes/transcribe.routes.js";

app.use("/api/auth", authRateLimit, authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/transcribe", transcribeRoutes);

import path from "path";

// SPA Fallback for client-side routing & 404 handler
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ success: false, message: "Not found" });
  }
  res.sendFile(path.resolve("public", "index.html"));
});

// Global error handler — never leak internal details to the client
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err?.message || err);

  // Handle multer file validation errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File too large. Maximum size is 10 MB.",
    });
  }

  if (err.message?.includes("Unsupported audio format")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err?.status || 500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
