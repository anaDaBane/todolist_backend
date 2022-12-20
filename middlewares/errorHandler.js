const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const errorHandler = (err, req, res, next) => {
  const customError = {
    message: err.message || 'Something went wrong, please try again later',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  }
  // duplicate error
  if (err?.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.message = `${Object.keys(
      err.keyValue
    )} has already in use! Choose another one`
  }

  // cast error
  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.message = `Casting error in ${Object.keys(err.value).join(
      ', '
    )}`
  }
  //validation error
  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.message = `${Object.values(err.errors)
      .map((i) => i.message)
      .join(', ')}`
  }

  res.status(customError.statusCode).json({ message: customError.message })
}

module.exports = errorHandler
