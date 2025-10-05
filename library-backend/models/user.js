const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, 'Username must be unique'],
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

module.exports = mongoose.model('User', schema)
