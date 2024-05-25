const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const middleware = require('../utils/middleware.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{blogs:0})
  response.json(blogs)
})
  
blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const user =  request.user
  const blog = new Blog({
    ...request.body,
    user: user.id,
    likes: request.body.likes || 0
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})
blogsRouter.delete('/:id', middleware.userExtractor, async(request, response)=>{
  const user =  request.user

  const blog = await Blog.findById(request.params.id)
  if(!blog){
    response.status(404).json({error: "The blog doesn't existe"}) 
  }
  if(user.id.toString() === blog.user.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else return response.status(401).json({ error: 'Unauthorized user' })
})
blogsRouter.put('/:id', async(request, response)=>{
  const body = request.body
  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, body, {new: true})
  response.json(updatedNote)
})
module.exports = blogsRouter