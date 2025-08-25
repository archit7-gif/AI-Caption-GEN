

const express = require('express');
const cors = require('cors')
const authroutes = require("./routes/auth.routes");
const postRoutes = require('./routes/post.routes');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes')


const app = express();

app.use(cors({
origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
allowedHeaders: ["Content-Type", "Authorization"],
credentials: true,
}))

app.use(express.json())
app.use(cookieParser())


app.use("/api/auth",authroutes)
app.use("/api/posts",postRoutes)
app.use('/api/users', userRoutes );


// last commit





module.exports = app
