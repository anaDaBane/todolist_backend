const {
  getAllList,
  getList,
  createList,
  updateList,
  deleteList,
} = require('../controllers/list')

const express = require('express')
const router = express.Router()

router.route('/').get(getAllList).post(createList)
router.route('/:id').get(getList).patch(updateList).delete(deleteList)
module.exports = router
