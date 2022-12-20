require('dotenv').config()
const jwt = require('jsonwebtoken')
const {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} = require('../errors')
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new BadRequestError('Token must be provided')
  }
  const token = authHeader.split(' ')[1]
  try {
    const { userId, userName } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userId, userName }
    next()
  } catch (error) {
    throw new UnauthorizedError('Token is invalid')
  }
}

module.exports = auth
