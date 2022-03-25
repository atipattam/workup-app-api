require('dotenv').config()
require('express-async-errors')
// express

const express = require('express')
const app = express()
// rest of the packages
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})
// const session = require('express-session')
// database
const connectDB = require('./db/connect')

//  routers
const authRouter = require('./routes/authRoutes')
const userProfile = require('./routes/userProfileRoutes')
const uploadRoute = require('./routes/uploadRoutes')
const companyProfile = require('./routes/companyProfileRoutes')
const announceRoute = require('./routes/announcementRoute')
const companyRoute = require('./routes/companyRoute')
const applicationRoute = require('./routes/applicationRoute')
// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
app.set('trust proxy', 1)

app.use(
  cors({
    credentials: true,
    origin: [process.env.MYPORT, process.env.CLIENT_URL],
  })
)


app.use(express.json())
app.use(fileUpload({ useTempFiles: true }))
app.use(cookieParser(process.env.JWT_SECRET))

// app.use(express.static('./public'))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/userProfile', userProfile)
app.use('/api/v1', uploadRoute)
app.use('/api/v1/company', companyRoute)
app.use('/api/v1/announcement', announceRoute)
app.use('/api/v1/companyProfile', companyProfile)
app.use('/api/v1/application', applicationRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
