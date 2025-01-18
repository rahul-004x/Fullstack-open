const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs',)
    response.json(users)
  })

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs')
    response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (!username || username.length < 3 || !password || password.length < 3) {
    return response.status(400).json({ error: 'username and password must be at least 3 characters' });
  }else{
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
})

module.exports = usersRouter