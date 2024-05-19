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
  const result = await blog.save()
  response.status(201).json(result)

})
blogsRouter.delete('/:id', async(request, response)=>{
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
blogsRouter.put('/:id', async(request, response)=>{
  const body = request.body
  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, body, {new: true})
  response.json(updatedNote)
})
module.exports = blogsRouter