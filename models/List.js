const mongoose = require('mongoose')
const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title must be provided'],
      minLength: [3, 'Title must have at least 3 characters'],
      maxLength: [50, 'Title must have at most 50 characters'],
    },
    context: {
      type: String,
      default: 'Default',
      maxLength: [10000, 'Context must have at most 10000 characters'],
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      default: 'natural',
      enum: {
        values: ['vital', 'important', 'natural'],
        message: 'State must be vital, important or natural',
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id must be provided'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('List', ListSchema)
