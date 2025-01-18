const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const url = "mongodb+srv://rahul004:kJLEUBLZiUF9Eb0C@full-stack.srh2y.mongodb.net/testBlogList?retryWrites=true&w=majority"

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', noteSchema)

const blog = new Blog({

    title: 'Why do React components need to start with capital letters?',
    author: 'Rahul',
    url: 'https://www.google.com',
    likes: 100

})

blog.save().then(result => {
  console.log('blog saved!')
  console.log(result)
  mongoose.connection.close()
})


Blog.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})