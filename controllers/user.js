const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} = require('../errors')
const register = async (req, res) => {
  // create user
  const user = await User.create(req.body)
  const token = user.createJwt()
  res.status(StatusCodes.CREATED).json({ user, token })
}

const login = async (req, res) => {
  // find user
  const {
    body: { email, password },
  } = req

  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthorizedError(`${email} have not authorized yet`)
  }

  const isPasswordValid = await user.checkPassword(password)

  if (!isPasswordValid) {
    throw new UnauthorizedError(`Wrong password`)
  }

  const token = user.createJwt()
  res.status(StatusCodes.CREATED).json({ user, token })
}
module.exports = { register, login }
