require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 50,
      required: [true, 'Name must be provided'],
    },
    age: {
      type: Number,
      required: [true, 'Age must be provided'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email must be provided'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password must be provided'],
      minLength: [6, 'Password must have at least 6 characters'],
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJwt = function () {
  return jwt.sign(
    { userName: this.name, userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}

UserSchema.methods.checkPassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)
