require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const userRouter = require('./routes/user')
const listRouter = require('./routes/list')

const connectDB = require('./db/connect')

const authMiddleware = require('./middlewares/authentication')
const notFoundMiddleware = require('./middlewares/notFound')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
//secuirtysetup
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())
//middlewares
app.use(express.json())

// routes
app.use(express.static('./public'))
app.use('/api/v1/auth', userRouter)
app.use('/api/v1/list', authMiddleware, listRouter)

//notFound
app.use(notFoundMiddleware)
//errorHandler
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGOOSE_URI)
    console.log('DB connected')
    app.listen(port, () => console.log(`Express listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start()
