const express = require("express")
const app = express()
const cookieParser = require("cookie-parser");
const cors = require("cors");


app.use(cookieParser())
app.use(express.json())


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


const authRoutes = require("./routes/auth.routes")
const postRoutes = require("./routes/post.routes")
const followRoutes = require("./routes/follow.routes")
const likeRoutes = require("./routes/like.routes")
const multer = require('multer');

const upload = multer({storage: multer.memoryStorage()});


app.use("/api/posts", upload.single('file'), postRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/users", followRoutes)
app.use("/api/likes", likeRoutes)
module.exports = app