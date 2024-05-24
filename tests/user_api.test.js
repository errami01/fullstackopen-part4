const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
describe('username tests',()=>{
    test('creation fails with proper statuscode and message if username is short', async()=>{
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username:'an',
            name: 'Ali',
            password: '1234'
        }
        const response = await api
                            .post('/api/users')
                            .send(newUser)
                            .expect(400)
        assert(response.body.error.includes('shorter than the minimum allowed length (3)'))
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)


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
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
      test('creation fails with proper statuscode and message if username is missing', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes("`username` is required"))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
})
describe('password tests', ()=>{
    test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
            username: 'abo9al',
            name: 'Superuser',
            password: 'sa',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes("Password must be at least 3 characters long"))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
      test('creation fails with proper statuscode and message if password is not provided', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
            username: 'abo9al',
            name: 'Superuser',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes("Password is required"))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
})
after(async () => {
    await mongoose.connection.close()
})