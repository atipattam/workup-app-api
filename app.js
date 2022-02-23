require('dotenv').config()
require('express-async-errors')
// express

const express = require('express')
const app = express()
// rest of the packages
const cookieParser = require('cookie-parser')
const cors = require('cors')
// const session = require('express-session')
// database
const connectDB = require('./db/connect')

//  routers
const authRouter = require('./routes/authRoutes')
const userProfile = require('./routes/userProfileRoutes')
// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
app.set('trust proxy', 1)

// app.use(
//   session({
//     secret: 'supersecret',
//     saveUninitialized: true,
//     cookie: {
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
//       secure: process.env.NODE_ENV === 'production', // must be true if sameSite='none'
//     },
//     resave: false,
//   })
// )
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,UPDATE,OPTIONS'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  )
  next()
})
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }))
// credentials: true,
// allowedHeaders: ['Content-Type', 'Authorization'],
// origin: ['http://localhost:3000'],

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

// app.use(express.static('./public'))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/userProfile', userProfile)
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
