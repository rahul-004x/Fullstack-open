const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.Mixed, // Allow both string and number
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String }
  ]
})

module.exports = mongoose.model('Book', schema)