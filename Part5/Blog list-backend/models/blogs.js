const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery', false)

const url = config.MONGODB_URI

if (!url) {
  console.error('MONGODB_URI is not defined in the environment variables')
  process.exit(1)
}

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })

const blogSchema = new mongoose.Schema({
  title:String,
  author:String,
  url:String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)