const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const app = express()
app.use(cookieParser()) 
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

// require all the routes here 
const authRouter = require('./routes/auth.routes')
app.use('/api/auth',authRouter)

module.exports = app