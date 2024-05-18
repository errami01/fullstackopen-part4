const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)
beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })
describe('blog api tests', ()=>{
    test('blogs are returned as json', async()=>{
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('All blogs are returned', async()=>{
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    test("the unique identifier property of the blog posts is named id", async ()=>{
        const noteInDB = await helper.blogsInDb()
        assert.notEqual(noteInDB[0].id, undefined)
    })
})
after(async () => {
    await mongoose.connection.close()
})