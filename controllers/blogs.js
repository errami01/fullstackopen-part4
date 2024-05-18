const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response, next) => {
const blog = new Blog({
  ...request.body,
  likes: request.body.likes || 0
})
try{
  const result = await blog.save()
  response.status(201).json(result)
}
catch(exception){
  next(exception)
}
})

module.exports = blogsRouter