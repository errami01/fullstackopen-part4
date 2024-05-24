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
        const blogsInDB = await helper.blogsInDB()
        assert.notEqual(blogsInDB[0].id, undefined)
    })
    test('A blog can be added', async()=>{
        const newBlog = {
            title: 'Portfolio',
            author: 'Abdellatif',
            url: 'https://www.erramidev.xyz',
            likes: 130
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length+1)
    })
    test('likes property will default to 0 if missing', async ()=>{
        const blogWithoutLikes = {
            title: 'Portfolio',
            author: 'Abdellatif',
            url: 'https://www.erramidev.xyz',
        }
        const response = await api
            .post('/api/blogs')
            .send(blogWithoutLikes)
        assert.strictEqual(response.body.likes, 0)
    })
    test('blog without title is not added', async ()=>{
        const newBlog= {
            author: 'Abdellatif',
            url: 'https://www.erramidev.xyz',
            likes: 50
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('blog without url is not added', async ()=>{
        const newBlog= {
            title: 'Portfolio',
            author: 'Abdellatif',
            likes: 50
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('a blog can be deleted', async()=>{
        const blogsAtStart = await helper.blogsInDB()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
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