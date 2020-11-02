const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true
    },
    balance: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
)

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
