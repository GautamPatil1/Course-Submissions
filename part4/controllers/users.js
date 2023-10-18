const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
require('express-async-errors')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  // Check if both username and password are provided
  if (!body.username || !body.password) {
    return response
      .status(400)
      .json({ error: 'Both username and password must be provided.' })
  }

  // Check if username and password are at least 3 characters long
  if (body.username.length < 3 || body.password.length < 3) {
    return response.status(400).json({
      error: 'Username and password must be at least 3 characters long.',
    })
  }

  // Check if the username is unique
  const existingUser = await User.findOne({ username: body.username })
  if (existingUser) {
    return response.status(400).json({ error: 'Username is already in use.' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = usersRouter
