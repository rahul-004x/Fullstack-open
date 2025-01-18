const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const authorsSchema = new mongoose.Schema({
    name: String,
    born: Number,
})

const Author = mongoose.model('Author', authorsSchema)

const authors = [
  {
    name: 'Robert Martin',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
  },
  { 
    name: 'Sandi Metz', // birthyear not known
  },
]

Author.insertMany(authors)
  .then(result => {
    console.log('authors saved!')
    console.log(result)
    return Author.find({})
  })
  .then(authors => {
    console.log('all authors:')
    authors.forEach(authors => {
      console.log(authors)
    })
    mongoose.connection.close()
  })
  .catch(error => {
    console.error('Error:', error)
    mongoose.connection.close()
  })
