const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    published: Number,
    genres: [String]
})

const Book = mongoose.model('Book', bookSchema)

const books = [
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution']
  }
]

Book.insertMany(books)
  .then(result => {
    console.log('books saved!')
    console.log(result)
    return Book.find({})
  })
  .then(books => {
    console.log('all books:')
    books.forEach(book => {
      console.log(book)
    })
    mongoose.connection.close()
  })
  .catch(error => {
    console.error('Error:', error)
    mongoose.connection.close()
  })
