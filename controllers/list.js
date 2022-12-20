const List = require('../models/List')
const { StatusCodes } = require('http-status-codes')
const {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} = require('../errors')

const getAllList = async (req, res) => {
  const {
    user: { userId },
    query: { title, context, state, isComplete, sort, fields },
  } = req
  let queryObj = {}
  if (isComplete) {
    queryObj.isComplete = isComplete === 'true'
  }

  if (title) {
    queryObj.title = { $options: 'i', $regex: title }
  }

  if (context) {
    queryObj.context = { $options: 'i', $regex: title }
  }

  if (state) {
    queryObj.state = state
  }

  let result = List.find({ createdBy: userId, ...queryObj })

  //sort
  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result.sort('createdAt')
  }

  if (fields) {
    const selectList = fields.split(',').join(' ')
    result = result.select(selectList)
  }

  const page = req.query.page || 1
  const limit = req.query.limit || 10
  const skip = (page - 1) * limit
  result = result.skip(skip).limit(limit)
  const lists = await result
  res.status(StatusCodes.OK).json({ count: lists.length, lists })
}

const createList = async (req, res) => {
  const {
    user: { userId },
  } = req
  const list = await List.create({ createdBy: userId, ...req.body })
  res.status(StatusCodes.CREATED).json({ list })
}

const getList = async (req, res) => {
  const {
    user: { userId },
    params: { id: listId },
  } = req
  const list = await List.findById({ createdBy: userId, _id: listId })
  if (!list) {
    throw new BadRequestError(`There is no list for id ${listId}`)
  }
  res.status(StatusCodes.OK).json({ list })
}

const updateList = async (req, res) => {
  const {
    user: { userId },
    params: { id: listId },
    body: { title, context, isComplete, state },
  } = req
  if (!title && !context && !isComplete && !state) {
    throw new BadRequestError('You updated nothing')
  }
  const list = await List.findByIdAndUpdate(
    { createdBy: userId, _id: listId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!list) {
    throw new BadRequestError(`There is no list for id ${listId}`)
  }
  res.status(StatusCodes.OK).json({ list })
}

const deleteList = async (req, res) => {
  const {
    user: { userId },
    params: { id: listId },
  } = req
  const list = await List.findByIdAndDelete({ createdBy: userId, _id: listId })
  if (!list) {
    throw new BadRequestError(`There is no list for id ${listId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = { getAllList, getList, createList, updateList, deleteList }
