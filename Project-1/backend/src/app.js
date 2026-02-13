const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")


app.use(cookieParser())
app.use(express.json())


const authRoutes = require("./routes/auth.routes")
const postRoutes = require("./routes/post.routes")
const multer = require('multer');

const upload = multer({storage: multer.memoryStorage()});


app.use("/api/posts", upload.single('file'), postRoutes)
app.use("/api/auth",authRoutes)

module.exports = app