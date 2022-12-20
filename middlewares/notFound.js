const { StatusCodes } = require('http-status-codes')
const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send("We don't have your request route")
}

module.exports = notFound
