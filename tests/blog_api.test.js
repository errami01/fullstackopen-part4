const { test, after, describe, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const api = supertest(app)
beforeEach(async () => {
    const newUser = await helper.addTestUser()
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => {
        blog.user = newUser.id
        return new Blog(blog)
    })
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
        const blogsInDB = await helper.blogsInDB()
        assert.notEqual(blogsInDB[0].id, undefined)
    })
    test('A blog can be added', async()=>{
        const testUser = await helper.getTestUser()
        const newBlog = {
            title: 'Portfolio',
            author: 'Abdellatif',
            url: 'https://www.erramidev.xyz',
            likes: 130,
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length+1)
    })
    test('blog creation fails with proper statuscode and message if token is not provided', async()=>{
        const newBlog = {
            title: 'Portfolio',
            author: 'Abdellatif',
            url: 'https://www.erramidev.xyz',
            likes: 130,
        }
        const result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        assert(result.body.error.includes('token invalid'))
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('likes property will default to 0 if missing', async ()=>{
        const testUser = await helper.getTestUser()
        const blogWithoutLikes = {
            title: 'Portfolio',
            author: 'Abdellatif',
            url: 'https://www.erramidev.xyz',
        }
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send(blogWithoutLikes)
        assert.strictEqual(response.body.likes, 0)
    })
    test('blog without title is not added', async ()=>{
        const testUser = await helper.getTestUser()
        const newBlog= {
            author: 'Abdellatif',
            url: 'https://www.erramidev.xyz',
            likes: 50
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send(newBlog)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('blog without url is not added', async ()=>{
        const testUser = await helper.getTestUser()
        const newBlog= {
            title: 'Portfolio',
            author: 'Abdellatif',
            likes: 50
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${testUser.token}`)
            .send(newBlog)
            .expect(400)
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('a blog can be deleted', async()=>{
        const testUser = await helper.getTestUser()      
        const blogsAtStart = await helper.blogsInDB()
        const blogToDelete = blogsAtStart.find(blog=> blog.user.toString() === testUser.id)  
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${testUser.token}`)
            .expect(204)
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length,  blogsAtStart.length-1)
    })
    test('updating likes', async()=>{
        const blogsInDB = await helper.blogsInDB()
        const blogAtStart = {
            ...blogsInDB[0],
            likes: 100
        }
        const response = await api
            .put(`/api/blogs/${blogAtStart.id}`)
            .send(blogAtStart)
            .expect(200)

        const blogAtEnd = await Blog.findById(blogAtStart.id)
        assert.strictEqual(blogAtEnd.likes, 100)
    })
})
after(async () => {
    await mongoose.connection.close()
})