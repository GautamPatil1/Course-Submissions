const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mulukka',
      name: 'Muluken',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username is already in use.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('should create a new user with valid username and password', async () => {
    const newUser = {
      username: 'newuser',
      password: 'password123',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)
    // console.log(response.body)
    expect(response.status).toBe(200)
    expect(response.body.username).toEqual(newUser.username)
    expect(response.body.name).toEqual(newUser.name)
    // expect(response.body.passwordHash).not.toEqual(newUser.password)

    const savedUser = await User.findOne({ username: newUser.username })
    // console.log(savedUser)
    expect(savedUser.username).toEqual(newUser.username)
    expect(savedUser.passwordHash).not.toEqual(newUser.password)
  })

  test('should return an error if username is not provided', async () => {
    const newUser = {
      password: 'password123',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toContain(
      'Both username and password must be provided.'
    )
  })

  test('should return an error if password is not provided', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toContain(
      'Both username and password must be provided.'
    )
  })

  test('should return an error if username is not unique', async () => {
    const existingUser = new User({
      username: 'existinguser',
      passwordHash: await bcrypt.hash('password123', 10),
      name: 'Existing User',
    })
    await existingUser.save()

    const newUser = {
      username: 'existinguser',
      password: 'password123',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toContain('Username is already in use.')
  })

  test('should return an error if username or password is too short', async () => {
    const newUser = {
      username: 'u',
      password: 'p',
      name: 'New User',
    }

    const response = await api.post('/api/users').send(newUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toContain(
      'Username and password must be at least 3 characters long.'
    )
  })
})
