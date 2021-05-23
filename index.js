const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("passport")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

require("./config/connectdb")
require("./strategies/JwtStrategy")
require("./authenticate")

const userRouter = require("./routes/userRoutes")

const app = express()

app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

//Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))

app.use("/users", userRouter)

//Start the server in port 5000
const server = app.listen(process.env.PORT || 8081, function () {
  const port = server.address().port

  console.log("App started at port:", port)
})