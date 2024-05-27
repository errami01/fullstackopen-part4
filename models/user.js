const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.NODE_ENV === 'test' 
? process.env.TEST_MONGODB_URI
: process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // this ensures the uniqueness of username
        minlength: 3
      },
    name: String,
    passwordHash: {
        type: String,
        required: true
    },
    blogs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    } ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.passwordHash
    }
  })
userSchema.set('toObject', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User